// Composite clip-backed film scenes. Usage: node compose.mjs <film dir> --renditions master,720p|master|720p
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { availableParallelism } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib.js';

const render = fileURLToPath(new URL('./render.js', import.meta.url));
const ff = process.env.FFMPEG || 'ffmpeg';
const json = async path => JSON.parse(await readFile(path, 'utf8'));

function run(command, args) {
  return new Promise((ok, fail) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', fail);
    child.on('close', (code, signal) => {
      if (code === 0) ok();
      else fail(new Error(`${basename(command)} exited with ${signal || code}`));
    });
  });
}

const encode = args => run(ff, ['-nostdin', '-v', 'error', '-xerror', '-y', ...args]);

// The canvas draws the scene containing t = frame / fps. Internal cuts therefore fall on the
// first sample at or after the cut. Only the film's final boundary is rounded to nearest.
function sceneSlices(timeline, fps) {
  const total = Math.round(timeline.duration * fps);
  let first = 0, previousEnd = 0;
  const ids = new Set();
  return timeline.scenes.map(({ id, start, end }, i) => {
    if (!id || ids.has(id) || start !== previousEnd || !(end > start)) throw Error(`invalid scene ${i}: ${id}`);
    ids.add(id);
    previousEnd = end;
    const nearest = Math.round(end * fps);
    let stop = nearest / fps < end ? nearest + 1 : nearest;
    if (i === timeline.scenes.length - 1) {
      if (end !== timeline.duration) throw Error('last scene must end at the timeline duration');
      stop = total;
    }
    if (stop <= first) throw Error(`scene ${id} has no frames`);
    const slice = { id, i, first, stop };
    first = stop;
    return slice;
  });
}

async function renderScene({ id, i, first, stop }, clip, viewport, fps, sizes, out, work) {
  const count = stop - first;
  // render.js rounds its start and ceils its end. A quarter-frame inset on the exclusive
  // end gives ceil() the same integer even when division by fps is inexact.
  const range = [render, out, '--fps', String(fps), '--start', String(first / fps),
    '--end', String((stop - 0.25) / fps)];
  const outputs = sizes.map(size => join(work, `${size === 'master' ? 'seg' : 'seg720'}_${i}.mp4`));
  // concat's demuxer advances by each container duration. Use a movie timescale divisible
  // by fps so a fractional millisecond at a scene boundary never accumulates in the mux.
  const timescale = ['-movie_timescale', String(fps * 1000)];
  console.log(`compose: ${id} [${first}, ${stop}) ${clip ? basename(clip) : 'opaque canvas'}`);
  if (!clip) {
    const args = [...range, '--renditions', sizes.join(',')];
    for (const [j, size] of sizes.entries()) {
      args.push(size === 'master' ? '--output' : '--output-720p', outputs[j] + '.render.mp4');
    }
    await run(process.execPath, args);
    for (const output of outputs) {
      await encode(['-i', output + '.render.mp4', '-c', 'copy', ...timescale, output]);
      await rm(output + '.render.mp4');
    }
    return;
  }

  const overlay = join(work, `hud_${i}.mov`), loop = join(work, `loop_${i}.mp4`);
  await run(process.execPath, [...range, '--alpha', '--output', overlay]);
  // One lossless cycle on disk keeps memory independent of scene length. Omit the
  // endpoints of the reverse leg: 0,1,...,N-1,N-2,...,1, then restart at 0.
  const cycle = `[0:v]fps=${fps},split[f][r];[r]trim=start_frame=1,reverse,trim=start_frame=1,` +
    'setpts=PTS-STARTPTS[back];[f][back]concat=n=2:v=1:a=0[v]';
  await encode(['-i', clip, '-filter_complex', cycle, '-map', '[v]', '-an',
    '-c:v', 'libx264', '-threads', '2', '-preset', 'ultrafast', '-qp', '0', ...timescale, loop]);

  const { x, y, w, h } = viewport;
  const filters = [
    `[0:v]scale=${w}:${h}:force_original_aspect_ratio=increase:flags=lanczos,` +
      `format=yuv444p,crop=${w}:${h},setsar=1,pad=1920:1080:${x}:${y}[plate]`,
    '[plate][1:v]overlay=shortest=1:format=yuv444,format=yuv420p[composite]'
  ];
  const pads = sizes.map((_, j) => `[v${j}]`);
  const dual = sizes.length === 2;
  if (dual) filters.push(`[composite]split${pads.join('')}`);
  const args = [];
  for (const [j, size] of sizes.entries()) {
    let pad = dual ? pads[j] : '[composite]';
    const small = size === '720p';
    if (small) {
      filters.push(`${pad}scale=1280:720:flags=lanczos[small]`);
      pad = '[small]';
    }
    args.push('-map', pad, '-frames:v', String(count), '-c:v', 'libx264', '-threads', '2',
      '-preset', small ? 'slow' : 'medium', '-crf', small ? '19' : '17', '-pix_fmt', 'yuv420p',
      ...timescale, outputs[j]);
  }
  await encode(['-stream_loop', '-1', '-i', loop, '-i', overlay, '-filter_complex_threads', '2',
    '-filter_complex', filters.join(';'), ...args]);
  await rm(loop);
  await rm(overlay);
}

async function main() {
  const { pos, opt } = parseArgs(process.argv.slice(2));
  const sizes = String(opt.renditions).split(',');
  if (pos.length !== 1 || new Set(sizes).size !== sizes.length || sizes.some(s => !['master', '720p'].includes(s))) {
    throw Error('usage: node compose.mjs <film dir> --renditions master,720p|master|720p');
  }
  const film = resolve(pos[0]), out = join(film, 'out');
  const { viewport, scenes, loop } = await json(join(film, 'clips.json'));
  const { x, y, w, h } = viewport;
  if (![x, y, w, h].every(Number.isInteger) || x < 0 || y < 0 || w <= 0 || h <= 0 ||
      x + w > 1920 || y + h > 1080 || loop !== 'ping-pong') throw Error('invalid clip viewport or loop');
  const clips = new Map(), missing = [];
  for (const [id, file] of Object.entries(scenes)) {
    if (!file || basename(file) !== file || file === '.' || file === '..') throw Error(`expected a clip filename for ${id}`);
    const path = join(out, 'clips', file);
    clips.set(id, path);
    const info = await stat(path).catch(e => { if (e.code !== 'ENOENT') throw e; });
    if (!info) missing.push(path);
    else if (!info.isFile() || !info.size) throw Error(`invalid clip: ${path}`);
  }
  if (!clips.size) throw Error('empty clip manifest');
  if (missing.length) {
    console.error('compose: missing live 3D clips:\n' + missing.join('\n'));
    return process.env.FILM_REQUIRE_CLIPS === '1' ? 1 : 3;
  }

  const { resolution } = await json(join(film, 'film.json'));
  const fps = Number(resolution.split('@')[1]);
  if (!Number.isInteger(fps) || fps <= 0) throw Error(`invalid resolution: ${resolution}`);
  const slices = sceneSlices(await json(join(out, 'timeline.json')), fps);
  for (const id of clips.keys()) {
    if (!slices.some(s => s.id === id)) throw Error(`unknown clip scene: ${id}`);
  }
  const workers = Number(process.env.FILM_WORKERS || Math.min(3, availableParallelism()));
  if (!Number.isInteger(workers) || workers < 1) throw Error('FILM_WORKERS must be a positive integer');
  const work = await mkdtemp(join(out, '.compose-'));
  try {
    const queue = slices.values();
    async function worker() {
      for (const s of queue) await renderScene(s, clips.get(s.id), viewport, fps, sizes, out, work);
    }
    const jobs = Array.from({ length: Math.min(workers, slices.length) }, worker);
    const results = await Promise.allSettled(jobs);
    for (const r of results) if (r.status === 'rejected') throw r.reason;

    await writeFile(join(work, 'segments.txt'), slices.length + '\n');
    for (const { i } of slices) {
      for (const size of sizes) {
        const file = `${size === 'master' ? 'seg' : 'seg720'}_${i}.mp4`;
        await rename(join(work, file), join(out, file));
      }
    }
    await rename(join(work, 'segments.txt'), join(out, 'segments.txt'));
    console.log(`compose: ${slices.length} segments, ${slices.at(-1).stop} frames at ${fps} fps`);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
  return 0;
}

try { process.exitCode = await main(); }
catch (error) { console.error(`compose: ${error.message}`); process.exitCode = 1; }

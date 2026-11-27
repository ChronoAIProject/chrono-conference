// theme/typst/cover.typ — the trureturing book cover, in two polarities (Scheme B).
//
// `tr-cover(meta, variant: "screen" | "print" | "academic")` fills the current container (use a page
// with zero margins). Everything is drawn in Typst, on a Swiss architectural grid: a hairline frame with
// crop marks, the series line and the edition language tag, the book code CODE//NAME, title, subtitle,
// authors, a LEAN ✓ <N> stamp (N = formal environments) and the pinned trureturing commit.
//
//   daylight    (meta.polarity "daylight" — ChronoAI books — and every "print" cover): warm architectural
//               stone, charcoal ink, a ruled grid of ticks and a drafting arc over one horizon line.
//   deep-space  (the default — The Omega Institute books on screen): obsidian, with an astrolabe of fine
//               silver orbits behind the type, one orbit picked out in ice-silver.
// No glow, no scanlines, no glitch, no perspective grid. "academic" is the plain scholarly title page.
//
// `meta` is the JSON written by tools/tbook/pandoc.py (book_meta); tools/tbook/cover.py
// renders the cover alone (PNG 1600×2560 for EPUB and book cards, PDF, SVG) and
// theme/typst/book.typ draws it as the first page of the PDF. Colours come only from
// theme/generated/tokens.typ.

#import "../generated/tokens.typ": tr-screen, tr-paper

#let cover-display = ("Oswald", "Chakra Petch", "Inter", "DejaVu Sans")
#let cover-cjk-sans = ("Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", "PingFang SC", "WenQuanYi Zen Hei")
#let cover-mono = ("JetBrains Mono", "DejaVu Sans Mono", ..cover-cjk-sans)

#let cover-heading(cjk) = if cjk {
  ((name: "Oswald", covers: "latin-in-cjk"), (name: "Chakra Petch", covers: "latin-in-cjk"),
   (name: "Inter", covers: "latin-in-cjk"), ..cover-cjk-sans, "DejaVu Sans")
} else { (..cover-display, ..cover-cjk-sans) }

// Text scaled so that its natural width is `width` (capped at `max`).
#let fit-size(body-fn, width, max) = {
  let probe = measure(body-fn(10pt))
  if probe.width == 0pt { max } else { calc.min(max, 10pt * (width / probe.width)) }
}

// An open circular arc through `steps` segments; angles counter-clockwise from the positive x axis.
#let arc-curve(cx, cy, r, from, to, stroke, steps: 72) = {
  let pts = range(steps + 1).map(i => {
    let a = from + (to - from) * (i / steps)
    (cx + r * calc.cos(a), cy - r * calc.sin(a))
  })
  curve(stroke: stroke, curve.move(pts.first()), ..pts.slice(1).map(p => curve.line(p)))
}

#let tr-cover(meta, variant: "screen") = layout(size => {
  let W = size.width
  let H = size.height
  let polarity = meta.at("polarity", default: "deep-space")
  let is-daylight = (polarity == "daylight") or (variant == "print")
  let dark = variant == "screen" and not is-daylight
  let pal = if dark { tr-screen } else { tr-paper }
  let S = meta.strings
  let cjk = meta.at("cjk", default: false)
  let u = W / 100
  let fade(c, pct) = c.transparentize(pct)
  // independent of the book's paragraph settings (indent, justification, CJK spacing)
  set par(first-line-indent: 0pt, justify: false, spacing: 0.6em)
  set text(hyphenate: false)

  if variant == "academic" {
    place(rect(width: W, height: H, fill: pal.void))
    place(dx: W * 0.13, dy: H * 0.15, block(width: W * 0.75, height: H * 0.72, {
      set par(first-line-indent: 0pt, justify: false, leading: 0.45em)
      set text(font: ("Libertinus Serif", "New Computer Modern", "Noto Serif CJK SC", "Noto Serif SC"), fill: pal.ink)
      block(text(size: W * 0.028, meta.authors.join(", ")))
      v(H * 0.08)
      block(text(size: W * 0.056, weight: "bold", meta.title))
      v(H * 0.035)
      block(text(size: W * 0.027, meta.subtitle.replace(regex("\\s*=\\s*"), "\u{A0}=\u{A0}")))
      v(1fr)
      block(text(size: W * 0.021, meta.publisher))
      v(H * 0.012)
      block(text(size: W * 0.018, [#S.lang_name · #meta.date.year]))
    }))
    return
  }

  let m = 5 * u                       // the frame, inset from the trim
  let x0 = m + 3 * u                  // the text column
  let horizon = H * 0.665
  let ink = pal.ink
  let rule = pal.line-hot
  let hair = pal.panel-edge
  let accent = pal.cyan               // ice-silver by night, architectural ink by day
  let second = pal.magenta            // optical silver by night, graphite by day
  let mono(sz, fill, body) = text(font: cover-mono, size: sz, fill: fill, tracking: 0.12em, body)

  // ---------------------------------------------------------------- ground
  if dark {
    place(rect(width: W, height: H, fill: pal.void-deep))
    // a faint high-altitude wash of light at the top edge
    place(rect(width: W, height: H, fill: gradient.radial(
      (fade(accent, 92%), 0%), (fade(accent, 100%), 100%), center: (50%, 0%), radius: 78%)))
  } else {
    place(rect(width: W, height: H, fill: pal.void))
  }

  // ---------------------------------------------------------------- the instrument
  // Drawn inside the frame (clipped there), so no line crosses the margin.
  let fw = W - 2 * m
  let fh = H - 2 * m
  place(dx: m, dy: m, box(width: fw, height: fh, clip: true, {
    if dark {
      // astrolabe: concentric orbits around a point right of centre, on the horizon
      let ax = W * 0.68 - m
      let ay = horizon - m
      for (k, r) in (0.08, 0.15, 0.22, 0.30, 0.38, 0.46).enumerate() {
        let rr = W * r
        let a = 58% + 6% * k
        place(dx: ax - rr, dy: ay - rr, circle(radius: rr, stroke: 0.45pt + fade(second, a)))
      }
      // the ecliptic: one tilted ellipse across the orbits
      let ew = W * 0.92
      let eh = W * 0.2
      place(dx: ax - ew / 2, dy: ay - eh / 2, rotate(-14deg, ellipse(width: ew, height: eh,
        stroke: 0.4pt + fade(second, 72%))))
      // degree scale on the 0.30 orbit: a tick every 5°, longer every 30°
      let rs = W * 0.30
      for i in range(72) {
        let ang = i * 5deg
        let major = calc.rem(i, 6) == 0
        let r0 = rs - (if major { 2.2 * u } else { 1.1 * u })
        place(line(start: (ax + r0 * calc.cos(ang), ay - r0 * calc.sin(ang)),
          end: (ax + rs * calc.cos(ang), ay - rs * calc.sin(ang)),
          stroke: (if major { 0.6pt } else { 0.35pt }) + fade(second, if major { 30% } else { 55% })))
      }
      // one orbit picked out, with the body that travels it
      let ro = W * 0.38
      place(arc-curve(ax, ay, ro, 118deg, 166deg, 1pt + accent))
      let pa = 166deg
      place(dx: ax + ro * calc.cos(pa) - 0.7 * u, dy: ay - ro * calc.sin(pa) - 0.7 * u,
        circle(radius: 0.7 * u, fill: accent))
      place(dx: ax - 0.45 * u, dy: ay - 0.45 * u, circle(radius: 0.45 * u, fill: fade(second, 20%)))
      // the horizon through the centre
      place(line(start: (0pt, ay), end: (fw, ay), stroke: 0.4pt + fade(second, 62%)))
    } else {
      // a ruled field of crosses at every grid node: the drawing board
      let step = 10 * u
      for gx in range(1, int(fw / step)) {
        for gy in range(1, int(fh / step)) {
          let x = gx * step
          let y = gy * step
          place(line(start: (x - 0.6 * u, y), end: (x + 0.6 * u, y), stroke: 0.3pt + hair))
          place(line(start: (x, y - 0.6 * u), end: (x, y + 0.6 * u), stroke: 0.3pt + hair))
        }
      }
      // the horizon, and a drafting arc standing on it (an elevation, not a sun)
      let ay = horizon - m
      let ax = W * 0.66 - m
      let ra = W * 0.24
      place(line(start: (0pt, ay), end: (fw, ay), stroke: 0.7pt + ink))
      place(arc-curve(ax, ay, ra, 0deg, 180deg, 0.5pt + second))
      place(arc-curve(ax, ay, ra * 0.62, 0deg, 180deg, 0.35pt + fade(second, 35%)))
      place(line(start: (ax, ay), end: (ax, ay - ra - 2 * u), stroke: 0.35pt + fade(second, 20%)))
      // scale ticks along the horizon, a long one every fifth
      for i in range(0, int(fw / (2 * u)) + 1) {
        let x = i * 2 * u
        let long = calc.rem(i, 5) == 0
        place(line(start: (x, ay), end: (x, ay + (if long { 1.6 * u } else { 0.8 * u })), stroke: 0.35pt + ink))
      }
    }
  }))
  // keep the authors, stamp and commit legible over the instrument
  if dark {
    place(dy: H * 0.72, rect(width: W, height: H * 0.28, fill: gradient.linear(
      (fade(pal.void-deep, 100%), 0%), (fade(pal.void-deep, 35%), 45%), (fade(pal.void-deep, 12%), 100%), angle: 90deg)))
  }

  // ---------------------------------------------------------------- frame
  place(dx: m, dy: m, rect(width: fw, height: fh, stroke: 0.5pt + rule))
  // crop marks outside the four corners
  let cm = 2.6 * u
  let gap = 0.9 * u
  for (x, y, sx, sy) in ((m, m, -1, -1), (W - m, m, 1, -1), (m, H - m, -1, 1), (W - m, H - m, 1, 1)) {
    place(line(start: (x + sx * gap, y), end: (x + sx * (gap + cm), y), stroke: 0.4pt + rule))
    place(line(start: (x, y + sy * gap), end: (x, y + sy * (gap + cm)), stroke: 0.4pt + rule))
  }

  // ---------------------------------------------------------------- top strip
  place(dx: x0, dy: m + 3.2 * u, mono(2.1 * u, accent, upper(S.series)))
  let tag = box(stroke: 0.5pt + rule, inset: (x: 1.2 * u, y: 0.8 * u),
    mono(2.1 * u, ink, [#S.lang_short #text(fill: pal.dim)[· #S.lang_name]]))
  place(top + right, dx: -(m + 3 * u), dy: m + 2.3 * u, tag)
  place(dx: x0, dy: m + 6.6 * u, line(length: W - 2 * m - 6 * u, stroke: 0.4pt + hair))

  // ---------------------------------------------------------------- book code
  let code = meta.code
  let code-parts = code.split("//")
  let code-body(sz) = text(font: cover-display, weight: 700, size: sz, tracking: 0.04em, {
    if code-parts.len() > 1 {
      text(fill: ink, code-parts.first())
      text(fill: second, "//")
      text(fill: ink, code-parts.slice(1).join("//"))
    } else { text(fill: ink, code) }
  })
  let code-w = W - 2 * m - 8 * u
  let csz = fit-size(code-body, code-w, 12 * u)
  let code-y = m + 10.5 * u
  place(dx: x0, dy: code-y, code-body(csz))
  let ch = measure(code-body(csz)).height
  // the data line under the code: version and date
  let data-y = code-y + ch + 2.4 * u
  place(dx: x0, dy: data-y, mono(1.8 * u, pal.dim,
    [v#meta.version #h(1.2 * u) #text(fill: rule)[/] #h(1.2 * u) #meta.date.iso]))

  // ---------------------------------------------------------------- title block
  let title-font = cover-heading(cjk)
  let tw = W - 2 * m - 10 * u
  let title-size = if cjk { 7.4 * u } else { 7.0 * u }
  let title-y = H * 0.235
  place(dx: x0, dy: title-y, block(width: tw, {
    set par(leading: if cjk { 0.42em } else { 0.32em }, justify: false)
    text(font: title-font, weight: 700, size: title-size, fill: ink, hyphenate: false, meta.title)
    if meta.subtitle != "" {
      v(2.6 * u)
      block(width: tw * 0.92, {
        set par(leading: 0.55em)
        text(font: title-font, weight: 400, size: if cjk { 2.9 * u } else { 2.8 * u }, fill: pal.sigma, meta.subtitle)
      })
    }
    v(2.4 * u)
    // a scale bar: one long segment in the accent, one short in the second accent
    box(width: 9 * u, height: 0.3 * u, fill: accent)
    h(0.8 * u)
    box(width: 2 * u, height: 0.3 * u, fill: second)
  }))

  // ---------------------------------------------------------------- authors + publisher
  let authors = meta.authors.join(if cjk { "、" } else { ", " })
  place(dx: x0, dy: H * 0.775, block(width: W * 0.5, {
    set par(leading: 0.5em)
    text(font: title-font, weight: 600, size: 2.9 * u, fill: ink, authors)
    v(0.6 * u)
    mono(1.7 * u, pal.dim, meta.publisher)
  }))

  // ---------------------------------------------------------------- LEAN ✓ stamp
  let ok = pal.ok
  let stamp = box(stroke: 0.9pt + ok, inset: 0.6 * u, box(stroke: 0.4pt + ok, inset: (x: 2 * u, y: 1.3 * u),
    fill: if dark { fade(pal.void-deep, 15%) } else { pal.void }, align(center, {
      text(font: cover-display, weight: 700, size: 4.4 * u, fill: ok, tracking: 0.06em)[LEAN ✓ #meta.formal_count]
      v(0.4 * u, weak: true)
      text(font: title-font, size: 1.55 * u, fill: ok, tracking: 0.08em, upper(S.stamp_caption))
    })))
  place(top + right, dx: -(m + 4 * u), dy: H * 0.765, stamp)

  // ---------------------------------------------------------------- bottom strip
  let commit = meta.trureturing.short
  place(dx: x0, dy: H - m - 5.2 * u, line(length: W - 2 * m - 6 * u, stroke: 0.4pt + hair))
  place(dx: x0, dy: H - m - 4 * u, mono(1.75 * u, pal.dim, {
    [#S.pinned_short #text(fill: accent)[#meta.trureturing.repo.split("/").last()\@#if commit != "" { commit } else { "unpinned" }]]
  }))
  place(top + right, dx: -(m + 4 * u), dy: H - m - 4 * u, mono(1.75 * u, pal.faint, [#meta.date.year]))
})

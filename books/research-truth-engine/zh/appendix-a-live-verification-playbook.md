# 附录 A 发布会现场五步核验剧本：从猜想到 Lean 内核

在 2026 年 12 月 17 日发布会第二幕（16:20–16:35 SGT），我们不要求任何一位观众「凭信任鼓掌」。本附录把完整的**五步核验剧本**交到你手里——无论你正坐在直播间屏幕前，还是会后随时打开一台装有 Git 与 `elan` 的笔记本电脑，都能用下面分毫不差的五步，把本书任意一条绿色内核结论独立重放到底。

## 五步现场点检（以 Fredkin 门反驳为例）

1. **第一步：选定一条带原始文献出处的具体命题。**
   例如第四章的 [@thm-fredkin-refutation]（反驳 Qiu–Song–Chen，*Phys. Rev. A* 2025 / `arXiv:2410.15253` 关于四量子比特 Fredkin 门跨越 `AD:BC` 切口纠缠产生上确界恰好等于 $2$ ebits 的猜想）。
2. **第二步：点击绿色 Lean 内核徽章或源码链接。**
   直达所钉提交 [{commit}](trureturing:) 下的精确文件 `D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean` 与目标声明行号。
3. **第三步：核查形式陈述是否忠实于原猜想。**
   通读文件开头的 `def claim : Prop := entanglementGeneration = 2` 以及 `theorem result : ¬ claim`，亲眼确认没有任何偷换定义、隐藏特设假设或 `sorry`。
4. **第四步：检查冻结状态与陈述哈希。**
   打开同模块对应的冻结记录 `Golden/Frozen/state/D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean.json`，核对声明种类为 `theorem`、陈述哈希 `statement_id` 与锁文件完全一致（公理闭包的完整编译期校验在第五步经 `#print axioms` 完成）。
5. **第五步：在本地独立运行 Lean 4 内核编译与 `#print axioms` 检查。**
   克隆 `the-omega-institute/trureturing`，检出所钉提交，运行单模块 `lake build` 并用 `lake env lean` 直接打印目标定理的公理依赖：

```bash
git clone https://github.com/the-omega-institute/trureturing.git
cd trureturing
git checkout <pinned-commit-from-trureturing.lock.json>
lake build D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation
lake env lean --stdin <<'EOF'
import D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation
#print axioms D5.S3.Quantum.Entanglement.FredkinEntanglingPowerRefutation.result
EOF
```

预期终端编译零错误，且 `#print axioms` 仅输出标准 Lean 公理（如 `propext`、`Classical.choice`、`Quot.sound`，不含 `sorryAx` 或自定义公理）。若你把第五步套用到第六章的蓝色零公理定理 [`d2_eq_zero_iff`](lean:D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff) 上，终端会直接打印**不依赖任何公理**（`'D5.S3.Quantum.AURICOmega.OmegaSimplicialExactness.d2_eq_zero_iff' does not depend on any axioms`）——官方 Lean 与裸 CIC `strict_omega` 双端均严格零公理；而对同章的 [`all_degree_peter_weyl_orthonormal`](lean:D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal)，官方 Lean 仅打印 `propext`（零选择公理、零商公理），裸 CIC `strict_omega` 则同样为零公理。只要这两道关卡全部通过，这条结论就不再依赖 ChronoAI、不再依赖 The Omega Institute、也不再依赖任何一位作者的声誉——它只依赖 Lean 4 内核本身。

> **关于全书引用的上游提交与重放入口**：正文统计表、全卷宏观快照与本仓库 `trureturing.lock.json` 统一锚定于所钉提交 [{commit}](trureturing:)（`548388cd`，`2026-11-27T20:40Z`：冻结定理 `223,231` 条、总冻结声明 `400,377` 条、`17,968` 个冻结模块、`20,223` 个 `.lean` 文件、`6,024,982` 行源码、`FibonacciAtomic` `341/339` 模块，以及 `2,278` 道公开文献题解，连同 `2026-10-28` 至 `2026-11-26` 的 `720/720` 小时连续节律审计），并在构建期解析本卷**全部 25 条冻结定理**（`24` 条绿色常规冻结定理与 `1` 条官方零公理蓝色定理 `d2_eq_zero_iff`，另含裸 CIC `strict_omega` 零公理的 `all_degree_peter_weyl_orthonormal`）的精确行号与 `statement_id` 摘要。执行上述第五步重放时请直接检出锁文件所钉提交 `548388cd`；若需独立分片抽检 Levent Alpöge 获 Lean/Mathlib 社区认证的古典 `RiemannHypothesis` 与 Dirichlet GRH 证明，请前往 `the-omega-institute/riemann-hypothesis@c2dabc97` 运行 `./verify`。

## 全部 25 条冻结定理的声明索引

上述五步适用于本卷引用的**全部 25 条冻结定理**（涵盖一位二进制非邻接自动机与 `FIB ATOM`、信息逃逸、三向配平律迫出复希尔伯特空间、紧致倒易律迫出三维空间、七条文献旗舰证明与反驳、`2026-11-27` 实时冻结的四维时空唯一性定理、`omega-math` 官方零公理蓝色单纯庞加莱引理与全阶有理彼得–外尔球面哈尔正交性，以及黎曼猜想整系数 Hankel 等价判据）。下方的声明索引由构建系统直接从锁文件生成，提供每一条定理的精确文件与行号入口：

::: {.stats src="declarations" display="link" group="theorems" format="html"}
查看本卷全部 25 条冻结 Lean 4 定理声明索引
:::

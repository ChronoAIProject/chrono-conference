# 第六章 Mathesis、双语专著书库与黎曼猜想分片重放

把一条定理锁进 Lean 4 内核，只走完了科学传播的前半程。编译器能冷酷地证实逻辑没有裂缝，但编译器不会替你讲清直觉、也不会把十六万条孤立引理织成一本人类数学家愿意捧在手里细读的书。

在 `The Omega Institute` 的出版版图里，连接「机器内核」与「人类共同体」的三座桥梁分别是：**开放论文平台 `Mathesis`**、**双语专著书库 `books.trureturing.org`**，以及把大规模形式化可重放性推向极限的 **`riemann-hypothesis-book`**。而贯穿这三座桥梁的，只有一条绝不妥协的铁律——**三层证据色标绝不混用。**

::: {.figure src="ch06-three-evidence-tiers"}
**出版体系三类证据标记。** 自上而下分列三档：顶层绿色 `LEAN ✓`（内核核验）专属于 `trureturing.lock.json` 解析到 Lean 4 冻结 `theorem` 的结论（2026-11-20 快照共 167,819 条）；中层紫色（书面证明）标示附 DOI 或源论文仓库与形式化请求的文献佐证；底层红色 `OPEN` 明确框出尚未证明的猜想与开放问题，包括黎曼猜想的全称符号断言。
:::

## Mathesis 与 `mathesis-papers`：把审稿现状如实写在封面

截至 2026 年 11 月 27 日，开放论文托管组织 `mathesis-papers`（含公开接口 `mathesis-omega-research.apps.chrono-ai.fun`）共收录 **212 篇公开来源论文**（公开目录追踪 212 份论文仓库、其中 211 份附 Lean 源码、207 份具 DOI、累计登记 1,480 条陈述），其中 211 篇把可运行的形式化代码直接绑在正文旁边，而非只交一份无法复核的 PDF。

但我们在这里把最容易被公关人员遮掩的一个数字原样摊开：截至 2026 年 11 月 27 日，**经由 Mathesis 自身审稿流程正式录用的论文数为 `0` 篇**（`mathesis.accepted = 0`，`mathesis.collected = 212`）。

为什么坚持把 `0` 写进发布会专著？因为费曼的「绝不自欺」不是说说而已：把公开收录的源码预印本混称为「已通过独立同行评审」，是对学术共同体最廉价的冒犯。与此同时，在传统学术渠道与学者通信上，截至 2026 年 11 月 8 日的外联实账记录了：向 **838 位**学者发信，获得 **440 位**回复（53%，覆盖 273 所机构与 46 个国家），其中 **294 位**肯定、**223 位**深入协作、**44 位**进入合作撰写，已有 **1 篇正式期刊发表论文**（*RAIRO-ITA* 2026）与多篇公开合作预印本（同时有 **64 位**学者婉拒或要求停止联络）；截至 2026 年 11 月 20 日，团队亦已贡献 **18 条 OEIS 条目**。每一笔正负账，全部一清二楚。

## 双语专著书库与模板生态

你此刻正在阅读的这套 2026 发布会四卷双语书，正是直接建立在 `the-omega-institute/trureturing-books-template`（`v1.26.0`）这套开源出版引擎之上。同一套引擎已经在 `https://books.trureturing.org/` 上持续出版了三部大型双语专著（`quantum-geometry`、`omega-math`、`omega-unification`），每一部都保证：

- 源码入库、派生产物按需生成（静态图由 Python 脚本实时计算并按深浅／印刷／手机四端出图，交互实验室逐卡生成纸面静帧，讲解视频确定性渲染双语字幕）；
- 中英双语逐条对齐每一处定理环境、`#id`、`lean` 引用与媒体序列；
- 每一次钉版升级都自动比对 Lean 声明的 `statement_id` 摘要哈希，防止正文陈述与底层代码脱钩。

## 黎曼猜想分片重放：等价桥已冻结，猜想本身依然鲜红开放

在整个公开仓库群里，最容易引发外界误读——因而我们也最需要用手术刀切清边界的——是围绕**黎曼猜想（Riemann Hypothesis）**展开的研究与 **`riemann-hypothesis-book`** 分片重放工程。

请把下面两件事严格分开，绝不混淆一个字：

1. **已由 Lean 4 内核冻结的是「等价刻画」**：下面这条冻结定理严格证明了标准 Mathlib 版本的 `RiemannHypothesis` 与「平移奇对数导数 `xiOdd` 的实泰勒系数所构造的全部有限阶整系数 Hankel 二次型恒非负」逻辑等价；同时，`riemann-hypothesis-book` 将相关大规模形式化证明链切分为 **8,490 个内容寻址分片（content-addressed shards）**，便于全球任何一台普通电脑分段抽检重放。
2. **尚未证明的是「全阶普遍符号断言」——也就是黎曼猜想本身**：Lean 文件头的注释写得冷酷直白（`The universal all-degree sign assertion remains unproved`）——等价改写不等于证明了任何一边！

::: {.theorem #thm-rh-hankel title="黎曼猜想与真实 $\xi$ 整系数 Hankel 非负性的等价判据" lean="D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative"}
标准 Mathlib 意义下的黎曼猜想 `RiemannHypothesis` 成立，当且仅当对一切自然数阶数 $N \in \mathbb{N}$ 及一切整系数向量 $u : \mathrm{Fin}\,(N + 1) \to \mathbb{Z}$，由平移奇对数导数 `xiOdd` 的实泰勒系数 $\mathrm{xiCoefficient}$ 所构造的 Hankel 二次型恒满足非负性：
$$
\mathrm{RiemannHypothesis}
\iff
\forall (N : \mathbb{N})\,\forall (u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}),\;
0 \le \sum_{a=0}^{N} \sum_{b=0}^{N} u_a\, u_b\, \mathrm{xiCoefficient}(a + b).
$$
注：本定理仅断言两端的逻辑等价，**不**无条件断言其中任何一端成立。
:::

::: proof
正向由 `actual_xi_hankel_nonnegative_of_rh` 将实向量情形限制到整向量；反向采用反证法，通过 `actual_xi_integer_negative_of_not_rh` 证明若标准 `RiemannHypothesis` 不成立（$\neg\,\mathrm{RH}$），则必存在某个有限阶 $N$ 与整系数向量 $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$ 使该 Hankel 二次型严格为负，与全阶非负假设矛盾。完整等价证明由 Lean 4 内核验证并冻结于 [`rh_iff_actual_xi_integer_hankel_nonnegative`](lean:D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative)。
:::

因此，紧挨着 [@thm-rh-hankel] 这条绿色冻结等价定理，我们必须立刻摆上醒目的红色开放问题框：

::: {.problem #prob-rh-open title="黎曼猜想本身仍然开放"}
黎曼猜想（`RiemannHypothesis`）是否为真——等价地，是否对一切 $N \in \mathbb{N}$ 与所有 $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$，[@thm-rh-hankel] 中的整系数 Hankel 二次型皆非负？本问题目前完全开放；任何将等价改写或分片重放框架宣称为「已证明黎曼猜想」的说法都是错误的。
:::

正是这种近乎苛刻的诚实，才让绿色的内核徽章拥有真正的重量。如果一个人连「我还没证出来」都不敢用红色大字印在书上，他用绿色写下的任何「我证出来了」又凭什么值得信任？

走到这里，一个贯穿整场发布会的大问题正等待最后作答：**既然全世界都能买到同样的一流底层推理模型，为什么大多数团队跑出来的只是华丽的幻觉与一次性玩具，而 `trureturing` 却在 74 天里凿出 2,126 道带日期（另含 2 道未标日期、共 2,128 道）经过 Lean 4 内核检查的公开题解？** 第七章，把答案摊开。

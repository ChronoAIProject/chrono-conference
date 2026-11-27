# 第六章 Mathesis、双语专著书库与黎曼猜想分片重放

把一条定理焊进 Lean 4 内核，只走完了科学传播的一半。编译器能冷酷地证明逻辑链条滴水不漏，却不会替你讲清直觉，也不会把二十二万条孤立引理织成一本人类数学家愿意摊在书桌上细读的专著。

在 `The Omega Institute` 的公开出版版图里，连接「冰冷内核」与「人类共同体」的三座桥梁分别是：**开放论文平台 `Mathesis`**、**持续出版的双语专著书库 `trureturing-books`（`books.trureturing.org`）**，以及把大规模形式化可重放性推向工业极限的 **`the-omega-institute/riemann-hypothesis`**（附双语导读专著 **`riemann-hypothesis-book`**）。贯穿这三座桥梁的铁律只有一条——**三档证据色标绝不混用，功劳归属绝不挪移。**

::: {.figure src="ch06-three-evidence-tiers"}
**出版体系三类证据标记。** 自上而下分列三档：顶层绿色 `LEAN ✓`（内核核验）专属于 `trureturing.lock.json` 解析到 Lean 4 冻结 `theorem` 的结论（`548388cd`，2026-11-27 快照共 `223,231` 条）；中层紫色（书面证明）标示附 DOI 或源论文仓库与形式化请求的文献佐证；底层红色 `OPEN` 明确隔离尚未证明的猜想与开放前沿，包括广义／大黎曼猜想、零点简单性、对关联以及 `trureturing` 内部尚未自立证明的全阶 Hankel 符号断言。
:::

## Mathesis、`mathesis-papers` 与学者实账：把 `0` 印在封面上

截至 2026 年 11 月 27 日，公开论文托管组织 **`https://github.com/mathesis-papers`** 已扩展至 **236 个仓库**（`235` 个公开、`1` 个私有），其在线接口（`papers.trureturing.org` / `mathesis-omega-research.apps.chrono-ai.fun`）实时收录 **225 篇公开来源论文**（其中 **224 篇**直链 Lean 形式化源码、**225 份**完整 PDF；目录快照追踪 `224` 份公开论文仓库、`1,528` 条登记形式陈述、`217` 枚 DOI，并同站托管《人机协同自动研究》方法论手稿 `human-in-the-loop-automated-research`）。

现在，把大多数公关稿会藏进脚注的数字用大号红字拍在黑板正中央：截至 2026 年 11 月 27 日，**经由 Mathesis 自身同行评审流程正式录用的论文数依然为 `0` 篇**（`mathesis.accepted = 0`，`mathesis.collected = 225`）。

为什么坚持把这个刺眼的 `0` 印进发布会专著？因为费曼的铁律容不得讨价还价——把附源码的公开预印本包装成「已通过独立同行评审」，是对科学共同体最廉价的冒犯。而在另一张同样摊在阳光下的传统学术实账上（`trureturing-outreach@d22e63c8`，2026-11-27），每一笔正负记录也同样毫不含糊：

- 累计联系 **1,049 位**学者，收到 **485 位**回复（总体回复率 **`46.2%`**；剔除系统账号后为 `1,034` 联系 / `478` 回复，覆盖约 **`299` 个机构域名**与 **`47` 个国家**）；
- 其中 **316 位**给出明确正面评价（累计收录 `697` 条引述）、**223 位**进入实质协作（含 **`44` 位**合作撰写）、**70 位**正式署名致谢；
- 同期实录 **66 位**学者婉拒或要求停止联络——拒绝同样留痕，绝不粉饰太平；
- 公开学术产出已落地为 **1 篇正式发表期刊论文**（*RAIRO-ITA* 60, 29）、**15 篇公开 arXiv 预印本**，以及 **21 条 OEIS 序列条目**（近期新增 `A024718`、`A048585`、`A392984`）。

## `trureturing-books`：三部持续演进的双语形式化专著

你手头这套 2026 发布会四卷双语书，与 `the-omega-institute/trureturing-books` 共享同一套开源出版引擎 **`trureturing-books-template v1.26.0`**（截至 2026 年 11 月 28 日合并至 PR `#1,556`，构建生成 `415` 份预览发布产物）。在 `https://books.trureturing.org/` 上，这套引擎已持续出版三部大型双语数学与物理专著：

| 持续出版双语专著 | 每语种章数 | 交互实验室 | 讲解短片 | 备注 / 持久化标识 |
| --- | --- | --- | --- | --- |
| `quantum-geometry` | `304` | `130` | `48` | DOI `10.5281/zenodo.24156135` |
| `omega-math` | `23` | `4` | `19` | 双语源码驱动构建 |
| `omega-unification` | `20` | `1` | `16` | 双语源码驱动构建 |
| **三部专著合计** | **`347` 双语章（`694` 中英页）** | **`135` 座** | **`83` 部** | **正文直接绑定 `2,017` 条 Lean 4 冻结定理** |

每一部专著都服从同一套冷酷的工程洁癖：源文件入库、派生产物按需生成（静态图按深浅／印刷／手机四端实时重绘，交互实验室逐卡导出静帧，短片确定性渲染双语字幕）；中英逐条对齐每一处环境、锚点与引用；每次钉版升级自动核对 `statement_id` 哈希，杜绝文字悄悄脱离代码真相。

## 黎曼猜想的精确归属、8,490 分片重放与真正的鲜红前沿

在整个仓库群里，没有任何一个话题比**黎曼猜想（Riemann Hypothesis）**更需要一把绝不手软的手术刀。这里容不得半句模糊，更容不得一丝抢功或张冠李戴。请把以下五个事实层次彻底切清：

1. **外部里程碑与彻底归功（2026 年 11 月 20–21 日）**：2026 年 11 月 20 至 21 日，Lean 与 Mathlib 社区正式认证了 **Levent Alpöge** 使用 Lean `4.33.1` 完成的 Mathlib 版古典 `RiemannHypothesis` 与 Dirichlet 广义黎曼猜想（Dirichlet GRH）形式化证明（全工程计 `175,187` 个模块、`1,737 万`行代码，仅依赖三条标准公理 `[propext, Classical.choice, Quot.sound]`，先后镜像于 `Deicyde/riemann-hypothesis` 与 `leanprover-community/riemann-hypothesis`）。**先致以毫不保留的敬意与归功**：这一历史性证明属于 Levent Alpöge 与 Lean/Mathlib 社区，绝非 `The Omega Institute` 的原创证明。
2. **`the-omega-institute/riemann-hypothesis`（`c2dabc97`）——8,490 分片可重放认证工程**：面对一千七百多万行规模的巨型证明，普通研究者根本无从单机盲信。`The Omega Institute` 独立构建了 `the-omega-institute/riemann-hypothesis`，将该认证证明切分为 **8,490 个内容寻址分片**并封装为可复现 CI 与一键 `./verify` 校验流水线（托管 `8,558` 份 `.tar.zst` 发布产物），让全球任何一台普通工作站都能按片抽检重放。
3. **`the-omega-institute/riemann-hypothesis-book`（`ebd24a4d`）——双语导读专著**：该仓库是面向人类读者的配套双语导读专著 *Symmetry on the Critical Line*（《临界线上的对称性》），用于拆解证明结构与数学直觉——**8,490 个重放分片位于 `riemann-hypothesis`，而非 `riemann-hypothesis-book`**，两者的工程职责绝不混为一谈。
4. **`trureturing` 自身的独立定理（`ActualXiIntegerCriterion.lean`）**：在 `trureturing` 自己的源码树内，[@thm-rh-hankel] 仅冻结了一条**逻辑等价判据**——证明标准 Mathlib `RiemannHypothesis` 等价于平移奇对数导数 `xiOdd` 的全部有限阶整系数 Hankel 二次型恒非负；该模块本身**并未**独立证明两端任何一边，也不导入上述外部证明。
5. **真正依然鲜红开放的前沿（[@prob-rh-open]）**：古典 `RiemannHypothesis` 与 Dirichlet GRH 获 Lean 社区认证之后，数学深水区并未合拢——**一般代数数域 Dedekind $\zeta$ 函数的扩展黎曼猜想（Extended RH）、一般自守 $L$-函数的大黎曼猜想（Grand RH）、非平凡零点的简单性（simplicity of zeros）与零点对关联（pair correlation）**，以及在 `trureturing` 内部不依赖外部导入直接攻克全阶整系数 Hankel 符号断言，此刻依然鲜红地悬在前沿之上。

先看 `trureturing` 内部已由 Lean 4 内核锁死的整系数 Hankel 等价桥：

::: {.theorem #thm-rh-hankel title="黎曼猜想与真实 $\xi$ 整系数 Hankel 非负性的等价判据" lean="D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative"}
标准 Mathlib 意义下的黎曼猜想 `RiemannHypothesis` 成立，当且仅当对一切自然数阶数 $N \in \mathbb{N}$ 及一切整系数向量 $u : \mathrm{Fin}\,(N + 1) \to \mathbb{Z}$，由平移奇对数导数 `xiOdd` 的实泰勒系数 $\mathrm{xiCoefficient}$ 所构造的 Hankel 二次型恒满足非负性：
$$
\mathrm{RiemannHypothesis}
\iff
\forall (N : \mathbb{N})\,\forall (u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}),\;
0 \le \sum_{a=0}^{N} \sum_{b=0}^{N} u_a\, u_b\, \mathrm{xiCoefficient}(a + b).
$$
注：本定理仅断言两端的逻辑等价，**不**在 `trureturing` 内部无条件断言其中任何一端成立。
:::

::: proof
正向由 `actual_xi_hankel_nonnegative_of_rh` 将实向量情形限制到整向量；反向采用反证法，通过 `actual_xi_integer_negative_of_not_rh` 证明若标准 `RiemannHypothesis` 不成立（$\neg\,\mathrm{RH}$），则必存在某个有限阶 $N$ 与整系数向量 $u : \mathrm{Fin}\,(N+1) \to \mathbb{Z}$ 使该 Hankel 二次型严格为负，与全阶非负假设矛盾。完整等价证明由 Lean 4 内核验证并冻结于 [`rh_iff_actual_xi_integer_hankel_nonnegative`](lean:D5/S3/Zeros/Resolvent/ActualXiIntegerCriterion.rh_iff_actual_xi_integer_hankel_nonnegative)。
:::

紧挨着绿色等价桥 [@thm-rh-hankel]，我们把古典黎曼猜想之后依然鲜红的真实开放前沿刻在下面：

::: {.problem #prob-rh-open title="古典黎曼猜想之后的开放前沿：广义／大黎曼猜想、零点简单性与对关联"}
在 Levent Alpöge 的 Lean `4.33.1` 证明（由 Lean/Mathlib 社区于 2026 年 11 月 20–21 日认证，并由 `the-omega-institute/riemann-hypothesis` 提供 8,490 分片可重放核验）覆盖古典 `RiemannHypothesis` 与 Dirichlet GRH 之后，以下四项深层前沿目前依然完全开放：

1. **扩展黎曼猜想（Extended RH）**：一般代数数域上 Dedekind $\zeta$ 函数的全部非平凡零点是否均落在临界线 $\operatorname{Re}(s) = \frac{1}{2}$ 上；
2. **大黎曼猜想（Grand RH）**：一般自守 $L$-函数的非平凡零点分布；
3. **零点简单性与对关联**：$\zeta(s)$ 的全部非平凡零点是否皆为单零点，以及 Montgomery 对关联猜想；
4. **`trureturing` 内部自立断言**：在不引入外部证明的前提下，直接从 `ActualXiIntegerCriterion` 内部建立 [@thm-rh-hankel] 右端全阶整系数 Hankel 二次型的普遍非负性。
:::

敢把 `Mathesis` 的 `0` 录用印在头版，敢把别人的划时代证明整块归功并只认领自己的分片重放工程，也敢在绿标旁点亮真正的红区——只有这种近乎苛刻的诚实，才让每一个绿色 `LEAN ✓` 徽章沉甸甸地立得住。

走到这里，全书最后一个核心追问已经退无可退：**既然全世界任何人都能按次租用同一套商用推理底座，为什么绝大多数人的对话框里只冒出精美的幻觉，而 `trureturing` 却在 81–82 天里凿出 2,278 道（2,276 道带日期加 2 道未标日期）经 Lean 4 内核验尸的公开题解？** 第七章把引擎盖彻底掀开。

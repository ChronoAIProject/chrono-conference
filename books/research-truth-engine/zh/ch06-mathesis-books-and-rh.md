# 第六章 Mathesis、双语专著书库与黎曼猜想分片重放

把一条定理焊进 Lean 4 内核，只走完了科学传播的一半。编译器能冷酷地证明逻辑链条滴水不漏，却不会替你讲清直觉，也不会把二十二万条孤立引理织成一本人类数学家愿意摊在书桌上细读的专著。

在 `The Omega Institute` 的公开出版版图里，连接「冰冷内核」与「人类共同体」的三座桥梁分别是：**开放论文平台 `Mathesis`**、**持续出版的双语专著书库 `trureturing-books`（`books.trureturing.org`）**，以及把大规模形式化可重放性推向工业极限的 **`the-omega-institute/riemann-hypothesis`**（附双语导读专著 **`riemann-hypothesis-book`**）。贯穿这三座桥梁的铁律只有一条——**三档证据色标绝不混用，功劳归属绝不挪移。**

::: {.figure src="ch06-three-evidence-tiers"}
**出版体系三类证据标记。** 自上而下分列三档：顶层绿色 `LEAN ✓`（内核核验）专属于 `trureturing.lock.json` 解析到 Lean 4 冻结 `theorem` 的结论（`548388cd`，2026-11-27 快照共 `223,231` 条）；中层紫色（书面证明）标示附 DOI 或源论文仓库与形式化请求的文献佐证；底层红色 `OPEN` 明确隔离尚未证明的猜想与开放前沿，包括 Dedekind ERH、Grand RH、零点简单性、对关联以及 `trureturing` 内部尚未自立证明的全阶 Hankel 符号断言。
:::

## Mathesis、`mathesis-papers` 与学者实账：把双重归零印在封面上

截至 **`2026-11-27T21:31Z`**（`catalog@293dc68c37`），公开论文托管组织 **`https://github.com/mathesis-papers`** 已扩展至 **`237` 个仓库（`236` 个公开）**，支撑着在线平台 `Mathesis`（`papers.trureturing.org`）上的 **`225` 篇公开收录论文**。把它整张资产清单掀开看清细目：

- **源码、持久标识与多模态可读版本**：`225` 篇公开收录论文中，**`224` 篇**附带钉选 Lean 形式化链接、**`218` 枚**已铸造 Zenodo DOI、登记 **`1,534` 条结构化陈述**，并配套产出 **`60` 份双语阅读版**、**`43` 套专题幻灯片**与 **`42` 部讲解视频**；
- **面向协作与智能体的公开协议**：全站累计沉淀 **`756` 条共享形式化请求**与 **`138` 个已合并 PR**；`mathesis` OpenAPI **`v1.3.0`** 暴露 **`77` 条路径**，原生提供面向研究代理与人类协作者的 `/skill.md`、`/llms.txt` 与 `mathesis-contribute` 入口，并借 PR `#157–#159` 正式开放散文理论与版本化方法论手稿（如第七章剖析的 `human-in-the-loop-automated-research v1.0`）的规范出版；
- **2026 年 11 月 27 日当天入库的四份活体样本**：把抽象统计拉回具体数学对象——同一天并排立在货架上的，包括改进任意维 Bessis–Moussa–Villani 猜想判据的 `hagele-2026-refined-bmv-33-all-dimensions`、剖析超范数渐近规模的 `lagarias-sun-2024-supernorm-size-asymptotic`、处理零维跟踪扩张的 `peng-zero-dimensional-shadowing-extension`，以及精确证明最小矩形规模等于 **`81`** 的 `su-hu-2026-minimum-rectangular-size`。

现在，把大多数公关稿会藏进脚注的数字用大号红字拍在黑板正中央——这里不是一个 `0`，而是**两枚并排发烫的 `0`**：

1. **经 Mathesis 自身同行评审流程正式录用的论文数为 `0` 篇**（`mathesis.accepted = 0`，`mathesis.collected = 225`）；
2. **独立 Mathesis 验证器签发的陈述级验证回执为 `0 / 1,534`**。

把这两行写死，是因为科学上绝不容许偷换概念：**论文仓库里挂着一条钉选的 Lean 源码链接，绝不等于独立第三方验证器已经逐条签发了可机读回执；公开挂网的附源码预印本，更绝不等于已经走完同行评审。** 宁可顶着双零接受检验，也绝不往半成品上刷一层绿漆。

站在双重归零旁边的，是一张同样一笔不隐的外部学者实账（`trureturing-outreach`，`data @ d22e63c8`，2026-11-27）：

- 累计联系 **`1,049` 位**学者，收到 **`485` 位**回复（总体回复率 **`46.2%`**；剔除系统自动回邮后为 `1,034` 联系 / `478` 回复，覆盖约 **`299` 个机构域名**与 **`47` 个国家**）；
- 其中 **`316` 位**给出明确正面评价（收录 `697` 条引述）、**`223` 位**进入协作交流（含 **`44` 位**共同署名合著，另有 `177` 位参与证明核查、`120` 位参与缺口补全），**`70` 位**在成果中获致谢署名；
- 同期实录 **`66` 位明确婉拒或要求停止联络的学者，全部即刻遵从停联**——拒绝同样记入主账，绝不悄悄抹零；
- 公开学术产出已落地为 **`1` 篇正式发表期刊论文**（*RAIRO-ITA* 60, 29）、**`17` 篇经身份核验的协作 arXiv 预印本（其中 `16` 篇由外部学者合著）**，以及 **`21` 条 OEIS 序列条目**（近期新增 `A024718`、`A048585`、`A392984`）。

## `trureturing-books`：三部持续演进的双语形式化专著三部曲

你手头这套 2026 发布会四卷双语书，与 **`the-omega-institute/trureturing-books`**（`https://books.trureturing.org/`）共享同一套开源出版引擎 **`trureturing-books-template v1.26.0`**。截至实时主线 **`main b83ae321`**，该书库已累计 **`2,284` 次提交**与 **`1,169` 个合并 PR**，体量达到 **约 `1.99M` 中文汉字与 `1.59M` 英文词**、每语种 **`344` 双语页（中英合计 `688` 页）**，产出 **`283` 份 Python 静态图脚本**、**`135` 座交互实验室（`847` 张 `.viz` 实验卡）**、**`83` 部讲解短片（含 `3` 部超 `120 MB` 的长篇 MP4 影片）**与 **`93` 件面向读者的预览发布产物**。

更硬的是它的内核锚定密度：全书库正文共嵌有 **`918` 条 Lean 核验定理块**，在 `548388cd` 上解析为 **`2,043` 个独立冻结 GID**——其中包含 **`132` 条裸 CIC 零公理 `strict_omega` 定理**与 **`22` 条官方 `axioms: []` 零公理定理**（连经典选择公理与命题外延都不曾动用）。按 Auric 规划的三部曲叙事弧线，三部专著各守一职：

| 专著与三部曲定位 | 实验室与短片 | 规模、关键标识与零公理边界 |
| --- | --- | --- |
| **`quantum-geometry`**（`ORTHO//QUANTUM`）· **罗盘（Compass）**：从离散观测几何定向出发 | `130` 座实验室、`48` 部短片 | DOI `10.5281/zenodo.24156135` |
| **`omega-math`**（`OMEGA//MATH`）· **零公理有理船壳（Zero-Axiom Rational Hull）** | `4` 座实验室、`19` 部短片 | 裸构造内核与零公理核心脊梁 |
| **`omega-unification`**（`OMEGA//UNIFY`）· **深水测深日志（Deep-Water Sounding Log）** | `1` 座实验室、`16` 部短片 | 扉页明刻 `4/4` 模型内 · `0/4` 零拟合 |
| **三部曲实时合计**（`main` `b83ae321`） | `135` 座实验室（`847` 卡）、`83` 部短片（含 `3` 部 >`120 MB` 长片） | `344` 双语页/语种，总 `688` 页；约 `1.99M` 汉字 / `1.59M` 词；`918` 定理块 / `2,043` 冻结 GID（含 `132` 裸 CIC 零公理、`22` 条 `axioms: []`）；`283` 份图脚本、`93` 预览产物 |

想亲眼看见「零公理有理船壳」究竟硬到什么程度，不必去翻三百页综述——直接把 `omega-math` 脊梁上两颗最具代表性的冻结定理搬到你面前。第一颗是下面这条**蓝色零公理定理**：

:::: {.theorem #thm-omega-simplicial-exact title="零公理单纯庞加莱引理：闭的二阶上链都是恰当的" lean="D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff"}
对任意顶点型 $V$、值型 $A$ 上的加性阿贝尔群结构 `G : AddCommGroup A`（满足群律 `laws : G.Laws`）、任选基点 `base : V` 及任意二阶单纯上链 `F : C2 V A`，闭性与恰当性逐点等价：
$$
(\forall x, y, z, w,\; d_2\, G\, F\, x\, y\, z\, w = G.\mathrm{zero})
\iff
(\exists\, e : C^1(V, A),\; \forall x, y, z,\; d_1\, G\, e\, x\, y\, z = F\, x\, y\, z).
$$
::::

::: {.proof}
在 [`d2_eq_zero_iff`](lean:D5/S3/Quantum/AURICOmega/OmegaSimplicialExactness.d2_eq_zero_iff) 中，反向由逐点上边缘恒等式 `d2_d1` 直接给出，正向则通过显式锥同伦公式 $d_1(H_2(\mathrm{base}, F)) + H_3(\mathrm{base}, d_2 F) = F$（`d1_H2_add_H3_d2`）构造出原像 $e = H_2(\mathrm{base}, F)$，全程不依赖任何非构造步骤。尤为关键的是，该定理在**官方 Lean 内核（`Init + OmegaMath`）与裸 CIC 内核（`strict_omega`）两端均严格满足 `axioms: []`（零公理）**——既不调用 `Classical.choice`，也不调用 `Quot.sound` 或 `propext`——正因如此，出版引擎 `tbook` 自动将这个定理框渲染为**蓝色**而非绿色。
:::

把镜头再挪半寸，看紧邻其旁的另一颗旗舰定理——它展示了为何公理足迹必须按内核逐一实话实说，绝不把两个后端混成一句模糊的「零公理」：

:::: {.theorem #thm-omega-peter-weyl title="全阶彼得–外尔球面哈尔正交性（无 π、无实数、无选择公理）" lean="D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal"}
对任意自然数阶数 $m, n : \mathbb{N}$，偶数次特征多项式 `evenCharPoly m` 与 `evenCharPoly n` 在有理球面哈尔内积 `haarInner` 下与克罗内克德尔塔 `degreeDelta m n` 精确等价（`IntRatio.Equivalent`）：
$$
\forall m, n : \mathbb{N},\; \mathrm{Equivalent}\bigl(\mathrm{haarInner}(\mathrm{evenCharPoly}\,m,\, \mathrm{evenCharPoly}\,n),\; \mathrm{degreeDelta}\,m\,n\bigr).
$$
::::

::: {.proof}
在 [`all_degree_peter_weyl_orthonormal`](lean:D5/S3/Quantum/AURICOmega/OmegaSphericalHaarMidpoint.all_degree_peter_weyl_orthonormal) 中，证明先把两个偶数次特征多项式的乘积按系数展开为从 $|m - n|$ 到 $m + n$ 的闭区间特征之和（`evenChar_product_sum`），再施加纯代数的阶乘矩泛函 `haarKappaPoly`（`haar_evenChar_expectation` 将 $0$ 阶平凡特征送往 $1$、将所有正阶偶特征送往 $0$），全程彻底绕开圆周率 $\pi$、实数完备化 $\mathbb{R}$ 与测度积分。按双后端公理足迹如实分账：在官方 Lean（`Init + OmegaMath`）上，本定理**仅依赖 `propext` 一条公理**（零 `Classical.choice`、零 `Quot.sound`、零 $\pi$、零 $\mathbb{R}$），因此 `tbook` 严格诚实地将其渲染为**绿色**徽章而非蓝色；而在裸 CIC 内核 **`strict_omega`**（`OmegaInit + OmegaMath`）上，同一条陈述以 **`axioms: []`（零公理）**通过编译验证。
:::

再把目光移向第三部 **`omega-unification`（`OMEGA//UNIFY`）** 的扉页题记上——整套书库最锋利的句子就刻在那里：

> **`4/4 model-internal · 0/4 zero-fit first-principles closure`**——*《为什么零完结比伪造大统一更强》（Why Zero-Completion Is Stronger Than a Fake Grand Unification）*。

在物理学与科普读物里，最廉价的诱惑就是偷塞三四个自由拟合参数，把模型内部自洽包装成「从第一性原理推导宇宙常数」的大一统凯歌。`omega-unification` 偏偏反着来：四个通道在模型内部都自洽，就记 **`4/4`**；没有任何一条真正完成了零拟合的第一性原理物理论证，就大大方方在封面刻上 **`0/4`**。测深锤没碰到海底，老老实实报出「此处仍未见底」，远比编造一副虚假海图更配得上深水航行。

每一部专著都服从同一套冷酷的工程洁癖：源文件入库、派生产物按需生成（静态图按深浅／印刷／手机四种画面实时重绘，交互实验室逐卡导出静帧，短片确定性渲染双语字幕）；中英逐条对齐每一处环境、锚点与引用；每次钉版升级自动核对 `statement_id` 哈希，杜绝文字悄悄脱离代码真相。

## 黎曼猜想的精确归属、8,490 分片重放与真正的鲜红前沿

在整个仓库群里，没有任何一个话题比**黎曼猜想（Riemann Hypothesis）**更需要一把绝不手软的手术刀。这里容不得半句模糊，更容不得一丝抢功或张冠李戴。请把以下五个事实层次彻底切清：

1. **外部里程碑与彻底归功（2026 年 11 月 20–21 日）**：2026 年 11 月 20 至 21 日，Lean 与 Mathlib 社区正式认证了 **Levent Alpöge** 使用 Lean `4.33.1` 完成的 Mathlib 版古典 `RiemannHypothesis` 与 Dirichlet GRH 形式化证明（全工程计 `175,187` 个模块、`1,737 万`行代码，仅依赖三条标准公理 `[propext, Classical.choice, Quot.sound]`，先后镜像于 `Deicyde/riemann-hypothesis` 与 `leanprover-community/riemann-hypothesis`）。**先致以毫不保留的敬意与归功**：这一历史性证明属于 Levent Alpöge 与 Lean/Mathlib 社区，绝非 `The Omega Institute` 的原创证明。
2. **`the-omega-institute/riemann-hypothesis`（`c2dabc97`）——8,490 分片可重放认证工程**：面对一千七百多万行规模的巨型证明，普通研究者根本无从单机盲信。`The Omega Institute` 独立构建了 `the-omega-institute/riemann-hypothesis`，将该认证证明切分为 **8,490 个内容寻址分片**并封装为可复现 CI 与一键 `./verify` 校验流水线（托管 `8,558` 份 `.tar.zst` 发布产物），让全球任何一台普通工作站都能按片抽检重放。
3. **`the-omega-institute/riemann-hypothesis-book`（`ebd24a4d`）——双语导读专著**：该仓库是面向人类读者的配套双语导读专著 *Symmetry on the Critical Line*（《临界线上的对称性》），用于拆解证明结构与数学直觉——**8,490 个重放分片位于 `riemann-hypothesis`，而非 `riemann-hypothesis-book`**，两者的工程职责绝不混为一谈。
4. **`trureturing` 自身的独立定理（`ActualXiIntegerCriterion.lean`）**：在 `trureturing` 自己的源码树内，[@thm-rh-hankel] 仅冻结了一条**逻辑等价判据**——证明标准 Mathlib `RiemannHypothesis` 等价于平移奇对数导数 `xiOdd` 的全部有限阶整系数 Hankel 二次型恒非负；该模块本身**并未**独立证明两端任何一边，也不导入上述外部证明。
5. **真正依然鲜红开放的前沿（[@prob-rh-open]）**：古典 `RiemannHypothesis` 与 Dirichlet GRH 获 Lean 社区认证之后，数学深水区并未合拢——**一般代数数域 Dedekind $\zeta$ 函数的扩展黎曼猜想（Extended RH）、一般自守 $L$-函数的 Grand RH、非平凡零点的简单性（simplicity of zeros）与零点对关联（pair correlation）**，以及在 `trureturing` 内部不依赖外部导入直接攻克全阶整系数 Hankel 符号断言，此刻依然鲜红地悬在前沿之上。

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

::: {.problem #prob-rh-open title="古典黎曼猜想之后的开放前沿：Dedekind ERH、Grand RH、零点简单性与对关联"}
在 Levent Alpöge 的 Lean `4.33.1` 证明（由 Lean/Mathlib 社区于 2026 年 11 月 20–21 日认证，并由 `the-omega-institute/riemann-hypothesis` 提供 8,490 分片可重放核验）覆盖古典 `RiemannHypothesis` 与 Dirichlet GRH 之后，以下四项深层前沿目前依然完全开放：

1. **扩展黎曼猜想（Extended RH）**：一般代数数域上 Dedekind $\zeta$ 函数的全部非平凡零点是否均落在临界线 $\operatorname{Re}(s) = \frac{1}{2}$ 上；
2. **Grand RH**：一般自守 $L$-函数的非平凡零点分布；
3. **零点简单性与对关联**：$\zeta(s)$ 的全部非平凡零点是否皆为单零点，以及 Montgomery 对关联猜想；
4. **`trureturing` 内部自立断言**：在不引入外部证明的前提下，直接从 `ActualXiIntegerCriterion` 内部建立 [@thm-rh-hankel] 右端全阶整系数 Hankel 二次型的普遍非负性。
:::

敢把 `Mathesis` 的双重归零（`0` 录用与 `0 / 1,534` 独立验证器回执）和 `omega-unification` 的 `0/4` 零拟合论证印在头版，敢把别人的突破性证明整块归功并只认领自己的分片重放工程，也敢在绿标旁点亮真正的红区——只有这种近乎苛刻的诚实，才让每一个绿色 `LEAN ✓` 徽章沉甸甸地立得住。

走到这里，全书最后一个核心追问已经退无可退：**既然全世界任何人都能按次租用同一套商用推理底座，为什么绝大多数人的对话框里只冒出精美的幻觉，而 `trureturing` 却在 `2026-09-08` 至 `2026-11-27` 的 `81` 天里凿出 `2,278` 道（`2,276` 道带日期加 `2` 道未标日期）经 Lean 4 内核验尸的公开题解？** 第七章用对照实验把引擎盖彻底掀开。

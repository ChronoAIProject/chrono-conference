# 第四章 2,278 道文献开放题：台上可当场点开核验的代表成果

检验一台科研引擎，最下乘的做法是让它做自己出的期末考题；唯一诚实的做法，是把它直接抛进全世界的公开文献海域——那里漂着物理学家、组合学家与数论学家在顶级期刊和 arXiv 论文末尾亲笔留下的 `Open Problem`、`Conjecture` 与 `Question 1`。

自 `2026-09-08` 启动公开问题登记，至 `2026-11-27` 的连续 **`81` 个自然日**内，`trureturing`（`the-omega-institute/trureturing@548388cd`）累计登记解决 **`2,276` 道带日期文献开放题**（另含 `2` 道未标入库日期记录，按 `problem_slug` 去重合计 **`2,278` 道**：**1,512 道证明**、**766 道反驳**，日均约 **28 道**；全库共有 **2,305 份**问题档案，其中 **27 道**坦白登记为未解）。

请注意那个 **766 道反驳**的比重：**只会附和既有猜想的证明器不过是个谄媚的应声虫；真正的逻辑棘轮敢于一锤敲断空心的偶像。** 无论是在小数点后第四位把 Fredkin 门整数界劈开的 `2.00034… > 2`，还是在维度 $d = 4$ 截断量子通道普遍 Jordan 相容性的显式反例，一记精确证伪与五条正面定理同等珍贵。按公开来源拆解这 2,278 道题解（连同全部 2,305 份档案），它们横跨多条公开文献战线：

::: {.figure src="ch04-resolution-velocity"}
**2,278 道公开文献题解来源与证明／反驳分布（2026-11-27 `548388cd` 冻结快照）。** 青色柱为证明（共 `1,512` 道），品红柱为反驳（共 `766` 道；总档案 `2,305` 份，尚余 `27` 道未解）：arXiv 预印本（`465` 证 / `375` 反，共 `860` 份档案）、OEIS 序列猜想（`677` 证 / `52` 反，`732` 份）、同行评审期刊（`358` 证 / `326` 反，`687` 份）、Erdős 公开问题集（`1` 证 / `3` 反，`5` 份）及其他文献（`11` 证 / `10` 反，`21` 份）；量子信息与物理领域独占 `598` 道（`314` 证 / `284` 反），悬置超十年者 `127` 道（三年以上 `478` 道），最久 `47` 年。
:::

统计柱状图只能让你看清地平线，数学家只信任摊在桌面上的**具体定理**。本章先精选 **7 条横跨量子纠缠、贝尔多面体、量子行走、量子通道与黎曼几何的文献旗舰证明与反驳**，再在章末奉上 **1 条 2026 年 11 月 27 日实时冻结的四维时空唯一性选择定理**（合共 8 条）——每一条都钉着构建生成的绿色 Lean 内核徽章，无论是在 12 月 17 日直播现场还是此刻，你都可以直接点入 Lean 源码逐行核查。

## 反驳一：四量子比特 Fredkin 门能产生超过 2 ebits 纠缠（*Phys. Rev. A* 2025）

2025 年，Qiu、Song 与 Chen（`arXiv:2410.15253`，*Phys. Rev. A*）研究四量子比特受控交换门（Fredkin 门 $F_4$）跨越 `AD:BC` 二分切口在允许携带局域辅助比特（local ancillas）的乘积输入态上的纠缠产生上确界（entangling power supremum），并猜想这个天花板恰为 $2$ ebits（`claim : entanglementGeneration = 2`）。

一个看上去无比整齐的整数界——用精确有理矩阵的铁锤轻轻一敲，它就在小数点后第四位裂开了：`trureturing` 构造出一个显式容许乘积输入态，将其约化密度矩阵共轭化为精确有理矩阵、由 Lean 内核直接通过 `decide` 锁死谱结构，并结合严格对数下界算出其输出纠缠约为 `2.00034…` ebits（严格大于 $2$），一击证伪原猜想。

::: {.theorem #thm-fredkin-refutation title="四量子比特 Fredkin 门纠缠能力猜想的反驳" lean="D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result"}
Qiu–Song–Chen（`arXiv:2410.15253`）关于四量子比特 Fredkin 门跨越 `AD:BC` 切口（允许局域辅助比特）纠缠产生上确界恰好等于 $2$ ebits 的猜想 `claim` 不成立：$\neg\,\mathrm{claim}$。
:::

::: proof
在 [`FredkinEntanglingPowerRefutation.result`](lean:D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.result) 中，显式容许乘积输入（含局域辅助比特）经 Fredkin 门作用后的约化态经对角相似变换归约为精确有理矩阵 `Nq` 与 `Vq`，其谱经由内核决定程序核算，再以有理对数界证明输出冯诺依曼熵严格大于 $2$（见证值约为 `2.00034…` ebits）。完整证明由 Lean 4 内核验证并冻结。
:::

## 证明一：Higuchi–Sudbery 四量子比特平均纠缠熵精确最大值（*Phys. Lett. A* 2000）

整整二十六年前，Higuchi 与 Sudbery（*Phys. Lett. A* 2000）在量子多体纠缠领域抛出一道经典难题：对所有归一化的四量子比特纯态 $z \in \mathbb{C}^{16}$，跨三个两比特二分切口（`AB`、`AC`、`AD`）的平均冯诺依曼熵是否恒不超过 $1 + \frac{1}{2}\log_2 3$，且恰好在他们写下的显式极值态 $M_4$ 上取到等号？

::: {.theorem #thm-higuchi-sudbery title="Higuchi–Sudbery 四量子比特平均两比特熵精确上界" lean="D5/S3/Quantum/Entanglement/HiguchiSudbery/HiguchiSudberyEntropyMaximum.result"}
对所有满足 $\sum_{i=0}^{15} |z_i|^2 = 1$ 的四量子比特振幅向量 $z : \mathrm{Fin}\,16 \to \mathbb{C}$，其三个两比特切口（`AB`、`AC`、`AD`）的平均冯诺依曼熵满足
$$
\mathrm{averageEntropy}(z) \le 1 + \frac{1}{2}\log_2 3,
$$
并且显式 Higuchi–Sudbery 态 $M_4$ 归一化且精确取到等号 $\mathrm{averageEntropy}(M_4) = 1 + \frac{1}{2}\log_2 3$。
:::

::: proof
在 [`HiguchiSudberyEntropyMaximum.result`](lean:D5/S3/Quantum/Entanglement/HiguchiSudbery/HiguchiSudberyEntropyMaximum.result) 中，谱归约步骤先给出三个两比特切口纯度（purity）之和的下界 $\ge 1$，并借助主证书恒等式把三个切口谱的三次初等对称多项式之和压在 $\frac{5}{36}$ 以内（含等号 $\le \frac{5}{36}$，在极值态 $M_4$ 上取等）；随后构造三次 Hermite 控制多项式 $p_{\mathrm{nat}}(x)$，利用其与自然熵的差值函数 $\mathrm{gap}(x) = p_{\mathrm{nat}}(x) + x\ln x$ 在 $x = \frac{1}{6}$ 与 $x = \frac{1}{2}$ 两处具有二重零点且在 $(0, \infty)$ 上四阶导数严格为正（$\mathrm{gap}^{(4)}(x) = 2/x^3 > 0$）的性质，将谱界直接压成锐熵上界，并逐项核算 $M_4$ 取等。完整证明由 Lean 4 内核验证并冻结。
:::

## 证明二：全 $K \ge 2$ 的三方 Mermin–CGLMP 贝尔不等式面片定理（*Phys. Rev. A* 2012）

Grandjean 等人（*Phys. Rev. A* 2012）提出了三方 $K$ 结果贝尔不等式 $(K - 1) \le I_K(p)$，此前仅对若干小 $K$ 做过数值检验，对一切 $K \ge 2$ 的普遍面片性长期悬而未决。下面这条冻结定理不靠有限穷举，一次性对全部整数 $K \ge 2$ 锁死它的余维数为 $1$：

::: {.theorem #thm-mermin-facet title="三方 Mermin–CGLMP 不等式对所有 $K \ge 2$ 都是局域多面体的面片" lean="D5/S3/QuantumBounds/MerminCglmpFacet.result"}
对任意整数 $K \ge 2$：

1. 对三方局域多面体 $L_K$ 中的所有行为 $p \in L_K$，不等式 $(K - 1) \le I_K(p)$ 恒成立；
2. 饱和超平面上的局域行为张成的仿射空间余维数严格为 $1$：
$$
\dim_{\mathbb{R}}\bigl(\mathrm{vectorSpan}_{\mathbb{R}}\{p \in L_K \mid I_K(p) = K - 1\}\bigr) + 1
= \dim_{\mathbb{R}}\bigl(\mathrm{vectorSpan}_{\mathbb{R}}(L_K)\bigr).
$$
:::

::: proof
在 [`MerminCglmpFacet.result`](lean:D5/S3/QuantumBounds/MerminCglmpFacet.result) 中，先对全部确定性局域顶点建立 $I_K \ge K - 1$ 并由凸包单调性推广至整个 $L_K$，再通过 Charlie 切片与矩形粘合（`tripartite_rigidity`）证明饱和顶点精确切出余维数为 $1$ 的紧面片。完整证明由 Lean 4 内核验证并冻结。
:::

## 证明三：Godsil 平均混合矩阵判别式整性猜想（*JCTA* 2013）

连续时间量子行走领域的权威学者 Chris Godsil 在 *Journal of Combinatorial Theory, Series A*（`arXiv:1103.2578v3` §11 Question 1）中追问：任意有限简单图 $G$ 的邻接矩阵有理极小多项式判别式，乘上其平均混合矩阵（average mixing matrix）的每一个矩阵元，是否永远把分母扫得一干二净、只留下整数？

::: {.theorem #thm-godsil-mixing title="极小多项式判别式消去图平均混合矩阵的一切分母" lean="D5/S3/Quantum/Dynamics/AverageMixingDiscriminantIntegrality.result"}
对任意自然数 $n$、任意有限简单图 $G$（顶点集 $\mathrm{Fin}\,n$）及任意顶点对 $i, j$，存在整数 $z \in \mathbb{Z}$ 使得
$$
\mathrm{discr}\bigl(\mathrm{minpoly}_{\mathbb{Q}}(A_G)\bigr) \cdot \mathrm{avgMixing}(G)_{i,j} = z.
$$
:::

::: proof
在 [`AverageMixingDiscriminantIntegrality.result`](lean:D5/S3/Quantum/Dynamics/AverageMixingDiscriminantIntegrality.result) 中，通过局部判别式消去（`discr_scaled_entry`）把乘积后的每个矩阵元写成互异特征值的整系数对称多项式，再结合韦达定理与对称多项式基本定理直接证明其取值为整数。完整证明由 Lean 4 内核验证并冻结。
:::

## 证明四：有限维下 $\ell_1$ 相干度控制相对熵相干度（*Phys. Rev. A* 2016）

Rana、Parashar 与 Lewenstein（*Phys. Rev. A* 2016）提出猜想：在量子资源理论里，相对熵相干度 $C_{\mathrm{rel}}(\rho)$ 是否对一切有限维密度矩阵 $\rho$ 恒不超过 $\ell_1$-范数相干度 $C_{\ell_1}(\rho)$？

::: {.theorem #thm-coherence-l1 title="所有有限维态的相对熵相干度不超过 $\ell_1$ 相干度" lean="D5/S3/Divergence/CoherenceL1RelativeEntropyBound.result"}
对所有自然数 $n \in \mathbb{N}$ 及所有 $n \times n$ 复密度矩阵 $\rho$（`IsState ρ`），恒有
$$
\mathrm{coherenceRel}(\rho) \le \mathrm{l1Coherence}(\rho).
$$
:::

::: proof
在 [`CoherenceL1RelativeEntropyBound.result`](lean:D5/S3/Divergence/CoherenceL1RelativeEntropyBound.result) 中，证明将问题归约为二元 Holevo 界（`AudenaertBinaryHolevoBound.binaryHolevoBound`）与对数导数迹估计，在所有有限维上一次封顶。完整证明由 Lean 4 内核验证并冻结。
:::

## 反驳二：四维相容量子通道未必 Jordan 相容（*Nat. Commun.* 2021）

Girard、Plávala 与 Sikora（*Nature Communications* 2021）在研究广义概率论与量子通道相容性时，追问任意一对相容量子通道（`Compatible Φ Ψ`）是否必然 Jordan 相容（`JordanCompatible Φ Ψ`）。`trureturing` 在维度 $d = 4$ 构造出显式测量—制备通道反例，直接敲碎该全维断言！

::: {.theorem #thm-jordan-refutation title="相容量子通道在 $d = 4$ 上未必 Jordan 相容" lean="D5/S3/QuantumChannels/JordanCompatibilityRefutation.result"}
「对一切维度 $d$ 及一切相容量子通道对 $(\Phi, \Psi)$ 皆必满足 Jordan 相容」的命题 `claim` 不成立：$\neg\,\mathrm{claim}$，且在维度 $d = 4$ 存在显式通道反例。
:::

::: proof
在 [`JordanCompatibilityRefutation.result`](lean:D5/S3/QuantumChannels/JordanCompatibilityRefutation.result) 中，于 $\mathrm{Fin}\,4$ 上显式构造一对合法量子通道 $\Phi, \Psi$，核验其存在共同母通道（`compatible_witness`）的同时满足 `not_jordanCompatible`，从而反驳普遍命题。完整证明由 Lean 4 内核验证并冻结。
:::

## 证明五：Zeitlin 度量平均 Ricci 曲率的调和极限（*Commun. Math. Phys.* 2026）

最后看一道刚刚发表于 2026 年 *Communications in Mathematical Physics* 的热腾腾前沿问题：Lichtenfelz、Modin 与 Preston 研究二维球面矩阵量子化（Zeitlin 截断）的平均 Ricci 曲率 $\tilde{r}_\ell(N)$，猜想对任意角动量阶数 $\ell \ge 2$，当矩阵截断维数 $N \to \infty$ 时其极限精确等于 $-(H_\ell - 1)/2$（其中 $H_\ell = \sum_{k=1}^\ell 1/k$ 为第 $\ell$ 个调和数），并且充分大时严格为负。

::: {.theorem #thm-zeitlin-ricci title="Zeitlin 平均 Ricci 曲率的调和极限与终负性" lean="D5/S3/Quantum/Algebra/ZeitlinSixJ/RicciLimit.result"}
对所有整数 $\ell \ge 2$，平均 Zeitlin Ricci 曲率序列 $\tilde{r}_\ell(N)$ 满足
$$
\lim_{N \to \infty} \tilde{r}_\ell(N) = -\frac{H_\ell - 1}{2},
$$
且存在 $N_0 \in \mathbb{N}$ 使得对一切 $N \ge N_0$ 皆有 $\tilde{r}_\ell(N) < 0$。
:::

::: proof
在 [`RicciLimit.result`](lean:D5/S3/Quantum/Algebra/ZeitlinSixJ/RicciLimit.result) 中，证明将平均曲率拆分为除以 $N^2 - 1$ 后的正项与负项 $6j$-符号和：一旦 $N > \ell$，负项即恒等于常数 $(H_\ell - 1)/2$；而对正项应用 $6j$-符号求和规则与 Tannery 级数极限论证证明其趋于 $0$。再由 $\ell \ge 2 \implies H_\ell \ge \frac{3}{2} > 1$ 直接迫出极限严格为负及终负性。完整证明由 Lean 4 内核验证并冻结。
:::

## 跨越单题：四维时空的唯一性选择（2026-11-27 实时冻结）

单篇期刊里的开放题测试的是引擎的战术爆发力；更深一层的问题是，这台引擎能否把多条跨领域物理支柱同时拉上同一张形式化工作台，看看它们合在一起会把宇宙的维数锁死在哪里。就在 `2026-11-27` 快照 `548388cd` 当天冻结的 `DeSitterGravitonModes` 模块里，四道看似彼此独立的经典物理约束——非零 Weyl 曲率、零锥菱形首阶角动量模权的可和性、麦克斯韦电磁场的标度共形不变性，以及双横偏振自由度——在 $D \ge 3$ 的时空维度上交汇成一把四向虎钳，将唯一存活的维度精准锁死在 **$D = 4$**：

::: {.theorem #thm-unique-dim-four title="四维时空唯一性：Weyl 曲率、零锥首模可和、麦克斯韦共形不变与双偏振唯一锁定 D = 4" lean="D5/S3/Quantum/Analysis/NullConeGravity/DeSitterGravitonModes.grand_unification_unique_dimension_four"}
对任意满足 $D \ge 3$ 的自然数时空维度 $D : \mathbb{N}$，以下四项条件的合取成立，当且仅当 $D = 4$：
$$
\begin{aligned}
\bigl(0 < \dim_{\mathbb{R}} \mathrm{Weyl}(D)
&\land \mathrm{Summable}(\mathrm{leadingModeWeight}\,D) \\
&\land (\forall \Omega \in \mathbb{R}_{>0},\ \mathrm{maxwellConformalWeight}(D, \Omega) = 1) \\
&\land D - 2 = 2\bigr) \iff D = 4
\end{aligned},
$$
四项依次刻画非平凡 Weyl 曲率、零锥菱形首阶角模权重可和、麦克斯韦共形权重恒等于 $1$ 与两态横偏振自由度。
:::

::: proof
在 [`grand_unification_unique_dimension_four`](lean:D5/S3/Quantum/Analysis/NullConeGravity/DeSitterGravitonModes.grand_unification_unique_dimension_four) 中，四条物理约束逐层削去候选维度：首先，非零 Weyl 曲率（`weylDim_pos_iff`）直接排除 $D = 3$、迫出 $D \ge 4$——这与同模块内的零公理姊妹定理 `graviton_polarizations_three_four_five` 彼此呼应（后者由内核 `decide` 在零公理下直接认证引力子偏振数在 $D = 3, 4, 5$ 时依次为 `0`、`2`、`5`）；其次，零锥首阶角模权重的可和性（`scalar_nullDiamond_and_propagating_gravity_iff`）进一步把存活窗口压缩进 $D \in \{4, 5\}$；最后，麦克斯韦共形权重对一切 $\Omega > 0$ 恒为 $1$ 与双横偏振／Hodge 二形式维数条件 $D - 2 = 2$ 将唯一解钉死在 $D = 4$，反向则逐项验证 $D = 4$ 满足全部四条。完整证明由 Lean 4 内核验证并冻结。
:::

若把这里的零公理 `decide` 引力子偏振计数（`graviton_polarizations_three_four_five`）放进更广的构造性谱系，它在[第六章](ch06-mathesis-books-and-rh.md)还有一位直接呼应的蓝色零公理同伴——单纯庞加莱引理 [@thm-omega-simplicial-exact]（`d2_eq_zero_iff`，在官方 Lean 与裸 CIC `strict_omega` 两端均严格满足 `axioms: []`），以显式锥同伦为[第二章](ch02-information-escape-and-novelty.md)的粘合障碍 [@thm-gluing-obstruction] 补上了二阶单纯上链的构造性镜像。

七条跨越五份国际顶级物理学与数学期刊的文献旗舰证明与反驳，外加一条 `2026-11-27` 实时冻结的四维时空唯一性选择定理——八条铁证摆在眼前，没有一句「我们坚信它成立」，每一条都连着可当场点开验核的绿色 Lean 冻结源码。那么，这座横跨 **17,968 个冻结模块、223,231 条冻结定理**（`548388cd`，2026 年 11 月 27 日）的庞大真值图，在 24/7 实时运转时到底长什么模样？下一章，我们推开 **`live.trureturing.org`** 的透明玻璃门。

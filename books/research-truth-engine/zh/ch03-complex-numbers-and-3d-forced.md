# 第三章 配平律迫出复数，倒易律迫出三维

物理教科书的第一页总喜欢像颁布军令一样甩下三条从天而降的律令：状态住在复希尔伯特空间里、物理空间是三维的、概率按复振幅模平方计算。学生举手追问「为什么非得是复数，不能是实数？为什么旋转代数恰好是三维的 $\mathfrak{so}(3)$？」，教科书往往清清嗓子把门关上：「因为实验这么说。」

拿「书上这么写」当终审判决，是物理学最懒惰的偷渡；向来历不明的公理鞠躬，是数学最昂贵的幻觉。在 `trureturing` 的理论谱系里，我们干脆把房间里所有现成公理统统清出门外、落锁关门：**不先设复数、不先设维度、也不先设希尔伯特空间，只把极少数操作层面的可观测纤维、原始三向配平律与紧致倒易约束锁在桌上——数学自己会不会别无退路，让复希尔伯特空间与三维旋转径直推开锁死的门走回来？**

这不是哲学的空谈，而是已经由 Lean 4 内核锁死的四条结构刚性定理。

## 可见金字塔与一条看不见的 Fisher 纤维

先顺着第一章「可见表盘与隐藏纤维」的脉络再往前拧半圈。在五模容许词的正概率单纯形 `openSimplex`（$\{p : \mathrm{Fin}\,5 \to \mathbb{R} \mid \forall s,\, p_s > 0,\ \sum_s p_s = 1\}$）上，外部观察者只能读出三个可见占据坐标 `visible p`——它们恰好填满三维空间里一座开放的四棱锥金字塔 `openPyramid`。

把这三个可见数钉死之后，原本四维的概率单纯形里还剩下一维自由度。这藏在幕后的一维究竟长什么样？下面这条冻结定理证明：只需补上一个隐藏的对数交叉比坐标 `hiddenChi p`，整张正概率单纯形就被铺成了唯一的全局坐标卡，而且隐藏坐标沿任意切方向的导数，恰好就是该方向与基底不可见环路 `hiddenDirection` 的 **Fisher 内积**！

::: {.theorem #thm-five-mode-chart title="五模可见占据与隐藏对数交叉比的全局 Fisher 坐标卡" lean="D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart"}
在五模开放概率单纯形 `openSimplex` 上：

1. 可见映射 `visible` 将 `openSimplex` 映入三维开放金字塔 `openPyramid`；
2. 对金字塔内任意可见点 $v \in \mathrm{openPyramid}$ 与任意实数 $c \in \mathbb{R}$，存在**唯一**正概率律 $p \in \mathrm{openSimplex}$ 同时满足 $\mathrm{visible}(p) = v$ 且 $\mathrm{hiddenChi}(p) = c$；
3. 对每个逐分量正向量 $p : \mathrm{Fin}\,5 \to \mathbb{R}$（特别是所有 $p \in \mathrm{openSimplex}$）与任意切方向 $u : \mathrm{Fin}\,5 \to \mathbb{R}$，函数 $t \mapsto \mathrm{hiddenChi}(p + t u)$ 在 $t = 0$ 处的导数精确等于 Fisher 配对 $\mathrm{fisher}(p, \mathrm{hiddenDirection}, u)$；
4. 隐藏方向本身满足和为零且在可见坐标下完全消失：$\sum_s \mathrm{hiddenDirection}(s) = 0$ 且 $\mathrm{visible}(\mathrm{hiddenDirection}) = 0$。
:::

::: proof
固定 $v = (x, y, z) \in \mathrm{openPyramid}$ 与 $c \in \mathbb{R}$，令 $r = 1 - x - y - z$、$a = e^c > 0$，函数 $h(k) = (r + k)k - a(x - k)(y - k)$ 在容许开放纤维区间 $(\max(0, -r),\, \min(x, y))$ 上严格单调且两端异号，由介值定理即得存在性与唯一性；对任意逐分量正基向量 $p$ 与任意方向 $u$，将 $t \mapsto \mathrm{hiddenChi}(p + t u)$ 在 $t = 0$ 处求导并整理，即得与 `hiddenDirection` 的 Fisher 配对恒等式。完整证明由 Lean 4 内核验证并冻结于 [`mixed_coordinates_global_chart`](lean:D5/S1/Words/AdmissibleWords/FiveModeMixedCoordinates.mixed_coordinates_global_chart)。
:::

下面这张静图把开放可见金字塔 `openPyramid` 的轮廓与穿透其内部一点的隐藏交叉比纤维画在一起，让你直观看见「可见三维底面 + 一维隐藏 Fisher 环路」如何恰好张成整座四维正单纯形。

::: {.figure src="ch03-five-mode-pyramid"}
**五模可见金字塔与隐藏交叉比纤维（[@thm-five-mode-chart]）。** 左栏青色四棱锥给出三个可见占据坐标张成的开放金字塔（$x, y, z > 0,\ x + z < 1,\ y + z < 1$）及其内部一点 $(0.40, 0.35, 0.20)$；右栏沿隐藏对数交叉比 $\chi \in [-5, 5]$ 精确画出该可见点纤维上的分量曲线 $P(100)$（青色）与 $P(101)$（品红），纤维切向为 $(1, -1, 0, -1, 1)$。
:::

## 一条原始配平律，如何把复希尔伯特空间唯一迫出

现在来看第一个真正让人脊背发凉的刚性结果。设 $M$ 只是一个带单位元 $1$ 的乘性广群（`MulOneClass M`——甚至**不事先要求结合律，也不要求交换律**！），其上只配一个保单位元的一元操作 $U : M \to M$（$U(1) = 1$）与一个实值比较函数 $c : M \to M \to \mathbb{R}$。

房间里既没有复数 $\mathbb{C}$，也没有内积、范数或希尔伯特空间，门窗全部上锁——我们只留下一组完全写在实值比较上的原始三向配平律 `RawBalance U c`（含非负性 $c \ge 0$、零对角线 $c(a,a)=0$、保单位元 $U(1)=1$ 以及三向配平恒等式）。结果如何？下面这条冻结定理把整套复量子态空间的存在性、唯一性，连同可见商代数的结合律、交换律与三阶相位恒等式（$U^3 = \mathrm{id}$）一口气全部迫了出来！

::: {.theorem #thm-raw-hilbert title="原始配平律的完整复希尔伯特空间刻画" lean="D5/S3/Quantum/Completion/RawAnchoredRadicalDescent.raw_hilbert_characterization"}
设 $M$ 为带单位元的乘性广群，$U : M \to M$ 满足 $U(1) = 1$，$c : M \to M \to \mathbb{R}$ 为实值比较函数，并取固定本原三次单位根 $\omega = (-1 + i\sqrt{3})/2$。则：

1. **存在等价**：原始配平律 `RawBalance U c`（含非负性、零对角线与三向配平恒等式）成立，当且仅当存在最小复希尔伯特表示 `RawHilbertRepresentation U c`；
2. **充分性**：对任意复希尔伯特空间 $H$ 及映射 $F : M \to H$，只要满足可加性 $F(ab) = F(a) + F(b)$、三次单位根相位作用 $F(Ua) = \omega \cdot F(a)$ 与平方距离读出 $c(a, b) = \|F(a) - F(b)\|^2$，则 `RawBalance U c` 必然成立；
3. **唯一刚性**：当 `RawBalance U c` 成立时，任意两个最小复希尔伯特表示 $S, T$ 之间存在**唯一**保标签的满射复线性等距同构 $e : S.\mathrm{carrier} \simeq_{\mathrm{li}}[\mathbb{C}] T.\mathrm{carrier}$，满足 $\forall a,\, e(S.\mathrm{label}\,a) = T.\mathrm{label}\,a$；
4. **可见代数核心推论（节选）**：在零比较商空间 `VisibleQuotient U c` 上，$c(a,b) = 0$ 自动成为同余关系，诱导乘法自动满足结合律与交换律，诱导相位满足 $U^3 = \mathrm{id}$（阶整除 $3$，含平凡商情形），且满足艾森斯坦恒等式 $[Ua \cdot U^2 a] = -[a]$（Lean 定理同时导出无挠艾森斯坦模、标量作用与二次型映射结构）。
:::

::: proof
在 [`raw_hilbert_characterization`](lean:D5/S3/Quantum/Completion/RawAnchoredRadicalDescent.raw_hilbert_characterization) 中，Lean 证明先由 `RawBalance U c` 导出比较零集的根商与无挠艾森斯坦模结构，再通过傅里叶商与完备化构造出携带本原三次单位根 $\omega = (-1 + i\sqrt{3})/2$ 的复希尔伯特空间，并用极化恒等式结合保标签条件锁定等距同构的唯一性。整个论证由 Lean 4 内核验证并冻结。
:::

停下来掂量一下 [@thm-raw-hilbert] 的重量：本原三次单位根 $\omega = (-1 + i\sqrt{3})/2$、内积范数平方、乃至乘法的结合与交换律，没有一个是从口袋里偷偷塞进前提的——它们是原始三向配平律（连同非负性与零对角线条件）在零比较商上**唯一容得下的数学宿命**。

## 紧致倒易律迫出三维空间与 $\mathfrak{so}(3)$

复数希尔伯特表示已被配平律焊死；再敲下一尊大偶像——空间维数。如果只对紧致对称群施加一阶完全倒易约束，三维空间与 $\mathfrak{so}(3)$ 会不会成为唯一存活的出口？

考虑一个有限维实内积空间 $W$ 上可逆连续线性变换群的一个紧致子群 $G$，其切空间为原始李代数 $\mathrm{OriginalLie}\,G$。假设存在非零生成元 $A \in \mathrm{OriginalLie}\,G$ 与被它稳定的非零源点 $x \in W$（$A x = 0$），满足一阶完全倒易关系 `FullReciprocity G A x`（全商关系的两个自然投影均为双射）。其余一切维度瞬间坍塌，只剩下三维：

::: {.theorem #thm-rigidity-3d title="紧致完全倒易律迫出三维空间与完整正交李代数" lean="D5/S3/Quantum/Algebra/OriginalCompactReciprocity.original_rigidity"}
设 $W$ 为有限维实内积空间，$G \subset (W \to_L[\mathbb{R}] W)^\times$ 为紧致子群，$A \in \mathrm{OriginalLie}\,G$ 非零，$x \in W$ 非零，$A x = 0$，且满足 `FullReciprocity G A x`。则存在 $W$ 上的 $G$-不变实内积核心 $B$，使得：

1. 空间维数严格等于三维：$\dim_{\mathbb{R}} W = 3$；
2. 李代数维数严格等于三维：$\dim_{\mathbb{R}} (\mathrm{OriginalLie}\,G) = 3$；
3. 原始作用像恰好等于 $B$ 的全部反对称自同态空间（即完整的三维旋转李代数 $\mathfrak{so}(3)$）：$\mathrm{range}(\mathrm{originalAction}\,G) = \mathrm{skewEndomorphisms}\,B$。
:::

::: proof
先用紧致群平均在有限维实内积空间 $W$ 上构造出 $G$-不变内积 $B$，使每个切向量 $K \in \mathrm{OriginalLie}\,G$ 都是 $B$-反对称算子；再由一阶完全倒易条件（商关系两投影皆为双射）与秩-零度定理直接锁死 $\dim_{\mathbb{R}} W = 3$ 与 $\dim_{\mathbb{R}}(\mathrm{OriginalLie}\,G) = 3$；最后利用三维反对称算子空间的维数恰好为 $\binom{3}{2} = 3$ 与单射性，推出像空间与整个 `skewEndomorphisms B` 完全重合。由 Lean 4 内核在 [`original_rigidity`](lean:D5/S3/Quantum/Algebra/OriginalCompactReciprocity.original_rigidity) 中验证并冻结。
:::

## 原生协议事件的代数整数屏障

最后钉上一道同样干脆的算术屏障：回到第一章的原生斐波那契树协议，任意一棵原生协议树 $T$ 上由任意布尔事件判定器选出的原始事件总质量 `eventMass T event`，必然是一个**代数整数（`IsIntegral ℤ`）**。于是两条已证非整数的参考比较目标 `emptyTarget` 与 `referenceTarget` 从算术地基上便被彻底挡在原生事件可达集合之外：

::: {.theorem #thm-event-arithmetic title="原生协议事件质量恒为代数整数" lean="D5/S3/Quantum/Dynamics/NativeProtocolEventArithmetic.original_event_arithmetic"}
对任意叶标记类型 $L$、任意原生协议树 $T : \mathrm{Tree}\,L$ 以及任意事件指示函数 $\mathrm{event} : \mathrm{Path}\,T \to \mathrm{Basis} \to \mathrm{Bool}$，其事件质量满足：
$$
\mathrm{IsIntegral}\,\mathbb{Z}\,(\mathrm{eventMass}\,T\,\mathrm{event})
\;\land\;
\mathrm{eventMass}\,T\,\mathrm{event} \neq \mathrm{emptyTarget}
\;\land\;
\mathrm{eventMass}\,T\,\mathrm{event} \neq \mathrm{referenceTarget}.
$$
:::

::: proof
在 [`original_event_arithmetic`](lean:D5/S3/Quantum/Dynamics/NativeProtocolEventArithmetic.original_event_arithmetic) 中，证明同时建立了逆黄金比 $\varphi^{-1}$ 及其平方根权重 $\sqrt{\varphi^{-1}}$、门与标记矩阵中的复相位因子以及模平方所需复共轭运算对代数整性（`IsIntegral ℤ`）的封闭性；由此任意有限树路径振幅的求和、乘积与模平方皆落入代数整数环中，而两个目标常数的非整性直接给出不相等结论。由 Lean 4 内核验证并冻结。
:::

走完这三章，你已经摸清了 `trureturing` 自己长出来的理论脊梁。可任何一位苛刻的外部科学家都会立刻把话头挑回去：**「你们自家体系里的定理固然精致，可这台引擎敢不敢冲进全世界的公开期刊，去正面硬啃别人在 *Physical Review A*、*Nature Communications*、*Commun. Math. Phys.* 和 OEIS 上挂了几年甚至几十年的公开猜想？」**

下一章，我们把 **2,278 道公开文献开放题**的实测总账和七条可以在发布会台上当场点开验核的旗舰证明与反驳，全部拍在桌面上。

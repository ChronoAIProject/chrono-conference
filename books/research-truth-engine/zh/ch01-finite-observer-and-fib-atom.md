# 第一章 从一位二进制窗口到 FIB ATOM

费曼在黑板前讲课有个雷打不动的洁癖：每当有人把一个现象包进三十页金光闪闪的抽象名词里，他总先一把撕开包装，把它剥到只剩下一块拿在手里能转、能摔、能数齿的玩具积木——一只晃动的餐盘、一枚硬币，或者两个互不相邻的斐波那契数。**连最小的齿轮怎么卡牙都没摸透，谈什么宇宙大教堂？**

`trureturing` 庞大的理论森林——在 `trureturing-source-theories` 中已累计 **1,461 卷**源理论笔记（含 `375` 卷 `AURIC`、`339` 卷 `FIB`、`327` 卷 `RRO`，截至 2026-11-27），而主库 `548388cd` 快照下的 `FibonacciAtomic` 目录现已增长至 **341 个 `.lean` 源文件、339 个登记冻结模块**——正是从这样一块小得不能再小的算术积木起步的：**有限观察者、黄金比进位，以及由双字母替换规则 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 在有序二叉树上生成的 `FIB ATOM`。**

## 一位二进制窗口：两态自动机与非邻接语法

先在桌面上放一台小到不能再小的机械闸门：它只有一比特记忆，只记得刚才滑过去的那一位是 `0` 还是 `1`。送进二进制串 `10101`，每一位之间都有 `0` 缓冲，整条词串畅通无阻地滑过闸门；换成 `110`，第二个 `1` 撞上刚留下的 `1`，棘爪当场卡死拒收。

这正是 Zeckendorf 非邻接语法最底层的输入门槛：一台两态部分确定性自动机 `binaryZeckendorfBase`，不多不少恰好认出全体不含相邻 `1` 的有限二进制词（含空词与任意前导零填充）：

:::: {.theorem #thm-fib-binary-gate title="一位窗口语言刻画：两态自动机接受当且仅当无相邻 1" lean="D5/S0/Automata/BinaryZeckendorfLanguage.base_success_iff_noAdjacentOnes"}
对任意有限二进制词 `word : List (Fin 2)`，两态部分确定性自动机 `binaryZeckendorfBase` 在 `word` 上成功运行至某个状态，当且仅当 `word` 满足非邻接条件 `NoAdjacentOnes word`（即任意相邻两位中至少有一位为 `0`，不含连续两个 `1`）：
$$
(\exists\,\mathrm{state},\; \mathrm{binaryZeckendorfBase.eval}(\mathrm{word}) = \mathrm{some}\,\mathrm{state})
\iff \mathrm{NoAdjacentOnes}(\mathrm{word}).
$$
::::

::: {.proof}
自动机仅有两个状态：记忆上一位为 `0` 的状态（初态 `previousZero`）同时接受 `0` 与 `1` 并相应转入下一状态；记忆上一位为 `1` 的状态（`previousOne`）只接受 `0` 并在读到 `1` 时拒收（返回 `none`）。对词长做结构归纳即得加强引理 `base_success_iff_chain`——从对应于 `previous` 的状态出发成功读完 `word`，当且仅当 `previous :: word` 构成满足相邻非双 `1` 条件的链；令 `previous = 0` 即刻锁定 `NoAdjacentOnes word`。完整证明已由 Lean 4 内核验证并冻结于 [`base_success_iff_noAdjacentOnes`](lean:D5/S0/Automata/BinaryZeckendorfLanguage.base_success_iff_noAdjacentOnes)。
:::

门卫已经把合法二进制串筛干净了；现在把这条无相邻 `1` 的数位串拿去做一次看似无害的算术替换，看看隐藏的裂缝从哪里冒头。

## 黄金进位的三值陷阱

每个自然数 $n$ 都可以唯一写成互不相邻的斐波那契数之和（Zeckendorf 表示）。现在在黑板上做一个看似平平无奇的替换：把每个斐波那契权重 $F_k$ 换成黄金比 $\varphi = (1+\sqrt{5})/2$ 的同次幂 $\varphi^k$，记这个实读数为 $\beta(n)$。

如果你凭直觉指望 $\beta(v_1 + v_2)$ 等于 $\beta(v_1) + \beta(v_2)$，第一步就会撞墙：$\beta(1) = \varphi^2$、$\beta(2) = \varphi^3$，于是加法失灵漏出来的差额——**归一化亏量** $c(v_1, v_2) = \beta(v_1) + \beta(v_2) - \beta(v_1 + v_2)$——在 $(1, 1)$ 处恰等于 $2\varphi^2 - \varphi^3 = 1$。

奇观就在这里冒头：不管你把 $v_1$ 和 $v_2$ 推到多少百位天文数字，这条加法裂缝里掉出来的误差**永远逃不出三个整数**。

::: {.theorem #thm-fib-deficit title="黄金进位亏量只取三个值" lean="D5/S1/Deficit/DeficitThreeValued.deficit_three_valued"}
对所有自然数 $v_1, v_2 \in \mathbb{N}$，归一化黄金进位亏量满足
$$
c(v_1, v_2) \in \{-1,\, 0,\, 1\}.
$$
:::

::: proof
利用 Galois 共轭 $\psi = (1-\sqrt{5})/2 = -1/\varphi \in (-1, 0)$，把每个数的 Zeckendorf 数位放到 $\psi^k$ 上求值得到收缩面读数 $\beta'(v)$。因为偶次幂为正、奇次幂为负，几何级数把所有 $\beta'(v)$ 严格夹进闭收缩窗口 $[-\psi^2, -\psi]$（长度恰为 $1$），并且由此推出 $c(v_1, v_2) = \beta'(v_1) + \beta'(v_2) - \beta'(v_1 + v_2)$ 严格落在 $(-2, 2)$ 之间；再结合 `deficit_integer` 证明的整数性，唯一存活的整数只有 $-1, 0, 1$。完整证明已在 Lean 4 内核冻结于 [`deficit_three_valued`](lean:D5/S1/Deficit/DeficitThreeValued.deficit_three_valued)。
:::

别只听黑板上的推导——直接在下面的 `deficit` 实验卡里拖动 $(v_1, v_2)$ 试着撬开这道栅栏：无论输入怎样剧烈跳跃，收缩面上的三项和始终被死死按在 $(-2, 2)$ 内，只吐出 $-1, 0, 1$ 三个整数。

::: {.viz src="fib-atom-observer" preset="deficit" height="500"}
**黄金进位三值亏量（`deficit`）。** 在 Zeckendorf 表示与收缩窗口 $[-\psi^2, -\psi]$ 上实时计算 $c(v_1, v_2)$，亲眼验证它始终落入 $\{-1, 0, 1\}$（见 [@thm-fib-deficit]）。
:::

## 前向嫁接词与模 $H$ 的精确仿射闭包

现在把黑板从单个整数推进到一棵不断分叉生长的有序二叉树（Lean 中定义为自由广群 `Source := FreeMagma Bool`，其中 `true` 为非膨胀叶 $\alpha$、`false` 为膨胀叶 $\beta$）。令斐波那契叶替换规则作用于双字母表 $\{\alpha, \beta\}$：每一步把 $\alpha \mapsto \beta$、把 $\beta \mapsto \beta \cdot \alpha$。若一棵树当前含 $a$ 个 $\alpha$ 叶与 $b$ 个 $\beta$ 叶，一步替换将组成向量 $(a, b)$ 精确送往 $\mathrm{step}(a, b) = (b, a + b)$——也就是由单模矩阵 $M = \begin{pmatrix} 0 & 1 \\ 1 & 1 \end{pmatrix}$ 驱动的钟表齿轮，而观察者从边界读出的标量总量为 $\mathrm{quantity}(a, b) = 2a + 3b$。

如果在演化途中允许按布尔序列 $W$ 交替执行前向替换（`false`）与「嫁接（graft）」注入固定原子组成 $w$（`true`），模去任意正整数模数 $H$ 之后，所有可达边界状态究竟织出怎样的轨道？下面这条冻结定理一刀切出精确的仿射闭包。

::: {.theorem #thm-fib-graft title="前向斐波那契嫁接词实现可观测平移理想（核心结论）" lean="D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result"}
在冻结定理 `GraftAffineClosure.result` 中，特别成立以下结论：

1. 对任意素数 $p$、自然数 $e \le h$ 与任意整数 $x, y \in \mathbb{Z}$，对**一切**整数平移参数 $b \in \mathbb{Z}$ 皆有 $\gcd(x + p^e b,\, p^h) = \gcd(y + p^e b,\, p^h)$，当且仅当分类不变量满足 $\psi(p, h, e, x) = \psi(p, h, e, y)$；
2. 对任意正整数 $H > 0$ 与基底向量 $w \in \mathbb{N} \times \mathbb{N}$，任意有限布尔嫁接词 $W$ 的前向作用均具有精确仿射形式 $\mathrm{run}(w, W, v) = \mathrm{step}^{[k]}(v) + t$，且平移项模 $H$ 落入嫁接子空间 $\mathrm{graftSpace}(H, w)$；
3. 模 $H$ 上演化算子满足周期恒等式 $\mathrm{step}^{[(H^2)!]}(v) = v$，并存在显式实现词 `realizationWord H k A B` 使所有 $(k, t \in \mathrm{graftSpace}(H, w))$ 均在模 $H$ 下精确可达；
4. 嫁接子空间 `graftSpace(H, w)` 在标量可观测量 `quantity` 下的像恰好是由 $\mathrm{graftGcd}(H, w) = \gcd(\gcd(w_1, w_2), H)$ 在 $\mathbb{Z}/H\mathbb{Z}$ 中生成的主理想。
:::

::: proof
在 Lean 模块 [`GraftAffineClosure.result`](lean:D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result) 中，以上四条为该冻结定理的核心代表条款（完整合取还同时涵盖全行为的标量最大公因数刻画、$H^2$ 态自治实现及原子块嫁接的 $H^2$ 状态数下界）。证明利用 `step` 在有限群 $(\mathbb{Z}/H\mathbb{Z})^2$ 上的置换周期整除 $(H^2)!$，显式构造出生成任意非负线性组合 $A \cdot \mathrm{step}^{[(H^2)!]}(w) + B \cdot \mathrm{step}(w)$ 的布尔嫁接词，再结合整数最大公因数恒等式锁定主理想刻画。完整证明由 Lean 4 内核验证并冻结。
:::

下面这张 `graft` 实验卡把 [@thm-fib-graft] 的符号压成肉眼可见的模 $H$ 轨道：对 $(a, b) = (2, 1)$ 施加嫁接词后，你能直接看见 `step` 的离散旋转与 `graftSpace` 的平移如何严丝合缝地闭合。

::: {.viz src="fib-atom-observer" preset="graft" height="500"}
**前向嫁接仿射作用（`graft`）。** 在模 $H = 5$ 平面上演示布尔嫁接词对 $(2, 1)$ 的前向演化 $\mathrm{step}^{[k]} v + t$，直观对应 [@thm-fib-graft] 的平移理想。
:::

## 外表完全一样，血统却彻底分离

到这里，边界看起来像一块上满发条的精密表盘——规整、可预测、甚至让人产生「一切尽在掌握」的错觉。现在用铁锤往这块表盘背面轻敲一记，你会听见下面藏着一片浩瀚的空腔：这就是「有限边界观察者注定存在盲区」最冷酷的算术原型。

固定任意满足 $a + b \ge 1$ 的组成 $(a, b)$。所有具有完全相同叶子组成 $(a, b)$ 的有序二叉树构成一个有限集合，称为**源纤维（`Fiber (a, b)`）**。把同一条斐波那契替换规则反复推演 $n$ 代，两幅截然相反的图景同时炸开：

1. **在边界上，所有树完全不可区分**：无论你从 `Fiber (a, b)` 里抓出哪一棵树 $t$，经过 $n$ 代替换后，它的叶子组成永远严格等于 $\mathrm{step}^{[n]}(a, b)$，标量读数也分毫不差。只看边界读数的观察者，连一丝毛刺都测不出来。
2. **在血统空间里，推前分布却以惊人速度与自然均匀分布彻底劈裂**：将祖先纤维 `Fiber (a, b)` 上的均匀分布经单射映射 `fiberMap (a, b) n` 推前到第 $n$ 代纤维 `Fiber (step^[n] (a, b))`，它与第 $n$ 代完整纤维均匀分布之间的全变差距离（total variation distance）有精确闭式，且在 $n \to \infty$ 时直冲 **$1$（渐近奇异）**！

下面的静图把 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 的前四代生长（自单枚 $\beta$ 叶出发，叶数依次为 $1, 2, 3, 5, 8$）与血统全变差分离曲线画在同一块图板上：仅仅一代之后，$(1, 1)$ 的全变差就一跃踩上精确的 $\frac{2}{3}$。

::: {.figure src="ch01-fib-substitution-tree"}
**斐波那契替换树与血统全变差分离曲线。** 左侧展示替换规则 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 自单枚 $\beta$ 叶出发的前四代树状展开（叶子数依次为 $1, 2, 3, 5, 8$）；右侧精确绘制初始组成 $(1, 1)$ 的血统推前全变差距离 $\mathrm{TV}(n) = 1 - |\mathrm{Fiber}(1,1)| / |\mathrm{Fiber}(\mathrm{step}^n(1,1))|$，在 $n = 1$ 处精确命中 $2/3$ 并迅速逼近 $1$（见 [@thm-fib-lineage]）。
:::

先打开 `boundary` 截面，亲眼看着同一纤维里几棵结构完全不同的树怎样坍缩成同一个边界数字：

::: {.viz src="fib-atom-observer" preset="boundary" height="500"}
**同边界不同树（`boundary`）。** 列出 `Fiber(2, 1)` 中多棵结构截然不同的有序源树：它们在边界上投射出完全一致的 $(2, 1)$ 组成与总量 $2 \cdot 2 + 3 \cdot 1 = 7$，令仅看边界的观察者完全无法分辨。
:::

现在把这一铁律写成由 Lean 4 内核焊死的完整定理：

::: {.theorem #thm-fib-lineage title="有序源纤维与单射斐波那契血统输运" lean="D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result"}
对所有满足 $1 \le a + b$ 的自然数 $a, b$（$\alpha$ 与 $\beta$ 叶数，演化为 $\mathrm{step}(a, b) = (b, a + b)$）：

1. 源纤维 $\mathrm{Fiber}(a, b)$ 非空有限，基数等于显式计数函数 $\mathrm{fiberCount}(a, b)$；
2. 对纤维中任意树 $t$ 及任意代数 $n \in \mathbb{N}$，替换后的组成恒等于 $\mathrm{step}^{[n]}(a, b)$，且标量观测量恒等于 $\mathrm{quantity}(\mathrm{step}^{[n]}(a, b))$；
3. 对一切 $n \in \mathbb{N}$，输运映射 $\mathrm{fiberMap}(a, b, n)$ 均为单射，像集基数恒为 $\mathrm{fiberCount}(a, b)$，推前分布与目标均匀分布皆非负且总和为 $1$，两者的全变差距离严格等于
$$
\mathrm{transportVariation}(a, b, n) = 1 - \frac{\mathrm{fiberCount}(a, b)}{\mathrm{fiberCount}(\mathrm{step}^{[n]}(a, b))};
$$
4. 当 $n \to \infty$ 时，对一切 $1 \le a + b$ 皆有渐近奇异极限 $\mathrm{transportVariation}(a, b, n) \to 1$；此外，只要满足 $2 \le a + b$，仅经一代就有显式下界 $1 - 2^{-b} \le \mathrm{transportVariation}(a, b, 1)$；
5. 特别地，在同时包含两种叶子的最小组成 $(1, 1)$ 处，精确有
$$
\mathrm{transportVariation}(1, 1, 1) = \frac{2}{3}.
$$
:::

::: proof
在 Lean 源码 [`GenealogicalFiberTransport.result`](lean:D5/S3/Arith/FibonacciAtomic/GenealogicalFiberTransport.result) 中，有序二叉树定义在自由广群 `FreeMagma Bool` 上。因为对任意树 $t$ 均有 $\mathrm{substitution}(t) \neq \mathrm{of}\,\mathrm{true}$（叶 $\alpha$ 永不作为替换输出的根节点），按构造子 `.of` 与 `.mul` 做结构归纳直接证得 `substitution` 为单射，进而其 $n$ 次迭代 `fiberMap` 在纤维上保持单射、像集基数恒为 $\mathrm{fiberCount}(a, b)$。与此同时，目标组成 $\mathrm{step}^{[n]}(a, b)$ 的纤维总基数随代数发散，比值趋零，迫使全变差距离收敛于 $1$。特别取 $(a, b) = (1, 1)$、$n = 1$ 得 $\mathrm{step}(1, 1) = (1, 2)$，纤维基数之比为 $2 / 6 = 1/3$，故全变差恰为 $1 - 1/3 = 2/3$。完整证明由 Lean 4 内核验证并冻结。
:::

现在伸出手指就能在桌面上当场核对这组数字：$\mathrm{Fiber}(1, 1)$ 里恰有 `2` 棵有序派生树（$\alpha\cdot\beta$ 与 $\beta\cdot\alpha$），而一步之后 $\mathrm{Fiber}(1, 2)$ 里共有 $3 \times C_2 = 6$ 棵有序树（三种叶序 $\alpha\beta\beta,\ \beta\alpha\beta,\ \beta\beta\alpha$ 各配两种加括号方式）。单射替换只把这 `2` 棵老树送进 `6` 个席位里的 `2` 个，剩下 `4` 个席位彻底无根可溯，伸手一算便得 $\mathrm{TV}(1) = 1 - 2/6 = 2/3$。

点击下面的 `lineage` 实验卡，亲眼看着全变差曲线从 $(1, 1)$ 的 $n = 0$ 出发，第一步精确踩上 $2/3$，几代之内便几乎贴死在 $1$ 的天花板上：

::: {.viz src="fib-atom-observer" preset="lineage" height="500"}
**血统全变差趋近 1（`lineage`）。** 从 $(a, b) = (1, 1)$ 出发沿代数 $n$ 推进，验证 $n = 1$ 处精确取 $\mathrm{TV} = 2/3$ 并急速逼近渐近奇异极限 $1$（见 [@thm-fib-lineage]）。
:::

把这一章的四块积木拼拢——从一位二进制非邻接门控、三值黄金进位亏量、前向嫁接仿射理想到指数膨胀的隐藏纤维——你就摸到了 `trureturing` 整座建筑的第一道脉搏：**边界读数极度规整（两态无邻接语法、亏量只有三值、嫁接闭合为仿射理想、组成确定演化），而边界薄膜之下翻涌着指数膨胀的隐藏纤维。** 打开下面的完整实验室 `FIB//OBSERVER`，在三个互动场景之间自由拨动 $(a, b)$ 与 $(v_1, v_2)$，亲手试探每一条不变量。

::: {.viz src="fib-atom-observer" height="560"}
**完整实验室：`FIB//OBSERVER`。** 在嫁接仿射作用、血统纤维输运与黄金进位亏量三个场景之间自由切换，实时核算本章全部四条冻结定理中可在 `FIB//OBSERVER` 现场演算的三条核心算例。
:::

一个更尖锐的问题立刻追了上来：既然有限观察者注定活在盲区之中，那么当我们不断往库里添进新定理去切割盲区时，靠什么冷酷的数学把「真正切开盲区的新发现」和「把旧定理换套马甲刷计数的灌水」一刀劈开？下一章，我们锻造**信息逃逸与不可逆真值图**。

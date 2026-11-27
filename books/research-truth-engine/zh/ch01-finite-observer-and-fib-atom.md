# 第一章 从一位二进制窗口到 FIB ATOM

费曼在康奈尔和加州理工教书时有个一以贯之的习惯：每当别人把一个问题包装成三十页高深术语，他总先把它剥到只剩下一块最朴素的玩具积木——一只旋转的盘子、一枚硬币、或者两个互不相邻的斐波那契数——先把这块小积木的怪脾气彻底摸透，再谈要不要造大教堂。

`trureturing` 的庞大理论谱系（在 `trureturing-source-theories` 中已累计 1,461 卷源理论笔记，其中包括 339 卷 `FIB` 系列，而在 2026-11-20 快照中 `FibonacciAtomic` 目录共有 326 个 `.lean` 源文件、其中 324 个已登记冻结模块），正是从这样一块小得不能再小的积木开始的：**有限观察者、黄金比进位，以及由最简单替换规则 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 生成的 `FIB ATOM`。**

## 黄金进位的三值陷阱

每个自然数 $n$ 都可以唯一写成互不相邻的斐波那契数之和（Zeckendorf 表示）。现在做一个看似平淡无奇的动作：把每个斐波那契权重 $F_k$ 换成黄金比 $\varphi = (1+\sqrt{5})/2$ 的同次幂 $\varphi^k$，记这个实数为 $\beta(n)$。

如果你天真地以为 $\beta(v_1 + v_2)$ 应该等于 $\beta(v_1) + \beta(v_2)$，立刻就会碰壁：$\beta(1) = \varphi^2$、$\beta(2) = \varphi^3$，于是差额——也就是**归一化亏量** $c(v_1, v_2) = \beta(v_1) + \beta(v_2) - \beta(v_1 + v_2)$——在 $v_1 = v_2 = 1$ 时等于 $2\varphi^2 - \varphi^3 = 1$。

令人惊奇的是，无论 $v_1$ 和 $v_2$ 取到多么天文数字般的自然数，这个加法失灵所漏出来的误差**永远逃不出三个整数**。

::: {.theorem #thm-fib-deficit title="黄金进位亏量只取三个值" lean="D5/S1/Deficit/DeficitThreeValued.deficit_three_valued"}
对所有自然数 $v_1, v_2 \in \mathbb{N}$，归一化黄金进位亏量满足
$$
c(v_1, v_2) \in \{-1,\, 0,\, 1\}.
$$
:::

::: proof
利用 Galois 共轭 $\psi = (1-\sqrt{5})/2 = -1/\varphi \in (-1, 0)$，把每个数的 Zeckendorf 数位放到 $\psi^k$ 上求值得到收缩面读数 $\beta'(v)$。因为偶次幂为正、奇次幂为负，几何级数把所有 $\beta'(v)$ 严格夹进闭收缩窗口 $[-\psi^2, -\psi]$（长度恰为 $1$），并且由此推出 $c(v_1, v_2) = \beta'(v_1) + \beta'(v_2) - \beta'(v_1 + v_2)$ 严格落在 $(-2, 2)$ 之间；再结合 `deficit_integer` 证明的整数性，唯一存活的整数只有 $-1, 0, 1$。完整证明已在 Lean 4 内核冻结于 [`deficit_three_valued`](lean:D5/S1/Deficit/DeficitThreeValued.deficit_three_valued)。
:::

你可以立刻在下面的 `deficit` 实验卡里拖动 $(v_1, v_2)$ 亲手验证：无论输入如何跳跃，收缩面上的三项组合始终被牢牢关在 $(-2, 2)$ 的栅栏内，只吐出 $-1, 0, 1$ 三个值。

::: {.viz src="fib-atom-observer" preset="deficit" height="500"}
**黄金进位三值亏量（`deficit`）。** 在 Zeckendorf 表示与收缩窗口 $[-\psi^2, -\psi]$ 上实时计算 $c(v_1, v_2)$，亲眼验证它始终落入 $\{-1, 0, 1\}$（见 [@thm-fib-deficit]）。
:::

## 前向嫁接词与模 $H$ 的精确仿射闭包

现在把目光从单个整数转向一棵不断生长的有序二叉树（Lean 中定义为自由广群 `Source := FreeMagma Bool`，其中 `true` 记作非膨胀叶 $\alpha$、`false` 记作膨胀叶 $\beta$）。令斐波那契叶替换规则作用于双字母表 $\{\alpha, \beta\}$：每一步把 $\alpha \mapsto \beta$、把 $\beta \mapsto \beta \cdot \alpha$。若一棵树当前含 $a$ 个 $\alpha$ 叶与 $b$ 个 $\beta$ 叶，一步替换将组成向量 $(a, b)$ 精确映射为 $\mathrm{step}(a, b) = (b, a + b)$——也就是由单模矩阵 $M = \begin{pmatrix} 0 & 1 \\ 1 & 1 \end{pmatrix}$ 驱动的演化，而观察者读出的标量总量为 $\mathrm{quantity}(a, b) = 2a + 3b$。

如果我们在演化过程中允许按布尔序列 $W$ 交替执行前向替换（`false`）与「嫁接（graft）」注入固定原子组成 $w$（`true`），模去任意正整数模数 $H$ 之后，所有可达边界状态构成怎样的集合？下面这条冻结定理（列出其核心代表结论；完整合取还涵盖全行为的标量最大公因数刻画、$H^2$ 态自治实现及原子块嫁接的 $H^2$ 状态数下界）给出了精确的仿射闭包刻画。

::: {.theorem #thm-fib-graft title="前向斐波那契嫁接词实现可观测平移理想（核心结论）" lean="D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result"}
在冻结定理 `GraftAffineClosure.result` 中，特别成立以下结论：

1. 对任意素数 $p$、自然数 $e \le h$ 与任意整数 $x, y \in \mathbb{Z}$，对**一切**整数平移参数 $b \in \mathbb{Z}$ 皆有 $\gcd(x + p^e b,\, p^h) = \gcd(y + p^e b,\, p^h)$，当且仅当分类不变量满足 $\psi(p, h, e, x) = \psi(p, h, e, y)$；
2. 对任意正整数 $H > 0$ 与基底向量 $w \in \mathbb{N} \times \mathbb{N}$，任意有限布尔嫁接词 $W$ 的前向作用均具有精确仿射形式 $\mathrm{run}(w, W, v) = \mathrm{step}^{[k]}(v) + t$，且平移项模 $H$ 落入嫁接子空间 $\mathrm{graftSpace}(H, w)$；
3. 模 $H$ 上演化算子满足周期恒等式 $\mathrm{step}^{[(H^2)!]}(v) = v$，并存在显式实现词 `realizationWord H k A B` 使所有 $(k, t \in \mathrm{graftSpace}(H, w))$ 均在模 $H$ 下精确可达；
4. 平移理想在标量可观测量 `quantity` 下的像恰好是由 $\mathrm{graftGcd}(H, w) = \gcd(\gcd(w_1, w_2), H)$ 在 $\mathbb{Z}/H\mathbb{Z}$ 中生成的主理想。
:::

::: proof
在 Lean 模块 [`GraftAffineClosure.result`](lean:D5/S3/Arith/FibonacciAtomic/GraftAffineClosure.result) 中，利用 `step` 在有限群 $(\mathbb{Z}/H\mathbb{Z})^2$ 上的置换周期整除 $(H^2)!$，显式构造出生成任意非负线性组合 $A \cdot \mathrm{step}^{[(H^2)!]}(w) + B \cdot \mathrm{step}(w)$ 的布尔嫁接词，再结合整数最大公因数恒等式锁定主理想刻画。完整证明由 Lean 4 内核验证并冻结。
:::

下面这张 `graft` 实验卡把 [@thm-fib-graft] 的抽象符号变成肉眼可见的模 $H$ 平移轨道：对 $(a, b) = (2, 1)$ 施加嫁接词后，你能直接看到 `step` 的旋转与 `graftSpace` 的平移如何精确闭合。

::: {.viz src="fib-atom-observer" preset="graft" height="500"}
**前向嫁接仿射作用（`graft`）。** 在模 $H = 5$ 平面上演示布尔嫁接词对 $(2, 1)$ 的前向演化 $\mathrm{step}^{[k]} v + t$，直观对应 [@thm-fib-graft] 的平移理想。
:::

## 外表完全一样，血统却彻底分离

至此，一切还显得非常规矩、甚至近乎透明。但下面这记重锤，才是 `FIB ATOM` 真正震撼物理直觉的地方——也是「有限边界观察者为什么注定存在盲区」的算术原型。

固定任意满足 $a + b \ge 1$ 的组成 $(a, b)$。所有具有完全相同叶子组成 $(a, b)$ 的有序二叉树构成一个有限集合，称为**源纤维（`Fiber (a, b)`）**。把同一条斐波那契替换规则反复作用 $n$ 代，你会同时看到两件截然相反的现象：

1. **在边界上，所有树完全不可区分**：无论你从纤维 `Fiber (a, b)` 里挑哪一棵树 $t$，经过 $n$ 代替换后，它的叶子组成永远严格等于 $\mathrm{step}^{[n]}(a, b)$，可观测总量也完全相等。只看边界计数的观察者，连一丝差别也测不出来。
2. **在血统空间里，推前分布却以惊人速度与自然均匀分布彻底分离**：从祖先纤维 `Fiber (a, b)` 经单射映射 `fiberMap (a, b) n` 推前到第 $n$ 代纤维 `Fiber (step^[n] (a, b))` 的均匀概率分布，与第 $n$ 代完整纤维上的均匀分布之间的全变差距离（total variation distance）有精确闭式，并在 $n \to \infty$ 时趋近于 **$1$（渐近奇异）**！

下面的静态图把 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 的前四代生长（自单枚 $\beta$ 叶出发，叶数依次为 $1, 2, 3, 5, 8$）与血统全变差曲线画在同一张图板上，一眼就能看穿为何仅仅一代之后，$(1, 1)$ 的全变差就一跃跳到精确的 $\frac{2}{3}$。

::: {.figure src="ch01-fib-substitution-tree"}
**斐波那契替换树与血统全变差分离曲线。** 左侧展示替换规则 $\alpha \mapsto \beta,\ \beta \mapsto \beta\alpha$ 自单枚 $\beta$ 叶出发的前四代树状展开（叶子数依次为 $1, 2, 3, 5, 8$）；右侧精确绘制初始组成 $(1, 1)$ 的血统推前全变差距离 $\mathrm{TV}(n) = 1 - |\mathrm{Fiber}(1,1)| / |\mathrm{Fiber}(\mathrm{step}^n(1,1))|$，在 $n = 1$ 处精确命中 $2/3$ 并迅速逼近 $1$（见 [@thm-fib-lineage]）。
:::

先看看同一纤维里「边界读数全等、内部树形各异」的静态截面 `boundary`：

::: {.viz src="fib-atom-observer" preset="boundary" height="500"}
**同边界不同树（`boundary`）。** 列出 `Fiber(2, 1)` 中多棵结构截然不同的有序源树：它们在边界上投射出完全一致的 $(2, 1)$ 组成与总量 $2 \cdot 2 + 3 \cdot 1 = 7$，令仅看边界的观察者完全无法分辨。
:::

现在把这一现象写成由 Lean 4 内核锁死的完整定理：

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

点击下面的 `lineage` 实验卡，亲眼看着全变差曲线从 $(1, 1)$ 的 $n = 0$ 出发，第一步精确踩上 $2/3$，几代之内便无限贴近 $1$ 的天花板：

::: {.viz src="fib-atom-observer" preset="lineage" height="500"}
**血统全变差趋近 1（`lineage`）。** 从 $(a, b) = (1, 1)$ 出发沿代数 $n$ 推进，验证 $n = 1$ 处精确取 $\mathrm{TV} = 2/3$ 并急速逼近渐近奇异极限 $1$（见 [@thm-fib-lineage]）。
:::

把这一章的三块积木拼在一起，你已经触碰到了 `trureturing` 整个世界观的第一层脉搏：**边界读数极度规整（亏量只有三值、嫁接形成仿射理想、组成确定演化），但边界之外潜伏着庞大的隐藏纤维。** 在下面的完整实验室 `FIB//OBSERVER` 里，你可以自由切换三个场景、调整 $(a, b)$ 与 $(v_1, v_2)$ 亲手试探每一条不变量。

::: {.viz src="fib-atom-observer" height="560"}
**完整实验室：`FIB//OBSERVER`。** 在嫁接仿射作用、血统纤维输运与黄金进位亏量三个场景之间自由切换，实时核算本章全部三条冻结 Lean 4 定理的精确算例。
:::

现在一个更尖锐的问题立刻浮出水面：既然有限观察者总有盲区，那么当我们不断证明新定理去缩小这个盲区时，怎么用冷酷的数学把「真正缩减盲区的新发现」和「把旧定理换套西装重说一遍的灌水」一刀劈开？下一章，我们进入**信息逃逸与不可逆真值图**。

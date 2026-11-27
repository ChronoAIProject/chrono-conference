# 第二章 同一块金子挖不了两次：信息逃逸与不可逆真值图

任何声称自己「自动证明了十几万条定理」的系统，首先必须挨一记最狠的质疑：**你怎么证明自己不是在原地绕圈、把同一条平凡结论换一万种变量名反复抄写来刷跑分？**

如果靠人工拍胸脯保证「我们绝不灌水」，那只是公关；如果靠一段模糊的打分器给「创新度」打 8.7 分，那只是自欺欺人。`trureturing` 的做法干脆得近乎残忍：**在数学侧，先把「什么是真正的新信息」（类比而言，同一块金子挖不了两次）做成有限集合上的严格定理并交由 Lean 4 内核冻结；在工程侧，再用独立的去重与账本审计去核查实际目录执行。**

## 联合核只缩不胀：逻辑棘轮的数学骨架

想象一个由若干可能世界构成的有限竞技场（`arena`），以及一份不断增长的定理目录（`catalog`）。每一条定理条目都能对任意一对状态 `(left, right)` 做出一致或不一致的分辨。给定当前选中的定理子集 `selected`，那些在 `selected` 里**所有**定理面前依然完全无法区分的状态对，组成了这套目录的**联合核（`jointKernel selected`）**——你可以把它直接想成「目前这套理论仍然看不清的盲区集合」。

现在向目录里多塞进一条定理，盲区会发生什么变化？下面两条短得像警句的冻结定理，构成了整个逻辑棘轮的单向棘爪：

::: {.theorem #thm-ie-antitone title="扩大定理目录只能收缩联合核" lean="D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone"}
对给定竞技场 `arena` 上的任意定理目录 `catalog`，若所选条目集合满足 `smaller ⊆ larger`，则它们的不可分辨联合核满足反向包含
$$
\mathrm{jointKernel}(\mathrm{larger}) \subseteq \mathrm{jointKernel}(\mathrm{smaller}).
$$
:::

::: proof
凡是在更大集合 `larger` 中全部定理上都一致的状态对，自然也在子集 `smaller` 的每一条定理上一致。由 Lean 4 内核在 [`jointKernel_antitone`](lean:D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_antitone) 中直接验证并冻结。
:::

::: {.theorem #thm-ie-insert title="插入一条定理等价于联合核取交" lean="D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_insert"}
向已选定理集合 `selected` 插入条目 `index` 后，新联合核严格等于旧联合核与 `index` 自身一致关系核的交集：
$$
\mathrm{jointKernel}(\mathrm{insert}(\mathrm{index}, \mathrm{selected}))
= \mathrm{jointKernel}(\mathrm{selected}) \cap \{(x, y) \mid \mathrm{agrees}(\mathrm{index}, x, y)\}.
$$
:::

::: proof
按全称量词对插入集合的展开，`pair` 在插入后的集合上处处一致，当且仅当它在 `selected` 上处处一致且在 `index` 上也一致。由 Lean 4 内核在 [`jointKernel_insert`](lean:D5/S3/ConceptDynamics/InformationEscape/CatalogKernel.jointKernel_insert) 中验证并冻结。
:::

先在下面的 `observatory` 实验卡里看看这套机械结构在 16 状态竞技场上的真实模样：初始三条定理把 16 个状态切成 4 个等价块，块内仍有 `24 / 120` 对相异状态彼此无法分辨（信息逃逸率 `0.20`）。

::: {.viz src="truth-dag-observatory" preset="observatory" height="500"}
**真值图全貌（`observatory`）。** 3 条基础定理将 16 个竞技场状态划为 4 个等价类，品红连线标出仍未分辨的 24 对逃逸状态（占全部 120 对相异状态对的 `20%`），直观体现 [@thm-ie-antitone] 与 [@thm-ie-insert] 的联合核结构。
:::

## 什么是真正的新定理？三条把灌水判死刑的定理

有了单调收缩的联合核，下一个问题直击要害：如果我往目录里加一条新定理 `T4`，什么时候它才算**真正降低了信息逃逸（`catalog.LowersEscape index`）**，而不是白占一行编号？

答案落在一个异常干净的对象上：**去掉 `index` 后其余定理生成的语义闭包（`semanticClosureWithout index`）**。在非退化竞技场（`arena.Nondegenerate`）上，只要 `index` 诱导的分辨核（`toKernel index`）落在留一语义闭包 `semanticClosureWithout index` 之外，就至少存在一对先前无法区分的状态被它一刀劈开，从而严格降低信息逃逸；反之，只要它能从其余定理恢复出来，哪怕证明写了一百页，对盲区的缩减也是零。

::: {.theorem #thm-ie-closure title="降低逃逸当且仅当落在留一语义闭包之外" lean="D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout"}
设竞技场 `arena` 非退化（`arena.Nondegenerate`）。目录条目 `index` 严格降低信息逃逸率（`catalog.LowersEscape index`），当且仅当它的分辨核不属于其余条目的语义闭包：
$$
\mathrm{LowersEscape}(\mathrm{index}) \iff \mathrm{toKernel}(\mathrm{index}) \notin \mathrm{semanticClosureWithout}(\mathrm{index}).
$$
:::

::: proof
在非退化竞技场上，降低逃逸率等价于 `uniqueCaptureCount index > 0`，也即存在一对相异状态，其余全部条目在它们上面一致而唯独 `index` 把它们分开；这恰好等价于 `index` 的核不在其余条目的语义闭包之内。由 Lean 4 内核在 [`lowersEscape_iff_not_mem_semanticClosureWithout`](lean:D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_iff_not_mem_semanticClosureWithout) 中验证并冻结。
:::

现在看看下面这张 `novel-cut` 实验卡：插入真正落在语义闭包之外的新定理 `T4`，4 个等价类立刻劈成 8 个，品红色逃逸状态对从 `24` 骤降到 `8`——这就是一记实打实的新发现。

::: {.viz src="truth-dag-observatory" preset="novel-cut" height="500"}
**严格新颖切割（`novel-cut`）。** 插入落在留一语义闭包之外的新定理 `T4` 后，联合核将 4 个等价类细化为 8 个，逃逸对数由 `24` 严格下降至 `8`（见 [@thm-ie-closure]）。
:::

反过来，如果有人试图把已有定理 `T1` 和 `T2` 的布尔组合包装成「新定理 `T5`」，或者干脆把 `T4` 换个马甲复制成同核双胞胎 `T6` 塞进目录，下面这两条冻结定理会立刻亮出冰冷的零分判决：

::: {.theorem #thm-ie-recoverable title="可恢复的定理不能降低信息逃逸" lean="D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_false_of_recoverable"}
若对任意状态对 `(left, right)`，目录中其余所有条目（`other ≠ index`）的一致性均能推出 `index` 的一致性，则 `index` 绝不降低信息逃逸：$\neg\,\mathrm{LowersEscape}(\mathrm{index})$。
:::

::: proof
可恢复性直接迫使 `uniqueCaptureCount index = 0`，从而移除 `index` 前后的逃逸分子全等，逃逸率无法严格减小。由 Lean 4 内核在 [`lowersEscape_false_of_recoverable`](lean:D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.lowersEscape_false_of_recoverable) 中验证并冻结。
:::

::: {.theorem #thm-ie-same-kernel title="同核的两条不同条目独占捕获皆为零" lean="D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.same_kernel_both_zero"}
若目录中两条不同条目 `first ≠ second` 对所有状态对诱导完全相同的一致关系（`sameKernel`），则两者的独占捕获数同时为零：
$$
\mathrm{uniqueCaptureCount}(\mathrm{first}) = 0 \;\land\; \mathrm{uniqueCaptureCount}(\mathrm{second}) = 0.
$$
:::

::: proof
因为 `first` 可由 `second` 恢复而 `second` 亦可由 `first` 恢复，双方各自在留一目录下均无任何独占分辨状态对。由 Lean 4 内核在 [`same_kernel_both_zero`](lean:D5/S3/ConceptDynamics/InformationEscape/StructuralNovelty.same_kernel_both_zero) 中验证并冻结。
:::

把这两种「零增益失败」和前面的「严格新颖切割」并排画成一张静图，就能一眼记住信息逃逸律的全部精髓：

::: {.figure src="ch02-information-escape-lattice"}
**联合核细化与零增益冗余对比图。** 左栏显示新颖切割把 16 状态竞技场的逃逸状态对由 `24` 压降至 `8`；右栏显示可恢复定理与同核双胞胎插入后等价类纹丝不动、独占捕获数严格为 `0`（见 [@thm-ie-recoverable] 与 [@thm-ie-same-kernel]）。
:::

你也可以分别点开 `redundant` 与 `freeze` 两张实验卡，亲眼验证插入 `T5` 后逃逸对纹丝不动停在 `8`，以及插入同核副本 `T6` 后 `T4` 与 `T6` 的独占捕获计数瞬间双双归零：

::: {.viz src="truth-dag-observatory" preset="redundant" height="500"}
**可恢复定理零降逃逸（`redundant`）。** 插入可由 `T1, T2` 推出的 `T5`，逃逸状态对数停留在 `8` 毫无缩减，`LowersEscape` 为假（见 [@thm-ie-recoverable]）。
:::

而当同核副本 `T6` 被选中时，原本由 `T4` 独占的分辨能力被立刻共享稀释，两条同核条目同时失去独占权：

::: {.viz src="truth-dag-observatory" preset="freeze" height="500"}
**同核双胞胎双零捕获（`freeze`）。** 插入与 `T4` 具有相同分辨核的 `T6` 后，`T4` 与 `T6` 的 `uniqueCaptureCount` 同步跌为 `0`（见 [@thm-ie-same-kernel]）。
:::

## 局部处处绿灯，全局却无解

在收束这一章之前，我们把第一卷第五章提过的那条「局部粘合障碍」也正式归入本卷的逻辑地基——因为它回答了与信息逃逸互为表里的另一半问题：**哪怕你在每对变量上都验证了局部相容，也绝不能推导出全局存在一致的真实状态。**

::: {.theorem #thm-gluing-obstruction title="两两相容的局部律可以不存在全局态" lean="D5/S3/ConceptDynamics/Gluing/LocalLawGluingObstruction.compatible_local_laws_can_lack_global_state"}
在布尔集 $\mathrm{Bool}$ 上定义两条局部关系 $\mathrm{sameLaw} = \{p \mid p_1 = p_2\}$ 与 $\mathrm{differentLaw} = \{p \mid p_1 \neq p_2\}$。则它们满足全部两两边缘相容条件，但不存在任何三元组 $(b_1, b_2, b_3) \in \mathrm{Bool}^3$ 同时满足 $(b_1, b_2) \in \mathrm{sameLaw}$、$(b_2, b_3) \in \mathrm{sameLaw}$ 且 $(b_1, b_3) \in \mathrm{differentLaw}$。
:::

::: proof
每条关系的两个坐标投影都是全集 $\mathrm{Bool}$，故边缘两两重合；但 $b_1 = b_2$ 与 $b_2 = b_3$ 推出 $b_1 = b_3$，与 $(b_1, b_3) \in \mathrm{differentLaw}$ 直接冲突。由 Lean 4 内核在 [`compatible_local_laws_can_lack_global_state`](lean:D5/S3/ConceptDynamics/Gluing/LocalLawGluingObstruction.compatible_local_laws_can_lack_global_state) 中验证并冻结。
:::

现在打开完整的 `TRUTH//DAG` 实验室，亲手点击 `T1` 至 `T6` 任意组合，把这五条信息逃逸定理在十六个状态组成的棋盘上逐一推演一遍。

::: {.viz src="truth-dag-observatory" height="560"}
**完整实验室：`TRUTH//DAG`。** 点击切换 6 条目录定理（4 条独立切割 + 1 条可恢复冗余 + 1 条同核双胞胎），实时核算 120 对相异状态中的逃逸对数、逃逸率与每条定理的独占捕获计数。
:::

看清了「有限观察者」与「不可逆真值图」之后，接下来要出场的是整个 `trureturing` 体系里最令人屏住呼吸的第三幕：**从极少的纯操作配平与倒易假设出发，为什么复数希尔伯特空间和三维欧氏旋转 $\mathfrak{so}(3)$ 竟然不是外加的公理，而是被逻辑硬生生「迫出来」的？** 第三章见。

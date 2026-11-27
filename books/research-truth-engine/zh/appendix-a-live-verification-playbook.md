# 附录 A 发布会现场五步核验剧本：从猜想到 Lean 内核

在 2026 年 12 月 17 日发布会第二幕（16:20–16:35 SGT），我们不要求任何一位观众「凭信任鼓掌」。本附录给出完整的**五步核验剧本**——无论你正在直播间观看，还是会后随时打开一台安装有 Git 与 `elan` 的笔记本电脑，都可以用下面完全相同的五步，把本书任意一条绿色内核结论独立重放到底。

## 五步现场点检（以 Fredkin 门反驳为例）

1. **第一步：选定一条带原始文献出处的具体命题。**
   例如第四章的 [@thm-fredkin-refutation]（反驳 Qiu–Song–Chen，*Phys. Rev. A* 2025 / `arXiv:2410.15253` 关于四量子比特 Fredkin 门跨越 `AD:BC` 切口纠缠产生上确界恰好等于 $2$ ebits 的猜想）。
2. **第二步：点击绿色 Lean 内核徽章或源码链接。**
   直达所钉提交 [{commit}](trureturing:) 下的精确文件 `D5/S3/Quantum/Entanglement/FredkinEntanglingPowerRefutation.lean` 与目标声明行号。
3. **第三步：核查形式陈述是否忠实于原猜想。**
   读完文件开头的 `def claim : Prop := entanglementGeneration = 2` 以及 `theorem result : ¬ claim`，确认没有任何偷换定义、隐藏特设假设或 `sorry`。
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

预期终端编译零错误，且 `#print axioms` 仅输出标准 Lean 公理（如 `propext`、`Classical.choice`、`Quot.sound`，不含 `sorryAx` 或自定义公理）。一旦这两项检查全部通过，这条结论就不再依赖 ChronoAI、不再依赖 The Omega Institute、也不再依赖任何一位作者的声誉——它只依赖 Lean 4 内核本身。

> **关于全书引用的三枚 `trureturing` 提交哈希**：正文统计表与本附录共出现三枚对应不同审计截面的上游提交——`e55900e` 为 2026-11-19 连续 720 小时提交节律统计快照，`05ceb90` 为 2026-11-20 冻结定理总量（`167,819`）与文献题解总账（`2,128`）快照，而本仓库 `trureturing.lock.json` 所钉的 [{commit}](trureturing:) 是 `dev` 分支上供书库解析全部 21 条定理源码行号与 `statement_id` 摘要的实测锚点；执行上述第五步重放时请以锁文件所钉提交为准。

## 全部 21 条冻结定理的声明索引

上述五步适用于本卷引用的**全部 21 条冻结定理**（涵盖 `FIB ATOM`、信息逃逸、三向配平律迫出复希尔伯特空间、紧致倒易律迫出三维空间、七条文献旗舰证明与反驳，以及黎曼猜想整系数 Hankel 等价判据）。下方的声明索引由构建系统直接从锁文件生成，提供每一条定理的精确文件与行号入口：

::: {.stats src="declarations" display="link" group="theorems" format="html"}
查看本卷全部 21 条冻结 Lean 4 定理声明索引
:::

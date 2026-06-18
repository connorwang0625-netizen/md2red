# 04 · 模版库（按内容形态）

> 模版按**内容形态**归类，与题材无关（guizang「风格与内容解耦」）。
> HE / WL / MB 等品类只是喂进系统的**语料**；同一个模版可承接任意品类，只要内容形态匹配。

## 1. 内容形态 → 模版 路由表

| 内容形态 | 识别信号 | 模版 | 源 recipe |
| --- | --- | --- | --- |
| 编号清单体 | 标题含「N 个 / N 种」；正文是并列条目，每条 = 标签 + 后果/利益 | **T-LEDGER** | M08 高账本 / S11 堆叠账本 |
| 步骤/流程体 | 「N 步 / 先…再…」；条目有先后顺序 | **T-STEP** | M14 流程 |
| 单点强论体 | 一个研究结论 / 头号秘诀撑全篇 | **T-FINDING** | M04 金句 / KPI 主视觉 |
| 对比/测评体 | 多项横向对比 / 打分（后续补） | T-MATRIX | S12 矩阵 / M15 前后对比 |

每个 deck 固定：**T-COVER 开场** + 正文若干（按形态选） + **T-CLOSE 收尾**。

## 2. 模版规格

字段：`id / name / from / role / fits / slots / density / skin`

### T-COVER · 封面（from M01）
- **role**：封面，定调 + 抛钩子
- **slots**：期号/章号 row → 大标题（2–4 行）→ 主图（35–55%）或纯字封面 → 底部 3–5 个看点 strip
- **density**：标题按 components 中文字数 band 取字号；底部 strip 不留空
- **skin**：card-base，可用蓝色大数字做点缀

### T-LEDGER · 编号清单（from M08 / S11）——正文主力
- **role**：承接编号清单体（占语料最高频）
- **fits**：HE-0001 6个晨间仪式、HE-0003 11种治愈坏心情的食物、WL-0001 越减越胖的5大原因
- **slots**：header（章号 + 小节标题）→ 4–6 条全宽行，每行 = 左 index（大数字/序号） + 右（标签 + 后果/说明 sub-line）
- **density**：每行 118–170px；≥4 行；不能只占中间三分之一；整页 ≥75% 吃满；禁 `flex:1` / `.spacer`，脚靠 `margin-top:auto`
- **skin**：蓝色大数字 + 点阵 dots + hairline 分隔行

### T-STEP · 步骤/流程（from M14）
- **role**：承接步骤/流程体
- **fits**：HE-0009 4步戒盐瘾、MB-0002 晨练流程
- **slots**：header → 3–5 步，每步 = 序号 + 动作 + 结果；步骤间有连接关系
- **density**：≥3 步；每步带结果说明，不能只剩动词

### T-FINDING · 单点强论（from M04 / KPI）
- **role**：一个研究结论 / 秘诀撑全篇
- **fits**：WL-0008 减肥头号秘诀、MB-0004 走路的意外副作用
- **slots**：顶 kicker/章号 → 大金句或大数字 → 来源行（18–22px mono，≤15% 底部） → 来源行上方 hairline
- **density**：唯一允许 ≤60% 留白的形态，但必须 3 锚点（顶 kicker + hairline + 来源行）；每套 deck ≤1–2 张

### T-CLOSE · 收尾（from M07）
- **role**：尾页收束
- **slots**：标题（≤2 行）→ ≥4 条 ledger 小结（标题 26–30 + sub 16–18，行 100–140px）→ 收尾块（金句/署名/CTA）
- **density**：禁「3 句短话收尾」= FAIL

## 3. 字号 / 密度下限（照搬 components，禁缩字）

- 最小可读：body 28 / lead 30 / caption·kicker 20 / cell title 24 / 数字注解 22
- 中文标题字数 band：1 行 ≤6 字 → 132 / 7–10 字 → 108 / 2 行 ≤8 字 → 96 / 2 行 9–12 字 → 84 / 3 行 → 72
- 任何段 > 216px = FAIL；不够吃满就加料或换 recipe，不靠留白

## 4. 示例输入（仅作语料，不是模版主题）

| 形态 | 示例文章 |
| --- | --- |
| 编号清单体 | HE-0001 / HE-0003 / WL-0001 / WL-0002 / WL-0003 |
| 步骤/流程体 | HE-0009 / MB-0002 |
| 单点强论体 | WL-0008 / MB-0004 / MB-0010 |
| 对比/测评体 | HE-0010（BMI vs 体脂率 vs 腰臀比） |

## 5. 跑通顺序

1. 先实现 **T-LEDGER**（最高频）
2. 拿 **HE-0001** 跑通 Extract → Classify → Route → Fill → Render
3. 再补 T-STEP / T-FINDING / T-CLOSE，最后 T-MATRIX

# 08 · 配方大菜单（Recipe Catalog）

> 本目录是纯文档。所有配方一律落到 8 个内容组件（`templates/components.css`）+ 主题轴，**绝不为每个配方新建 HTML**。组件结构见 `05-components.md`；拼装骨架见 `04-layouts.md`。

---

## 怎么用这张菜单

1. 判形态（`03-content-mapping.md`）→ 2. 查「这个意思该用哪个配方」→ 3. 配方 = 某个组件→ 4. 按 `04-layouts.md` 骨架填充。

一篇 deck = `cover ×1` + 正文配方 `×N` + `close ×1`。

**状态图例**：✅ 已有组件 · 🟡 二级变体待建 · 🚫 范围外（图片网格 / UI mock / WebGL）。

---

## A. Editorial Magazine 线 → md2red 映射

| guizang 配方 | 意思 / 何时用 | md2red 落点 | 状态 |
| --- | --- | --- | --- |
| **M01** Magazine Cover | 杂志封面 | `cover` | ✅ |
| **M03** Editorial Essay Split | 一个观点 + 2-3 段 | `data` 文字主导（`.pull` + `.how`）/ `finding` | ✅ |
| **M04** Pull Quote / Thesis | 一句核心结论撑页 | `finding`（`.quote`）| ✅ |
| **M05** Checklist | 可执行清单 | `check` | ✅ |
| **M07** Closing Note | 收尾 | `close` | ✅ |
| **M08** Tall Ledger | 编号清单·带后果 | `ledger` | ✅ |
| **M09** Atmospheric Thesis | 稀疏要点 + 氛围 | `finding`（降级，无 WebGL）| ✅ |
| **M13** Hero Question | 提问式整页 | `finding`（`.quote` 问句）| ✅ |
| **M14** Vertical Pipeline | 3-5 步流程 | `step` | ✅ |
| **M02/M06/M10** 图片类 | 实拍 / 多图 / 大截图 | — | 🚫 |
| **M11/M12/M15** | 边栏 / 分隔 / 前后对比 | 二级变体 | 🟡 待建 |

## B. Swiss International 线 → md2red 映射

| guizang 配方 | 意思 / 何时用 | md2red 落点 | 状态 |
| --- | --- | --- | --- |
| **S01** Accent Cover | 极简强调色封面 | `cover`（克制款）| ✅ |
| **S03** Data / File Card | 每条带数字/研究 | `data`（`.stat`）| ✅ |
| **S05** Trap / Warning Rows | 误区 / 「别这么做」| `ledger`（警示行）| ✅ |
| **S06** Pipeline | 工作流 / 分层 | `step` | ✅ |
| **S07** Takeaway Ledger | 收尾账本 | `close` / `ledger` | ✅ |
| **S09** Numbered Statement | 单个量化大数字 | `finding`（`.mega`）/ `data` | ✅ |
| **S11** Mini-Data | 小数据条目 | `data`（`.stat`）| ✅ |
| **S12** Matrix | 维度矩阵 | `matrix` | ✅ |
| **S04/S08** | UI mock / 21:9 主图 | — | 🚫 / 🟡 |
| **S10** 打分表 | 多项打分对照 | `matrix` 二级变体 | 🟡 待建 |

> **范围外（🚫）**：依赖「正文配图 / 截图 / UI mock」的配方超出当前「黑白文本健康卡」能力。唯一开口是主图封面（见 `10-image-cover.md`）。

---

## C. 每配方最小密度（3:4 不许欠填）

copy 喂不到下面这条线，就**换配方或缩画布**，绝不留白凑数。

| 配方 / 组件 | 最小内容集（够吃满 1080×1440）|
| --- | --- |
| `cover` | 话题 + 主标（≥1 行大字）+ 副文 1-2 句 + brandfoot |
| `ledger` | 导语 + ≥4 条 row（每条标签 + 后果，row ≥150px）|
| `check` | 导语 + ≥5 条 row（条目 + why）|
| `data` | topline + 承上句 + 一个 `.stat`（数字 + 机制）+ 怎么做；无数字→`.pull` 文字主导 + how（**来源不上卡**，见 07 §E）|
| `step` | 导语 + 3-5 步（每步动作 + 结果）|
| `finding` | 大字金句/`.mega` + 三锚点（顶 kicker + hairline + 说明行 `.cap`；**不印来源**）——唯一允许 <75% 的组件 |
| `matrix` | 导语 + 3 列 × ≥3 维 grid + `.pick` 结论 |
| `close` | ≤54px 收束标题 + 4-6 条 recap + 一个收束块 |

> ⚠️ **来源只用于抽取验证，不上卡面**（见 07 §A / §E）：正文卡不渲染 `.src` / `.src-line`。`finding` 的第三锚点用 `.cap` 说明行，不写出处。

---

## D. 3:4 填满与编号清单体例外

- 竖幅 1080×1440 默认要求填满（N10 ≥ 75%，`finding` 除外）。
- **编号清单体例外**：同一篇的编号清单（如「6 个晨间仪式」）应保持**单一配方家族**（统一用 `data`），唯一允许的变化是「有/无真实数字」：有数字→`.stat`；无数字→`.pull` 文字主导（不带 `.num`）。不得混入 `finding`/`ledger` 等异质组件（见 07 §E）。

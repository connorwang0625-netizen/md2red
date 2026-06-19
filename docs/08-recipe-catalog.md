# 08 · 配方大菜单（Recipe Catalog）

> 对齐 guizang `references/layout-recipes.md` 的**反单调价值**：给系统一张「可挑的配方清单」，每篇按语义点菜，避免每页同款。
> **但**：guizang 的 28 个配方本身也不是 28 个文件——它是「一份目录 + 2 个 seed 模板」。我们照此办理——
> 本目录是**纯文档**，所有配方一律落到既有 **8 个内容组件**（`templates/components.css`）+ 主题轴，**绝不为每个配方新建 HTML**。
> 组件结构见 `05-components.md`；拼装骨架见 `04-layouts.md`；选变体见 `04-templates.md`。

---

## 怎么用这张菜单

1. 判形态（`03-content-mapping.md`）→ 2. 来本表查「这个意思该用哪个配方」→ 3. 配方 = 某个组件（也许 + 二级变体）→ 4. 按 `04-layouts.md` 骨架填充。

一篇 deck = `cover ×1` + 正文配方 `×N`（**鼓励混用不同配方**）+ `close ×1`。同一形态在不同篇可挑不同配方——这就是「不固定死模版」。

**状态图例**：✅ 已有组件直接覆盖 · 🟡 二级变体待建（在现组件上加 modifier，不新建文件）· 🚫 范围外（图片网格 / UI mock / WebGL，超出「黑白文本健康卡」当前能力，除非另开主图能力，见 `10-image-cover.md`）。

---

## A. Editorial Magazine 线（杂志感 / 慢节奏）→ md2red 映射

| guizang 配方 | 意思 / 何时用 | md2red 落点 | 状态 |
| --- | --- | --- | --- |
| **M01** Magazine Cover | 杂志封面（图文分块）| `cover` 组件（文字封面）；要主图见 `10-image-cover.md` | ✅ |
| **M02** Field-Note Photo | 实拍照片作证据 | 图片证据页 | 🚫（无正文配图能力）|
| **M03** Editorial Essay Split | 一个观点 + 2-3 段 | `data` 文字主导（`.pull` + `.how`）/ `finding` | ✅ |
| **M04** Pull Quote / Thesis | 一句核心结论撑页 | `finding`（`.quote`，唯一允许留白）| ✅ |
| **M05** Checklist / 选购 | 可执行清单·无重后果 | `check` | ✅ |
| **M06** Evidence Wall | 多图网格 | — | 🚫 |
| **M07** Closing Note | 收尾 | `close`（≤54px 标题 + 4-6 recap + 一个收束块）| ✅ |
| **M08** Tall Ledger | 编号清单·每条带后果 | `ledger` | ✅ |
| **M09** Atmospheric Thesis | 稀疏要点 + 氛围背景 | `finding`（无 WebGL，靠大字 + 三锚点留白）| ✅（降级，无 WebGL）|
| **M10** Evidence Feature | 大截图 | 大图证据页 | 🚫 |
| **M11** Marginalia Essay | 正文 + 边栏注 | `data` + 边栏二级变体 | 🟡 待建 |
| **M12** Section Divider | 中段分隔喘息页 | `finding` 分隔二级变体（大章号 + 一句）| 🟡 待建 |
| **M13** Hero Question | 提问式整页 | `finding`（`.quote` 写成问句）| ✅ |
| **M14** Vertical Pipeline | 3-5 步流程 | `step` | ✅ |
| **M15** Before / After | 前后 / 新旧对比 | `matrix` 前后对比二级变体（上下两块）| 🟡 待建 |
| **M16** Image-Led Cover | 整屏主图封面 | `cover` + 主图能力，见 `10-image-cover.md` | 🟡 见 10 |

## B. Swiss International 线（工程感 / 量化节奏）→ md2red 映射

| guizang 配方 | 意思 / 何时用 | md2red 落点 | 状态 |
| --- | --- | --- | --- |
| **S01** Accent Cover | 极简强调色封面 | `cover`（克制款，B/D 主题）| ✅ |
| **S02** Two Signals | 两项对照 | `matrix`（2 列）/ `data` 双块 | ✅ |
| **S03** Data / File Card | 每条带数字/研究 | `data`（复用 `.stat`）| ✅ |
| **S04** Interface / Browser Mock | UI / 浏览器框 | — | 🚫 |
| **S05** Trap / Warning Rows | 误区 / 「别这么做」| `ledger`（警示行，`.csq` 写代价）| ✅（变体）|
| **S06** Pipeline / Architecture | 工作流 / 分层 | `step` | ✅ |
| **S07** Takeaway Ledger | 收尾账本 | `close` / `ledger` 收束 | ✅ |
| **S08** Image Hero | WeChat 21:9 主图 | 见 `10-image-cover.md`（WeChat 尺寸暂缓）| 🟡 见 10 |
| **S09** Numbered Statement / KPI | 单个量化大数字 | `finding`（`.mega`）/ `data`（`.stat`）| ✅ |
| **S10** 打分表 | 多项打分对照 | `matrix` 打分二级变体（`.pick` 给结论）| 🟡 待建 |
| **S11** Mini-Data | 小数据条目 | `data`（`.stat`）| ✅ |
| **S12** Matrix | 维度矩阵 | `matrix` | ✅ |

> **范围外（🚫）原则**：M02/M06/M10/S04/S08 都依赖「正文配图 / 截图 / UI mock」，超出当前「黑白文本健康卡」能力。**唯一开口**是主图封面（M16/S08 的封面用法），单独收到 `10-image-cover.md`，且只补「选图门槛 + 避脸 + 局部压图」。其余图片能力**不假装支持**——遇到时老实告诉用户「这套系统现在只做文本卡，配图证据页要另起能力」。

---

## C. 每配方最小密度（3:4 不许欠填）

照 guizang「Minimum density」精神：copy 喂不到下面这条线，就**换配方或缩画布**，绝不留白凑数。

| 配方 / 组件 | 最小内容集（够吃满 1080×1440）|
| --- | --- |
| `cover` | 话题 + 主标（≥1 行大字）+ 副文 1-2 句 + brandfoot |
| `ledger` | 导语 + **≥4 条** row（每条标签 + 后果，row ≥150px）|
| `check` | 导语 + **≥5 条** row（条目 + why）|
| `data` | topline + 承上句 + 一个 `.stat`（数字 + 机制 + 来源）+ 怎么做；无数字→`.pull` 文字主导 + how + 来源 |
| `step` | 导语 + **3-5 步**（每步动作 + 结果）|
| `finding` | 大字金句/`.mega` + **三锚点**（顶 kicker + hairline + 来源行）——唯一允许 <75% 的组件 |
| `matrix` | 导语 + 3 列 × ≥3 维 grid + `.pick` 结论 |
| `close` | ≤54px 收束标题 + **4-6 条** recap + 一个收束块（金句/CTA/旁注三选一）|

> ⚠️ guizang 反复点名的 **failure mode**：尾页只放 3 条短账本行（欠填 ~40%）。我们 `close` 强制 4-6 条；只有 3 条就把每条扩成「标题 + 后果 + 例子」或改 `finding`。

---

## D. 3:4 填满技法（guizang portrait-fill）

16:9 的版面塞进 3:4 常变成「中间一条薄表格 + 下半片空」。在**规划阶段**就解决。

### 竖向五区（1080×1440 心里分区）

| 区 | 典型高 | 角色 |
| --- | --- | --- |
| 页眉/元数据 | 56-90px | `.header`：编号 / 系列 / dots |
| 标题/导语 | 240-420px | 钩子 + 主张 |
| 证据/正文 | 520-760px | `.stat` / `ledger` / `matrix` / 大字 |
| 底部条 | 90-180px | 小结 / 来源 / 收束 |
| 页脚 | 52-86px | `.brandfoot` |

不是每页五区全有，但每页都要有**刻意的竖向构图**。

### 欠填气味（出现就改）

- 账本/表格只占 <45% 画布高。
- 下 25% 空着，又不是 `finding` 氛围页。
- 4 条清单挤成短行、下方一片空。
- 截图/数字本是证据却做得很小。
- 正文居中浮在画布中段，无上下节奏。

### 薄表格补救（按序试）

1. 加大行高到 118-170px（`ledger .row` 已 min 150px）。
2. 加左栏大序号 / 关键词（`ledger .idx`）。
3. 旁加一列金句/边注。
4. 加顶/底 issue 条（2-3 条后果）。
5. 换 `ledger` 重型账本。
6. 只有 2-3 点 → 改 `finding`，别硬做表。

### 稀疏文字补救

只有一句核心 → 走 `finding`：让这句当主角（`.quote`/`.mega`），配一行来源，保三锚点。**不要**缩成小段落浮中间。

### 页面节奏（一套 ≥5 种形状）

7 页一套至少用 **5 种不同形状**：封面 / 散文分栏 / 重型账本 / 数据证据 / 金句或单点 / 清单或对比 / 收尾。**`title + lead + 3 行` 这种结构一套里最多出现两次。**

> ⚠️ **例外 · 编号清单体（对等条目清单）**：此节奏只针对**异质长文**。若全篇是「N 个 X」的并列同类项（如晨间仪式 6 条），**反而要正文风格统一**——全篇用同一配方家族（`data` File Card），变化只来自每条「有无真实数字」（`data/stat` ↔ `data` 文字主导），**不插 `finding`/`step`/`matrix` 等异形页**，否则个别条目会「格格不入」。详见 `07-generation-contract.md` §E「混用 vs 一致」。

> 机器侧：4-band 密度由 `scripts/validate-deck.mjs` R5 自动查；手检照 `09-qa-checklist.md`。

# md2red 系统总览 (System)

> 我们买的是**系统**，不是成品。成品只是系统跑一遍的结果，不是系统的全貌。
> 系统 = **流程(主体)** + **模版库(资产)** + **皮肤(配色/个性化，小部分)**

---

## 一句话定义

输入一篇文章，系统自动：**提取关键信息 → 判断内容形态 → 匹配模版 → 填充 → 渲染成小红书图卡 (1080×1440)**。

## 三层分工

1. **流程层（主体）**：`Extract → Classify → Route → Fill → Render` 固定管线 + 每步规则（照搬 guizang）。这是真正买单的部分。
2. **模版库层（资产）**：一批可复用模版，系统从中挑选表达。**当前最缺，必须先建一批。**
3. **皮肤层（小部分）**：card-base 骨架 + mint/acid/maillard 主题 + 个性化（蓝色大数字 / 点阵 dots / 脚注）。只在渲染那一步生效。

---

## 管线 Pipeline 与数据契约

### ① 提取 Extract
- 输入：文章（md / 纯文本）
- 输出：**内容清单 content-spec**（结构化）
  - `article`: { title_raw, thesis(核心主张), platform }
  - `blocks[]`: { id, kind, index?(序号), head(主词), point(论点/功效), data?(数字+单位), source? }
- 规则：content-planning —— 压缩阶梯 / 动词+后果 / 去 AI 味 / 禁用词（超绝·神器·必吃…）

### ② 判型 Classify
- 输入：content-spec
- 输出：整篇 `shape` + 每块 `block.shape`
- 形态枚举（v0）：`编号清单 | 步骤流程 | 对比 | 数据 | 金句 | 观点`
- 原则：**内容形态决定版式**，由内容本身定，不先挑好看的

### ③ 选模版 Route 〔核心〕
- 输入：shape + block.shape
- 处理：查**路由表**（形态 → templateId）
- 输出：每屏 → 一个 templateId
- 前提：**模版库已有对应形态的模版**；没有则触发「新建模版」分支

### ④ 填充 Fill
- 把 content-spec 字段灌入模版槽位
- 约束：≥75% 吃满 / 字号 band / 标题压缩(title-shortener) / 不够 → 加料或换模版，**不靠留白**

### ⑤ 渲染 Render
- 套 card-base + 选主题 → HTML → 图片
- **配色 / 个性化只在这一步**

---

## 模版规格 Template schema

让每个模版都能被**路由、填充、批量生产**。每个模版声明：

- `id` / `name`
- `fits`：适配的 block.shape 或整篇 shape
- `role`：封面 | 正文 | 金句 | 收尾
- `slots`：槽位定义（对应 content-spec 字段）
- `density`：{ min_items, min_chars, max_chars }
- `skin`：card-base（与主题无关）

## 模版库现状

- 形态优先级：**编号清单体先行**（HE-0001/0002/0003 都是这型）
- 三层落地：① 皮肤 `templates/card-base.css` ② 组件 `templates/components.css`（8 组件：cover/ledger/check/data/step/finding/matrix/close）③ deck `decks/<slug>/index.html`
- 配方目录见 `docs/08-recipe-catalog.md`（guizang M/S 大菜单 → 8 组件映射，含🟡二级变体待建 / 🚫范围外）

---

## 能力边界（诚实回推）

> 系统的价值在于**在能做好的地方做好**，而不是什么都接。做不好就老实说，别硬凑。

- **不编造数据**：缺数据就标「示例数据 · 待核」/「占位 · 待核」，宁可留口子也不填假数字（N16）。
- **形态不匹配就回推**：内容是图片证据 / UI 截图 / 地图路线 / 复杂表格这类**超出当前 8 组件**的形态时，不要硬塞进 ledger/data 假装能做——直接说明「此形态暂不在范围内」，并指向 `08-recipe-catalog.md` 的🚫范围外清单。
- **塞不下就删，不缩字号**：违反 N8（≥22px）/ N10（≥75%）时，正确动作是精简文案或换更大容量的配方，不是缩字号、不是加装饰块凑密度。
- **冻结优先**：已冻结的页面（如 HE-0001 封面 @ `634b990`）不擅自改，要改先解冻并记录。
- **拿不准就问**：形态判定、是否新建二级变体、是否超范围——拿不准时先回推确认，不默默替用户做主。

## 不白手起家（复制 seed）

> guizang 的做法是**复制一个 seed deck 再改**，不是每次从空白页手搓。md2red 沿用。

- 新文章生产：从最接近的现成 deck（`decks/he-0001` / `decks/wl-0001`）复制一份，改 content，不重写骨架。
- 新组件/二级变体：从 `components-gallery.html` 里最近的组件起手，保留类名约定。
- 这样能天然继承尺寸、字阶、主题、脚注等全部纪律，避免重复踩 N1–N16。

---

## 下一步构建顺序

1. 定**模版统一规格**（本页 schema 落地为可填充结构）
2. 据此做**第一批模版**（编号清单体）
3. 写**提取 schema + 路由表**
4. 串起来跑 **HE-0001** 验证整条系统

> 回溯日志见 Notion 页「md2red · 流程与决策记录」。现有 docs/ 将逐步对齐到本系统总览之下。

# 01 · 结构与版式系统（配色无关）

> 这是三套配色共享的骨架。只要遵守本文，任何配色都能保持一致的排版纪律。
> 所有数值与已锁定的 `templates/card-base.html` 一致。控件级细节见 `05-components.md`；配色见 `02-palettes.md`。

---

## 画布 Canvas

| 项 | Token | 值 | 说明 |
| --- | --- | --- | --- |
| 尺寸宽 | `--canvas-w` | `1080px` | 3:4，小红书 / 公众号通用竖幅 |
| 尺寸高 | `--canvas-h` | `1440px` | 同上 |
| 边距 | `--margin` | `88px` | 四边统一内边距（`.pad`）|
| 细线 hairline | `--hair-w` | `2px` | 所有分隔线统一粗细 |
| 预览缩放 | `--s` | `0.42` | 仅画廊预览，**不影响导出分辨率** |

---

## 间距 token Spacing（8px 基准）

所有间距必须是 8 的倍数，保证垂直节奏统一。**不写裸 px。**

| token | 值 | 典型用途 |
| --- | --- | --- |
| `--s1` | 8px | 最小间隙 |
| `--s2` | 16px | 行内元素间距（`.stat` 内部 gap）|
| `--s3` | 24px | 页眉上下内边距、分隔线上内距 |
| `--s4` | 32px | 标题与正文间距 |
| `--s5` | 48px | 模块间距（最常用）|
| `--s6` | 64px | 大分区 |
| `--s7` | 96px | 超大分区 |
| `--s8` | 120px | 超大留白 |

---

## 字体栈 Font stacks

| 用途 | 栈 |
| --- | --- |
| 正文（body）| `"Helvetica Neue","PingFang SC",-apple-system,"Segoe UI","Noto Sans SC",Arial,sans-serif` |
| 等宽 `--font-mono` | `ui-monospace,"SF Mono","JetBrains Mono","Roboto Mono",Menlo,Consolas,monospace` |

等宽栈**仅用于封面主标里的数字 `.title .d`**，其余一律用主字体栈。

---

## 字阶 Type scale

| 角色 | Token / 来源 | 实际字号 | 字重 | 用在 |
| --- | --- | --- | --- | --- |
| 封面主标 | 写死于 `.cover .title` | **128px** | 250 | 封面主标题 |
| 封面数字 | `.title .d`（1.8em）| ≈230px | 400（C=500）| 主标里首个数字，等宽 |
| 正文序号 Index | `--t-index` | 128px | `--big-weight` | `.body .index` 大背景数字 |
| 数据数字 Num | `--t-num` | 150px | `--big-weight` | `.stat .num` |
| 尾页大标 | 写死于 `.end .h` | 72px | 250 | 尾页收尾句 |
| 正文标题 H1 | `--t-h1` | 60px | 500 | `.body h2` |
| 单位 em | 写死于 `.stat .num em` | 46px | 500（B=400）| 数据单位/百分号 |
| 导语/要点 Lead | `--t-lead` | 36px | 300 | `.cover .sub` / `.point` / `.cta` |
| 回顾行 | 写死于 `.recap .it` | 32px | 400 | 尾页回顾条 |
| 正文 Body | `--t-body` | 30px | 400 | 通用正文（预留）|
| 注解/品牌脚 Caption | `--t-cap` | 26px | 400（脚 500）| `.cap` / `.topic` / `.brandfoot` / `.recap .n` |
| 页眉编号 Eyebrow | `--t-eyebrow` | 25px | 600 | `.h-left`（letter-spacing .2em）|
| 出处/页码 Source | `--t-source` | 22px | 400 | `.src` / `.h-right`（**最小字号**）|

> `--t-display`（104px）是预留 token，当前模板未用；封面主标实际为 128px。

### 字重核心原则

- **字号越大，字重越细**。大标用细体制造留白与高级感；正文保持可读的中等字重。
- `--big-weight`：**B/D = 250，C = 600**（霾虹版为了发光视觉焦点，大字采用重体）。

---

## 统一页眉 Header

每一页（含封面/尾页）顶部都有一条页眉，下接 2px 细线，`margin-bottom:--s5`：

- **左：系列标识**（Eyebrow，如 `HE-0001 · 晨间仪式`），着锚点色。
- **右：进度 / 页码**。封面用「向右滑 →」，正文用进度点（当前页点为拉长锚点色方条），尾页用「回顾 · RECAP」。

---

## 卡片类型 Card types

（拼装细节 + HTML 骨架见 `04-layouts.md`）

1. **封面 `.cover`** — 页眉 + 话题 `.topic` + 主标 `.title`（128px）+ 副文 `.sub`（Lead，上接细线），底部 brandfoot。`.content` 用 `justify-content:flex-end` 让文字沉下半场。
2. **正文 `.body`** — 页眉 + 标题带（序号 chip + H2 + 导语，顶锚定、设 `min-height` 跨页等高）+ 焦点带（`.stat` / 填色面板，`min/max` 吸收内容多寡）+ 操作带 + brandfoot。**不用 `.spacer` / `flex:1` 贴底**；剩余留白收到底部有界画框（N11）。
3. **尾页 `.end`** — 页眉 + 收尾大标 `.h`（72px）+ 回顾列表 `.recap`（逐条序号）+ CTA + brandfoot。

---

## 品牌署名 Brandfoot

- `@津玉不良言` 固定在**每页右下角**，上接 2px 细线，`margin-top:auto` 置底（**不用 absolute**）。

---

## 质感原则 Rules

- **无圆角、无阴影**（C 霾虹版可用 `drop-shadow` 发光作为唯一例外）。
- **单一锚点色**：每套配色只用一个（或一组渐变）主锚点色做信任/重点，不滥用颜色。
- **一切对齐栅格**：元素起始/结束落在 88px 边距与 8px 节奏上。
- **一个要点 = 一张正文卡**：N 个要点生成 N 张正文，不堆叠。

> 完整硬规则与反模式见 `06-rules.md`。

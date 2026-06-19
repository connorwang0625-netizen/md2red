# md2red · 设计系统文档

把长文内容转换成微信公众号 / 小红书风格图文卡片的设计规范。核心是**三层模型**：皮肤一套、组件一批、deck 各自组合——同一套排版纪律下持续表现不同内容形态。

## 三层模型

1. **皮肤 SKIN** — `templates/card-base.css`：画布(1080×1440) / 字阶 / 间距 / 三主题(mint·acid·maillard) / 页眉脚注。
2. **组件 COMPONENTS** — `templates/components.css`：8 个内容组件 `cover · ledger · check · data · step · finding · matrix · close`。
3. **DECK** — `decks/<slug>/index.html`：一篇文章 = 皮肤 + 若干组件的组合。

## 目录

| 文档 | 内容 |
|---|---|
| [00-system.md](./00-system.md) | 系统总览：管线 / 数据契约 / 模版规格 / 能力边界 / 复制 seed |
| [01-design-system.md](./01-design-system.md) | 结构与版式系统（配色无关的骨架） |
| [02-palettes.md](./02-palettes.md) | 三套配色 token（清新薄荷 / 酸性霓虹 / 美拉德×莫兰迪） |
| [03-content-mapping.md](./03-content-mapping.md) | Markdown 内容 → 卡片映射 / 文案压缩法 / 封面钩子 |
| [04-layouts.md](./04-layouts.md) | 拼卡与版式（封面/正文/收尾的组合与行数上限） |
| [04-templates.md](./04-templates.md) | 模版库说明 |
| [05-components.md](./05-components.md) | 8 组件类名与槽位规范 |
| [06-rules.md](./06-rules.md) | 硬规则 N1–N16 / 反模式 / 身份测试 / 渲染态反例库 / 机器校验 |
| [07-generation-contract.md](./07-generation-contract.md) | 七步工作流 · 生成契约 · 冻结清单 |
| [08-recipe-catalog.md](./08-recipe-catalog.md) | guizang M/S 配方大菜单 → 8 组件映射（含🟡待建 / 🚫范围外） |
| [09-qa-checklist.md](./09-qa-checklist.md) | 完整交付 QA 清单 + R1–R7 ↔ 规则映射 |
| [10-image-cover.md](./10-image-cover.md) | 主图封面：选图门槛 / object-position / 压图避脸 / 蒙版 |

## 资产

- [`templates/card-base.css`](../templates/card-base.css) — 皮肤层（骨架 + 三主题）。
- [`templates/components.css`](../templates/components.css) — 组件层（8 个内容组件）。
- [`components-gallery.html`](../components-gallery.html) — 组件总览：一处预览全部组件 + 实时切主题。
- [`decks/he-0001/`](../decks/he-0001/) · [`decks/wl-0001/`](../decks/wl-0001/) — 样例 deck（复制起手用的 seed）。
- [`scripts/validate-deck.mjs`](../scripts/validate-deck.mjs) — 渲染态校验（R1–R7 + 主题纯度）。

## 来源

规则基于 [guizang social-card skill](https://github.com/op7418/guizang-social-card-skill) 的设计原则 + 「津玉不良言」文本风格生成。具体数值（字号/字重/间距/色值）为本项目实现时标定，可在迭代中调整。配方与缺口对齐进度见 `08-recipe-catalog.md`。

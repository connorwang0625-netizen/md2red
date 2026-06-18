# 04 · 布局配方（Layouts）

> 卡片不自由发挥，只从下面的配方里选 + 填内容。
> 每个配方 = 适用场景 + 结构 + 可直接抄的 HTML 骨架 + 密度/行数上限。
> 控件字号、token 见 `05-components.md`；配色见 `02-palettes.md`；内容→卡片映射见 `03-content-mapping.md`。

---

## 总则

- 一套图文 = **封面 1 张 + 弹性正文 N 张 + 尾页 1 张**。
- 所有卡同一个 `1080×1440` 画布、同一个 `.header` + `.brandfoot`。
- **密度下限**：每张卡内容（文字+数据）应占画布高 ≥ 75%。正文卡用 `.spacer`（`flex:1`）把 `.stat` 压到底部，避免中间一大条空白。
- **主题唯一**：一套图文只用一个主题（B/C/D 三选一），不混搭。

---

## L1 · 封面 Cover

**适用**：第一张，钩子。

**结构**：
- `.header`：左编号·系列（`.h-left`）+ 右「向右滑 →」。
- `.content`（`justify-content:flex-end`，文字沉下半场）：`.topic` 话题 → `.title` 主标 → `.sub` 导语。
- `.brandfoot`。

**规则**：
- 主标里的第一个数字包 `<span class="d">`（等宽放大）。手动换行用 `<br>`。
- 主标默认 `128px`；字多时靠换行，**不缩字号**。建议 ≤2 行。
- C 主题额外：显示 `.aura` 光晕 + `.ghost` 幽灵数字（右下出血，内容同主标首个数字）。CSS 已锁定，不要改。

```html
<div class="canvas cover">
  <div class="aura"></div>          <!-- 仅 C 主题显示 -->
  <div class="ghost">6</div>        <!-- 仅 C，= 主标首个数字 -->
  <div class="pad">
    <div class="header">
      <span class="h-left">HE-0001 · 晨间仪式</span>
      <span class="h-right">向右滑 →</span>
    </div>
    <div class="content">
      <div class="topic">健康饮食与生活方式</div>
      <div class="title">改变人生的<br><span class="d">6</span>个晨间仪式</div>
      <div class="sub">不靠意志力，靠系统。把早晨的前 60 分钟交给固定动作。</div>
    </div>
    <div class="brandfoot">@津玉不良言</div>
  </div>
</div>
```

---

## L2 · 正文 Body

**适用**：每个要点一张（N 个要点 = N 张正文卡）。

**结构**：
- `.header`：左编号·系列 + 右 `.dots` 进度点（当前页那个 `i` 加 `.on`）。
- `.index` 大序号 → `h2` 主标 → `.point` 要点。
- `.spacer` → （可选）`.stat` 数据块 → `.brandfoot`。

**规则**：
- 一张正文卡**最多一个 `.stat`**。有数据就放，没数据留空也行（`.spacer` 自动撑开）。
- `.stat .num` 里单位/百分号用 `<em>`（如 `10<em>% ↓</em>`）。
- **续卡**：一个要点太长拆两张时，第二张 `h2` 用上一张标题 + 「 ·续」，`.index` 编号不变。

```html
<div class="canvas body"><div class="pad">
  <div class="header">
    <span class="h-left">HE-0001 · 晨间仪式</span>
    <span class="h-right"><span class="dots">
      <i class="on"></i><i></i><i></i><i></i><i></i><i></i>
    </span></span>
  </div>
  <div class="index">01</div>
  <h2>醒来先喝一杯<br>300ml 温水</h2>
  <div class="point">一夜呼吸与排汗会流失约 0.5L 水分。先补水，再考虑咖啡因。</div>
  <div class="spacer"></div>
  <div class="stat">
    <div class="num">10<em>% ↓</em></div>
    <div class="cap">晨起轻度脱水状态下，认知与专注表现平均下降约一成。</div>
    <div class="src">示例数据 · 待核 / Journal of Nutrition</div>
  </div>
  <div class="brandfoot">@津玉不良言</div>
</div></div>
```

---

## L3 · 尾页 End

**适用**：最后一张，回顾 + 号召。

**结构**：
- `.header`：左编号·系列 + 右「回顾 · RECAP」。
- `.h` 收尾大标 → `.recap`（N 条，= 正文卡数）→ `.cta` 号召 → `.brandfoot`。

**规则**：
- `.recap .it` 数量 = 正文要点数。每条：`.n` 行号 + 一句极短回顾。
- `.cta` 里的重点词包 `<b>`。

```html
<div class="canvas end"><div class="pad">
  <div class="header">
    <span class="h-left">HE-0001 · 晨间仪式</span>
    <span class="h-right">回顾 · RECAP</span>
  </div>
  <div class="h">明早，<br>挑一个先开始。</div>
  <div class="recap">
    <div class="it"><span class="n">01</span>先喝 300ml 温水</div>
    <div class="it"><span class="n">02</span>晒 15 分钟晨光</div>
    <div class="it"><span class="n">03</span>早餐吃够 25g 蛋白</div>
    <div class="it"><span class="n">04</span>10 分钟唤醒身体</div>
    <div class="it"><span class="n">05</span>30 分钟不碰手机</div>
    <div class="it"><span class="n">06</span>写下今天 3 件要事</div>
  </div>
  <div class="cta">觉得有用，<b>收藏 + 关注</b>，明早照着做。</div>
  <div class="brandfoot">@津玉不良言</div>
</div></div>
```

---

## 行数 / 密度上限（防翻车）

| 位置 | 推荐 | 硬上限 | 超出怎么办 |
| --- | --- | --- | --- |
| 封面主标 `.title` | 2 行 | 3 行 | 先缩文案，不缩字号 |
| 正文 `.point` | 2–3 句 | 填满不溢出 | 拆续卡（`h2` + 「 ·续」）|
| 一张正文 `.stat` | 0–1 个 | 1 个 | 多出的数据另起一张 |
| 尾页 `.recap` | = 正文卡数 | 8 条 | 8+ 要点考虑拆两套图文 |

> 任何 >15% 画布高的纯空白都需要理由（封面留白、单句宣言）。正文卡用 `.spacer` 压底，不要让内容浮在中间。

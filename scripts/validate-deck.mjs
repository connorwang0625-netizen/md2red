#!/usr/bin/env node
/*
 * validate-deck.mjs — md2red 渲染态校验
 *
 *   node scripts/validate-deck.mjs <deck目录|index.html>
 *
 * 逐张 <div class="canvas"> 校验，规则编号对齐 docs/09-qa-checklist.md / 06-rules.md。
 * 任一 FAIL 退出码 1；WARN 仅提示。类名以 templates/components.css + card-base.css 为准。
 *
 * 规则：
 *   R1  溢出            scrollHeight > clientHeight（N1 撑满不溢出）
 *   R2  页脚碰撞        .brandfoot 为 position:absolute，且上方内容顶进其带（N5）
 *   R3  封面主标字重    .cover .title 计算字重 ≠ 250（N6：大字越大越细）
 *   R4  最小字号        叶文字节点 < 22px（N8）
 *   R5  4-band 密度     3:4 下填充 <75% 或任一欠填带 >216px（N10；finding 页豁免）
 *   R6  标题行数        .cover .title >3 行 或 .close .h >2 行（04-layouts 上限）
 *   R7  数据页焦点      一个 .data 内 >1 个 .stat（N12：一页一焦点）
 * 另：主题纯度—— body 必须恰好一个 theme-* 类（N13）。
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";

const target = process.argv[2];
if (!target) {
  console.error("usage: node scripts/validate-deck.mjs <deck目录|index.html>");
  process.exit(2);
}
const abs = path.resolve(target);
let htmlPath = abs;
if (fs.existsSync(abs) && fs.statSync(abs).isDirectory()) htmlPath = path.join(abs, "index.html");
if (!fs.existsSync(htmlPath)) {
  console.error(`找不到: ${htmlPath}`);
  process.exit(2);
}

const MIN_FONT = 22;        // N8
const COVER_TITLE_WEIGHT = 250; // N6
const LINE_CAP = { cover: 3, close: 2 }; // 04-layouts

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1200, height: 1600 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto("file://" + htmlPath, { waitUntil: "networkidle" });
// 中和预览缩放（.canvas 默认 transform:scale(--s)），让几何按真实 1080×1440 测量。
await page.addStyleTag({ content: ".canvas{transform:none !important;}" });
await page.waitForTimeout(400);

const report = [];

// 主题纯度（全局一次）
const themePurity = await page.evaluate(() => {
  const t = [...document.body.classList].filter(c => c.startsWith("theme-"));
  return { count: t.length, themes: t };
});

const canvases = await page.$$(".canvas");
for (const c of canvases) {
  const meta = await c.evaluate(el => {
    const lbl = el.parentElement?.querySelector?.(".label")?.textContent?.trim() || "";
    const isCover = el.classList.contains("cover");
    return {
      id: lbl || (isCover ? "cover" : "(canvas)"),
      isCover,
      hasFinding: !!el.querySelector(".finding"),
      clientH: el.clientHeight,
      scrollH: el.scrollHeight,
      clientW: el.clientWidth,
    };
  });
  const fails = [];
  const warns = [];

  // R1 溢出
  const overflow = meta.scrollH - meta.clientH;
  if (overflow > 4) fails.push({ rule: "R1", msg: `溢出 ${overflow}px（scrollH ${meta.scrollH} > clientH ${meta.clientH}）`, fix: "删内容或换更大容量的配方，不缩字号" });

  // R2 页脚碰撞
  const footIssue = await c.evaluate(el => {
    const foot = el.querySelector(".brandfoot");
    if (!foot) return null;
    if (getComputedStyle(foot).position !== "absolute") return null;
    const footTop = foot.offsetTop;
    const er = el.getBoundingClientRect();
    let worst = 0, sel = "";
    for (const n of el.querySelectorAll("*")) {
      if (n === foot || foot.contains(n)) continue;
      let hasText = false;
      for (const k of n.childNodes) if (k.nodeType === 3 && k.textContent.trim()) hasText = true;
      if (!hasText) continue;
      const bottom = n.getBoundingClientRect().bottom - er.top;
      if (bottom > footTop + 2 && bottom - footTop > worst) {
        worst = bottom - footTop;
        sel = "." + (n.className || n.tagName.toLowerCase());
      }
    }
    return worst > 6 ? { overlap: Math.round(worst), sel } : null;
  });
  if (footIssue) fails.push({ rule: "R2", msg: `.brandfoot 是 position:absolute，${footIssue.sel} 顶过页脚 ${footIssue.overlap}px`, fix: "页脚改 margin-top:auto 钉底（禁 absolute，见 06-rules 反例 C）" });

  // R3 封面主标字重
  if (meta.isCover) {
    const w = await c.evaluate(el => {
      const t = el.querySelector(".title");
      return t ? parseInt(getComputedStyle(t).fontWeight, 10) : null;
    });
    if (w !== null && w !== COVER_TITLE_WEIGHT)
      fails.push({ rule: "R3", msg: `.cover .title 字重 ${w}（应恒 ${COVER_TITLE_WEIGHT}）`, fix: "不要 inline 改字重；封面主标三主题恒 250（N6）" });
  }

  // R4 最小字号
  const small = await c.evaluate((el, MIN) => {
    const out = [];
    for (const n of el.querySelectorAll("*")) {
      if (n.children.length > 0) continue; // 只看叶节点
      const txt = n.textContent.trim();
      if (!txt) continue;
      const size = parseFloat(getComputedStyle(n).fontSize);
      if (size > 0 && size < MIN) out.push({ size: Math.round(size), text: txt.slice(0, 24) });
    }
    return out;
  }, MIN_FONT);
  for (const t of small) warns.push({ rule: "R4", msg: `“${t.text}” ${t.size}px < ${MIN_FONT}px 下限`, fix: "删文案，不缩字号（N8）" });

  // R5 4-band 密度（finding 页豁免）
  if (!meta.hasFinding) {
    const bands = await c.evaluate(el => {
      const er = el.getBoundingClientRect();
      const H = el.clientHeight;
      const rows = new Uint8Array(H);
      for (const n of el.querySelectorAll("*")) {
        const r = n.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        const cs = getComputedStyle(n);
        let hasText = false;
        for (const k of n.childNodes) if (k.nodeType === 3 && k.textContent.trim()) hasText = true;
        const isImg = n.tagName === "IMG" || n.tagName === "CANVAS" || n.tagName === "SVG" || (cs.backgroundImage && cs.backgroundImage !== "none");
        const isRule = n.tagName === "HR" || (parseFloat(cs.borderTopWidth) >= 1 && r.height < 4);
        const fill = cs.backgroundColor && cs.backgroundColor !== "transparent" && !/rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0?\s*\)/.test(cs.backgroundColor);
        if (!hasText && !isImg && !isRule && !fill) continue;
        const top = Math.max(0, Math.floor(r.top - er.top));
        const bot = Math.min(H, Math.ceil(r.bottom - er.top));
        for (let y = top; y < bot; y++) rows[y] = 1;
      }
      const BAND = H / 4, occ = [0, 0, 0, 0];
      for (let i = 0; i < 4; i++) {
        let cnt = 0; const a = Math.floor(i * BAND), b = Math.floor((i + 1) * BAND);
        for (let y = a; y < b; y++) cnt += rows[y];
        occ[i] = cnt / (b - a);
      }
      return occ;
    });
    const total = bands.reduce((a, b) => a + b, 0) / 4;
    const pct = o => Math.round(o * 100) + "%";
    if (total < 0.745) fails.push({ rule: "R5", msg: `密度 ${pct(total)}（各带 ${bands.map(pct).join(" / ")}）`, fix: "扩 copy 或换配方（见 08-recipe-catalog D / 09-qa C），不缩画布不加装饰块" });
    for (let i = 0; i < 3; i++) if (bands[i] < 0.15 && bands[i + 1] < 0.15) {
      warns.push({ rule: "R5", msg: `带 ${i + 1}+${i + 2} 同时欠填（${pct(bands[i])} / ${pct(bands[i + 1])}）——中部 >25% 空洞`, fix: "扩正文或加边栏" }); break;
    }
  }

  // R6 标题行数
  const titleLines = await c.evaluate(el => {
    const out = [];
    const probe = (sel, kind) => {
      const n = el.querySelector(sel);
      if (!n) return;
      const cs = getComputedStyle(n);
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      out.push({ kind, lines: Math.round(n.getBoundingClientRect().height / lh), text: n.textContent.trim().slice(0, 24) });
    };
    if (el.classList.contains("cover")) probe(".title", "cover");
    probe(".close .h", "close");
    return out;
  });
  for (const t of titleLines) {
    const cap = LINE_CAP[t.kind];
    if (cap && t.lines > cap) fails.push({ rule: "R6", msg: `${t.kind} 标题“${t.text}” 渲出 ${t.lines} 行（上限 ${cap}）`, fix: "精简文案，不缩字号" });
  }

  // R7 数据页焦点
  const statOver = await c.evaluate(el => {
    let worst = 0;
    for (const d of el.querySelectorAll(".data")) worst = Math.max(worst, d.querySelectorAll(".stat").length);
    return worst;
  });
  if (statOver > 1) fails.push({ rule: "R7", msg: `一个 .data 页有 ${statOver} 个 .stat`, fix: "一页最多一个 .stat，多出的另起一页（N12）" });

  report.push({ meta, fails, warns });
}

await browser.close();

let totalFail = 0, totalWarn = 0;
if (themePurity.count !== 1) {
  totalFail++;
  console.log(`[FAIL] 主题纯度：body 有 ${themePurity.count} 个 theme-* 类（${themePurity.themes.join(", ") || "无"}），应恰好 1 个（N13）`);
}

const lines = [];
lines.push("==== validate-deck (md2red) ====");
lines.push(`target: ${path.relative(process.cwd(), htmlPath)}`);
const clean = report.filter(r => !r.fails.length && !r.warns.length).length;
for (const { fails, warns } of report) { totalFail += fails.length; totalWarn += warns.length; }
lines.push(`canvases: ${report.length} · ${clean} clean · ${totalFail} fail · ${totalWarn} warn`);
lines.push("");
const fixSeen = new Set();
for (const { meta, fails, warns } of report) {
  if (!fails.length && !warns.length) { lines.push(`[PASS]  ${meta.id}`); continue; }
  lines.push(`${fails.length ? "[FAIL]" : "[WARN]"}  ${meta.id}`);
  for (const v of [...fails, ...warns]) {
    lines.push(`  ${fails.includes(v) ? "FAIL" : "WARN"} · ${v.rule}  ${v.msg}`);
    if (!fixSeen.has(v.rule)) { lines.push(`        fix: ${v.fix}`); fixSeen.add(v.rule); }
  }
}
lines.push("");
lines.push("R1 溢出 · R2 页脚碰撞 · R3 封面字重 · R4 最小字号 · R5 4-band 密度 · R6 标题行数 · R7 数据页焦点");
lines.push("FAIL 退出码 1；WARN 仅提示。");
console.log(lines.join("\n"));
process.exit(totalFail > 0 ? 1 : 0);

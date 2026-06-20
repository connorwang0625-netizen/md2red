(function () {
  const CARD = { w: 1080, h: 1440 }; // 固定 3:4 竖版

  const SAMPLE = `# 少吃一口糖\n你的身体会谢谢你\n\n> 真正的自律，不是和食物对抗，而是重新认识它。\n\n## 三个温柔的开始\n\n- 把含糖饮料换成**气泡水 + 柠檬**\n- 主食里掺一半**糙米与豆类**\n- 嘴馋时先喝一杯水，==等十分钟==\n\n---\n\n## 为什么有效\n\n血糖平稳了，*情绪和精力*也会跟着稳。\n\n1. 减少胰岛素的剧烈波动\n2. 延长饱腹感，自然少吃\n3. 让味觉慢慢变得敏锐\n\n> 改变不必剧烈，坚持才会发光。`;

  const $ = (id) => document.getElementById(id);
  const input = $("input");
  const card = $("card");
  const frame = $("frame");
  const stage = $("stage");
  const counter = $("counter");

  let pages = [];
  let index = 0;

  function splitPages(md) {
    const parts = md.split(/^\s*---\s*$/m).map((s) => s.trim()).filter(Boolean);
    return parts.length ? parts : [""];
  }

  function setSize() {
    card.style.setProperty("--card-w", CARD.w + "px");
    card.style.setProperty("--card-h", CARD.h + "px");
  }

  function fit() {
    const pad = 48;
    const availW = stage.clientWidth - pad;
    const availH = stage.clientHeight - pad;
    const scale = Math.min(availW / CARD.w, availH / CARD.h, 1);
    card.style.transform = `scale(${scale})`;
    frame.style.width = CARD.w * scale + "px";
    frame.style.height = CARD.h * scale + "px";
  }

  function escapeAttr(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function renderPage(i) {
    const total = pages.length;
    index = Math.max(0, Math.min(i, total - 1));
    setSize();
    card.setAttribute("data-theme", $("theme").value);

    const eyebrow = $("eyebrow").value.trim();
    const brand = $("brand").value.trim();
    const no = String(index + 1).padStart(2, "0");
    const tot = String(total).padStart(2, "0");

    card.innerHTML =
      (eyebrow ? `<div class="card-eyebrow">${escapeAttr(eyebrow)}</div>` : "") +
      `<div class="card-body">${window.mdToHtml(pages[index])}</div>` +
      `<div class="card-foot"><span>${escapeAttr(brand)}</span><span class="page-no">${no} / ${tot}</span></div>`;

    counter.textContent = `${no} / ${tot}`;
    fit();
  }

  function rebuild(keepIndex) {
    pages = splitPages(input.value);
    renderPage(keepIndex ? index : 0);
  }

  async function capture() {
    await (document.fonts ? document.fonts.ready : Promise.resolve());
    const prev = card.style.transform;
    card.style.transform = "none";
    const canvas = await html2canvas(card, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
      logging: false,
    });
    card.style.transform = prev;
    fit();
    return canvas;
  }

  function download(canvas, name) {
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function exportOne() {
    const canvas = await capture();
    download(canvas, `xhs-${String(index + 1).padStart(2, "0")}.png`);
  }

  async function exportAll() {
    const total = pages.length;
    const start = index;
    for (let i = 0; i < total; i++) {
      renderPage(i);
      await new Promise((r) => setTimeout(r, 80));
      const canvas = await capture();
      download(canvas, `xhs-${String(i + 1).padStart(2, "0")}.png`);
      await new Promise((r) => setTimeout(r, 200));
    }
    renderPage(start);
  }

  input.addEventListener("input", () => rebuild(true));
  $("theme").addEventListener("change", () => renderPage(index));
  $("eyebrow").addEventListener("input", () => renderPage(index));
  $("brand").addEventListener("input", () => renderPage(index));
  $("prev").addEventListener("click", () => renderPage(index - 1));
  $("next").addEventListener("click", () => renderPage(index + 1));
  $("exportOne").addEventListener("click", exportOne);
  $("exportAll").addEventListener("click", exportAll);
  $("loadSample").addEventListener("click", () => { input.value = SAMPLE; rebuild(false); });
  window.addEventListener("resize", fit);

  input.value = SAMPLE;
  rebuild(false);
})();

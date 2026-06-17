/* md2red · Markdown → 卡片渲染器 */
(function(){
  var md = window.markdownit({ html:false, linkify:true, typographer:false });

  var DEFAULT_MD = [
    '---','palette: B','id: DEMO-0001','account: 玉时桂','category: 示例',
    'title: 示例·打开 content/ 里的 md','cover_title: 这是内置示例，点选择 .md 看真内容','num: 2','num_label: 个示例卡',
    'hook: 双击 index.html 打开时会显示本示例；用「选择 .md」载入 content/HE-0001.md 看正式效果。',
    'closing: 写完 md，点导出。','cta: 开始你的第一篇。','---','',
    '## 示例卡 A','@key 示例 A','@num 12|min · 这里是标签说明',
    '**为什么** 这里写一两句论据。','**怎么做** 这里写一两句可执行动作。','> 出处 示例来源','',
    '---','','## 示例卡 B','@key 示例 B','@num 效果 ×3 · 可不带单位',
    '**为什么** 另一条论据。','**怎么做** 另一个动作。','> 出处 示例来源'
  ].join('\n');

  var deck = document.getElementById('deck');
  var warnBox = document.getElementById('warnings');
  var statusEl = document.getElementById('status');

  function parse(src){
    var meta = {}, body = String(src).replace(/\r\n/g,'\n');
    var fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
    if(fm){ try{ meta = jsyaml.load(fm[1]) || {}; }catch(e){ meta = {}; } body = body.slice(fm[0].length); }
    var blocks = body.split(/\n-{3,}[ \t]*\n/).map(function(s){return s.trim();}).filter(Boolean);
    var cards = blocks.map(parseCard).filter(function(c){ return c.title || c.num || c.why || c.how; });
    return { meta:meta, cards:cards };
  }

  function parseCard(block){
    var c = {};
    block.split('\n').forEach(function(raw){
      var line = raw.trim();
      if(line.indexOf('## ')===0) c.title = line.slice(3).trim();
      else if(line.indexOf('@key ')===0) c.key = line.slice(5).trim();
      else if(line.indexOf('@num ')===0) c.num = line.slice(5).trim();
      else if(/^\*\*为什么\*\*/.test(line)) c.why = line.replace(/^\*\*为什么\*\*[:：]?\s*/,'');
      else if(/^\*\*怎么做\*\*/.test(line)) c.how = line.replace(/^\*\*怎么做\*\*[:：]?\s*/,'');
      else if(line.indexOf('>')===0) c.source = line.replace(/^>\s*/,'').replace(/^出处\s*/,'').trim();
    });
    return c;
  }

  function splitNum(s){
    if(!s) return { big:'', unit:'', label:'' };
    var parts = s.split('·');
    var valuePart = (parts[0]||'').trim();
    var label = (parts[1]||'').trim();
    var vu = valuePart.split('|');
    return { big:(vu[0]||'').trim(), unit:(vu[1]||'').trim(), label:label };
  }

  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function el(tag,cls,html){ var e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }
  function keyOf(c){ return c.key || c.title || ''; }
  function brkComma(s){ return esc(s).replace('，','，<br>').replace(',',',<br>'); }

  function tonicEl(extra, palette){ var t=el('div','tonic'+(extra?(' '+extra):'')); t.dataset.palette=palette; t.dataset.style='swiss'; return t; }
  function stage(t){ var s=el('div','stage'); s.appendChild(t); return s; }

  function cover(meta, cards, palette){
    var t = tonicEl('cover', palette);
    t.appendChild(el('h1','statement', brkComma(meta.cover_title || meta.title || '')));
    var hero = el('div','cover-hero');
    hero.appendChild(el('div','cover-num', esc(meta.num!=null ? meta.num : cards.length)));
    hero.appendChild(el('div','cover-num-zh', esc(meta.num_label || meta.category || '')));
    t.appendChild(hero);
    var bottom = el('div','cover-bottom');
    bottom.appendChild(el('p','cover-lead', md.renderInline(meta.hook || '')));
    bottom.appendChild(el('div','cover-meta', [meta.id, meta.category, meta.account].filter(Boolean).join(' · ')));
    t.appendChild(bottom);
    return t;
  }

  function bodyCard(c, i, n, palette){
    var t = tonicEl('', palette);
    var loc = el('div','locator');
    loc.appendChild(el('span', null, 'Ritual ' + pad(i+1) + ' / ' + pad(n)));
    loc.appendChild(el('span', null, esc(keyOf(c))));
    t.appendChild(loc);
    t.appendChild(el('h2','h-xl body-title', esc(c.title || '')));
    var num = splitNum(c.num);
    var stat = el('div','stat');
    stat.appendChild(el('div','num-mega', esc(num.big) + (num.unit ? ('<span class="u">'+esc(num.unit)+'</span>') : '')));
    if(num.label) stat.appendChild(el('div','stat-label', esc(num.label)));
    t.appendChild(stat);
    if(c.why){ var bw=el('div','block'); bw.appendChild(el('div','b-lbl','Why · 为什么')); bw.appendChild(el('div','b-txt', md.renderInline(c.why))); t.appendChild(bw); }
    if(c.how){ var bh=el('div','block sep'); bh.appendChild(el('div','b-lbl','How · 怎么做')); bh.appendChild(el('div','b-txt', md.renderInline(c.how))); t.appendChild(bh); }
    var foot=el('div','foot'); foot.appendChild(el('span',null,'Source')); foot.appendChild(el('span',null, esc(c.source || ''))); t.appendChild(foot);
    return t;
  }

  function tail(meta, cards, palette){
    var t = tonicEl('', palette);
    var loc=el('div','locator'); loc.appendChild(el('span',null,'Closing')); loc.appendChild(el('span',null,'明早开始')); t.appendChild(loc);
    t.appendChild(el('h2','h-xl body-title', esc(meta.tail_title || '不用全做，先挑一件')));
    var led=el('div','ledger');
    cards.forEach(function(c,i){
      var num=splitNum(c.num);
      var val=(num.big + (num.unit ? (' '+num.unit) : '')).trim();
      var row=el('div','led-row');
      row.appendChild(el('span','led-no', pad(i+1)));
      row.appendChild(el('span','led-key', esc(keyOf(c))));
      row.appendChild(el('span','led-val', esc(val)));
      led.appendChild(row);
    });
    t.appendChild(led);
    if(meta.closing || meta.cta){
      t.appendChild(el('p','closing', esc(meta.closing || '') + (meta.cta ? ('<br><span class="ac">'+esc(meta.cta)+'</span>') : '')));
    }
    var foot=el('div','foot'); foot.appendChild(el('span',null,[meta.id,'Eat This'].filter(Boolean).join(' · '))); foot.appendChild(el('span',null, meta.account ? ('@'+meta.account) : '')); t.appendChild(foot);
    return t;
  }

  function pad(n){ return String(n).length<2 ? '0'+n : String(n); }

  function lint(meta, cards){
    var w=[];
    if(!meta.title) w.push('缺 frontmatter：title');
    if(!meta.cover_title && !meta.title) w.push('缺封面标题：cover_title');
    if(!meta.hook) w.push('缺封面钩子：hook');
    if(cards.length<1) w.push('没解析到正文卡：用 --- 分隔，每张以 ## 开头。');
    if(cards.length>8) w.push('正文 '+cards.length+' 张，超过 8 张（轮播含封面+尾页建议 ≤ 8）。');
    cards.forEach(function(c,i){
      var n=i+1;
      if((c.title||'').length>14) w.push('正文 '+n+'「'+c.title+'」标题偏长（>14 字）。');
      if(c.why && c.why.length>80) w.push('正文 '+n+' 的「为什么」偏长（'+c.why.length+'字），会变字墙。');
      if(c.how && c.how.length>80) w.push('正文 '+n+' 的「怎么做」偏长（'+c.how.length+'字）。');
      if(!c.num) w.push('正文 '+n+'「'+(c.title||'')+'」缺 @num 数据锚。');
      if(!c.source) w.push('正文 '+n+'「'+(c.title||'')+'」缺 > 出处。');
    });
    warnBox.innerHTML = w.map(function(x){ return '<div class="warn">'+esc(x)+'</div>'; }).join('');
  }

  function render(src){
    var r = parse(src);
    var palette = r.meta.palette || 'B';
    deck.innerHTML='';
    deck.appendChild(stage(cover(r.meta, r.cards, palette)));
    r.cards.forEach(function(c,i){ deck.appendChild(stage(bodyCard(c,i,r.cards.length,palette))); });
    deck.appendChild(stage(tail(r.meta, r.cards, palette)));
    lint(r.meta, r.cards);
    statusEl.textContent = (r.meta.id||'') + '  封面 1 · 正文 ' + r.cards.length + ' · 尾页 1';
  }

  function loadFile(f){ if(!f) return; var rd=new FileReader(); rd.onload=function(){ render(rd.result); }; rd.readAsText(f,'utf-8'); }
  document.getElementById('file').addEventListener('change', function(e){ loadFile(e.target.files[0]); });
  document.getElementById('export').addEventListener('click', function(){ window.print(); });
  ['dragover','dragenter'].forEach(function(ev){ document.body.addEventListener(ev, function(e){ e.preventDefault(); document.body.classList.add('drag'); }); });
  ['dragleave','drop'].forEach(function(ev){ document.body.addEventListener(ev, function(e){ e.preventDefault(); document.body.classList.remove('drag'); }); });
  document.body.addEventListener('drop', function(e){ if(e.dataTransfer.files && e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]); });

  fetch('content/HE-0001.md').then(function(r){ if(!r.ok) throw 0; return r.text(); }).then(function(t){ render(t); }).catch(function(){ render(DEFAULT_MD); });
})();

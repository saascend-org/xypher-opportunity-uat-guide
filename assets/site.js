
/* Everything here is an ENHANCEMENT. With JS off the page still reads completely:
   the gate checker shows every stage's requirements, the example tabs become stacked
   sections, and the checklist is plain checkboxes. Nothing load-bearing lives in here. */
document.documentElement.classList.remove('no-js');
document.documentElement.classList.add('js-on');

/* ── screenshot lightbox ─────────────────────────────────────────────── */
(function(){
  var lb=document.getElementById('lb'); if(!lb) return;
  var img=lb.querySelector('img');
  document.querySelectorAll('figure img').forEach(function(el){
    el.setAttribute('tabindex','0'); el.setAttribute('role','button');
    el.setAttribute('aria-label','Enlarge screenshot');
    function open(){ img.src=el.src; img.alt=el.alt; lb.classList.add('open'); lb.focus(); }
    el.addEventListener('click',open);
    el.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); }});
  });
  function close(){ lb.classList.remove('open'); img.src=''; }
  lb.addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
})();

/* ── gate checker: pick a stage, tick what you have, see what is missing ── */
(function(){
  var root=document.getElementById('checker'); if(!root) return;
  var sel=root.querySelector('select'), out=root.querySelector('.verdict'),
      list=root.querySelector('.reqs'), groups=root.querySelectorAll('[data-stage]');
  function render(){
    var stage=sel.value, shown=null;
    groups.forEach(function(g){
      var on = g.getAttribute('data-stage')===stage;
      g.hidden = !on; if(on) shown=g;
    });
    tally(shown);
  }
  function tally(g){
    if(!g){ out.textContent=''; return; }
    var boxes=[].slice.call(g.querySelectorAll('input[type=checkbox]'));
    var done=boxes.filter(function(b){return b.checked;}).length;
    boxes.forEach(function(b){ b.closest('li').classList.toggle('done', b.checked); });
    var left=boxes.length-done;
    out.className='verdict '+(left===0?'ok':'no');
    out.textContent = left===0
      ? 'Nothing missing — this deal can move'
      : left+' still missing of '+boxes.length;
  }
  sel.addEventListener('change',render);
  list.addEventListener('change',function(e){
    if(e.target.type==='checkbox') tally(e.target.closest('[data-stage]'));
  });
  var reset=root.querySelector('.reset');
  if(reset) reset.addEventListener('click',function(){
    root.querySelectorAll('input[type=checkbox]').forEach(function(b){b.checked=false;});
    render();
  });
  render();
})();

/* ── worked-example tabs ─────────────────────────────────────────────── */
(function(){
  var wrap=document.getElementById('examples'); if(!wrap) return;
  var btns=[].slice.call(wrap.querySelectorAll('.tabs button')),
      panes=[].slice.call(wrap.querySelectorAll('.ex'));
  function show(id){
    panes.forEach(function(p){ p.hidden = p.id!==id; });
    btns.forEach(function(b){ b.setAttribute('aria-selected', String(b.dataset.for===id)); });
  }
  btns.forEach(function(b){
    b.addEventListener('click',function(){ show(b.dataset.for); });
    b.addEventListener('keydown',function(e){
      var i=btns.indexOf(b);
      if(e.key==='ArrowRight'){ e.preventDefault(); btns[(i+1)%btns.length].focus(); btns[(i+1)%btns.length].click(); }
      if(e.key==='ArrowLeft'){ e.preventDefault(); var j=(i-1+btns.length)%btns.length; btns[j].focus(); btns[j].click(); }
    });
  });
  if(panes.length) show(panes[0].id);
})();

/* ── rebuild checklist, progress kept in this browser ────────────────── */
(function(){
  var box=document.getElementById('rebuild-check'); if(!box) return;
  var KEY='xypher-rebuild-v1';
  var boxes=[].slice.call(box.querySelectorAll('input[type=checkbox]'));
  var bar=box.querySelector('.bar i'), lbl=box.querySelector('.count');
  var saved={};
  try{ saved=JSON.parse(localStorage.getItem(KEY)||'{}'); }catch(e){}
  boxes.forEach(function(b){ if(saved[b.id]) b.checked=true; });
  function paint(){
    var done=boxes.filter(function(b){return b.checked;}).length;
    if(bar) bar.style.width=(boxes.length? (done/boxes.length*100):0)+'%';
    if(lbl) lbl.textContent=done+' of '+boxes.length+' done';
    boxes.forEach(function(b){ b.closest('li').classList.toggle('done', b.checked); });
  }
  box.addEventListener('change',function(e){
    if(e.target.type!=='checkbox') return;
    var st={}; boxes.forEach(function(b){ if(b.checked) st[b.id]=1; });
    try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){}
    paint();
  });
  var clr=box.querySelector('.reset');
  if(clr) clr.addEventListener('click',function(){
    boxes.forEach(function(b){ b.checked=false; });
    try{ localStorage.removeItem(KEY); }catch(e){}
    paint();
  });
  paint();
})();

/* ── copy buttons ────────────────────────────────────────────────────── */
(function(){
  document.querySelectorAll('.copy button').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.parentElement.querySelector('code').textContent;
      navigator.clipboard.writeText(t).then(function(){
        var old=b.textContent; b.textContent='Copied';
        setTimeout(function(){ b.textContent=old; },1400);
      }).catch(function(){ b.textContent='Press Ctrl+C'; });
    });
  });
})();

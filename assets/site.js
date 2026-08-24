
// Click any screenshot to see it full size. Keyboard-accessible; Escape closes.
(function(){
  var lb=document.getElementById('lb'), img=lb&&lb.querySelector('img');
  if(!lb) return;
  document.querySelectorAll('figure img').forEach(function(el){
    el.setAttribute('tabindex','0');
    el.setAttribute('role','button');
    el.setAttribute('aria-label','Enlarge screenshot');
    function open(){ img.src=el.src; img.alt=el.alt; lb.classList.add('open'); lb.focus(); }
    el.addEventListener('click',open);
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){e.preventDefault();open();} });
  });
  function close(){ lb.classList.remove('open'); img.src=''; }
  lb.addEventListener('click',close);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') close(); });
})();

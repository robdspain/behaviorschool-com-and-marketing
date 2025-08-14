(function(){
  try{
    const anchors = document.querySelectorAll('a[href^="#"]');
    for(const a of anchors){
      a.addEventListener('click',function(e){
        const id = this.getAttribute('href');
        if(!id || id === '#') return;
        const el = document.querySelector(id);
        if(!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', id);
      });
    }
  }catch(err){ /* no-op */ }
})();
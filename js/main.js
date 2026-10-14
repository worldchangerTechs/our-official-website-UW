(function(){
  'use strict'
  var prefersReducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches
  var prefersReducedData=navigator.connection&&navigator.connection.saveData
  function createObserver(options={rootMargin:'0px 0px -50px 0px'}){
    return new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(!entry.isIntersecting) return
        if(prefersReducedMotion){entry.target.style.transition='none'}
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      })
    },options)
  }
  var observer=createObserver()
  document.querySelectorAll('.reveal').forEach(function(el){
    observer.observe(el)
  })
  var counters=document.querySelectorAll('.counter')
  if(!prefersReducedData){
    counters.forEach(function(counter){
      var target=parseInt(counter.getAttribute('data-target')||'0')
      var duration=parseInt(counter.getAttribute('data-duration')||'2000')
      var start=Date.now()
      function update(){
        var elapsed=Date.now()-start
        var progress=Math.min(elapsed/duration,1)
        var easeOut=1-Math.pow(1-progress,3)
        var current=Math.floor(progress*target)
        counter.textContent=current+(target!==parseInt(counter.textContent.replace('/',''))?'':'')
        if(progress<1) requestAnimationFrame(update)
      }
      if(prefersReducedMotion){
        counters.forEach(function(c){c.textContent=c.getAttribute('data-target')||'0'})
      }else{
        requestAnimationFrame(update)
      }
    })
  }
  document.addEventListener('DOMContentLoaded',function(){
    var links=document.querySelectorAll('a[href*="."]:not([target="_blank"])')
    function prefetch(link){
      if(!link.href||link.host!==location.host) return
      if(prefersReducedData) return
      var rel=link.getAttribute('data-prefetched')
      if(rel) return
      link.setAttribute('data-prefetched','true')
      link.style.transition='opacity 0.1s'
      link.style.opacity='0.99'
      var req=new Request(link.href,{credentials:'same-origin'})
      fetch(req,{mode:'cors'})
    }
    links.forEach(function(link){
      link.addEventListener('mouseover',function(e){
        prefetch(link)
      })
      link.addEventListener('touchstart',function(e){
        e.preventDefault()
        prefetch(link)
      })
    })
  })
})()
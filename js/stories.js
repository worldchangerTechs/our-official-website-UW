(function(){
  'use strict'
  document.addEventListener('DOMContentLoaded',function(){
    var storyCards=document.querySelectorAll('.story-card')
    if(!storyCards.length) return
    var reducedMotion=window.matchMedia('(prefers-reduced-motion:reduce)').matches
    var reducedData=navigator.connection&&navigator.connection.saveData
    function createObserver(rootMargin){
      return new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(!entry.isIntersecting) return
          entry.target.classList.add('revealed')
          observer.unobserve(entry.target)
        })
      },{rootMargin:rootMargin||'0px 0px -50px 0px'}
    }
    var observer=createObserver()
    storyCards.forEach(function(el){observer.observe(el)})
    if(!reducedMotion&&!reducedData){
      storyCards.forEach(function(card){
        var delay=Array.from(storyCards).indexOf(card)*150
        card.style.transitionDelay=delay+'ms'
      })
    }
  })
})()
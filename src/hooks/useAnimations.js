import { useEffect, useRef } from 'react'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const reducedData = () => navigator.connection?.saveData === true

function useAnimeReveal(selector, options = {}) {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current || reducedMotion() || reducedData()) return undefined
    const elements = [...root.current.querySelectorAll(selector)]
    if (!elements.length) return undefined
    let animations = []
    let mounted = true
    const observer = new IntersectionObserver(async entries => {
      const visible = entries.filter(entry => entry.isIntersecting)
      if (!visible.length) return
      observer.disconnect()
      const { animate, stagger } = await import('animejs')
      if (!mounted) return
      animations = visible.map(({ target }, index) => animate(target, {
        opacity: [0, 1],
        translateY: [options.distance ?? 22, 0],
        duration: options.duration ?? 650,
        delay: options.stagger ? stagger(options.stagger)(index) : 0,
        ease: 'outExpo',
      }))
    }, { rootMargin: '0px 0px -48px 0px', threshold: 0.05 })
    for (const element of elements) {
      element.style.opacity = '0'
      observer.observe(element)
    }
    return () => {
      mounted = false
      observer.disconnect()
      animations.forEach(animation => animation.revert())
      elements.forEach(element => { element.style.opacity = '' })
    }
  }, [selector, options.distance, options.duration, options.stagger])
  return root
}

export function useReveal(options) {
  return useAnimeReveal('[data-reveal]', options)
}

export function useStagger(options = {}) {
  return useAnimeReveal('[data-stagger]', { ...options, stagger: options.stagger ?? 80 })
}

export function useParallax() {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current || reducedMotion() || reducedData()) return undefined
    let animation
    let mounted = true
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting) || animation) return
      const { animate } = await import('animejs')
      if (mounted && root.current) {
        animation = animate(root.current, {
          translateY: ['-2%', '2%'],
          duration: 1200,
          ease: 'inOutSine',
          alternate: true,
          loop: true,
        })
      }
    }, { threshold: 0.1 })
    observer.observe(root.current)
    return () => {
      mounted = false
      observer.disconnect()
      animation?.revert()
    }
  }, [])
  return root
}

export function useCountUp(value, suffix = '') {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current) return undefined
    const element = root.current
    const target = Number(value)
    if (!Number.isFinite(target) || reducedMotion() || reducedData()) {
      element.textContent = `${target}${suffix}`
      return undefined
    }
    let animation
    let mounted = true
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      const { animate } = await import('animejs')
      if (!mounted) return
      const count = { value: 0 }
      animation = animate(count, {
        value: target,
        duration: 750,
        ease: 'outExpo',
        onUpdate: () => { element.textContent = `${Math.round(count.value)}${suffix}` },
      })
    }, { threshold: 0.25 })
    observer.observe(element)
    return () => {
      mounted = false
      observer.disconnect()
      animation?.revert()
    }
  }, [value, suffix])
  return root
}

export function useHeroAnimation() {
  const root = useRef(null)
  useEffect(() => {
    if (!root.current || reducedMotion() || reducedData()) return undefined
    let animations = []
    let mounted = true
    const observer = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting)) return
      observer.disconnect()
      const { animate, stagger } = await import('animejs')
      if (!mounted || !root.current) return
      animations = [
        animate(root.current.querySelectorAll('[data-hero-text]'), {
          opacity: [0, 1], translateY: [20, 0], delay: stagger(80), duration: 650, ease: 'outExpo',
        }),
        animate(root.current.querySelectorAll('[data-hero-photo]'), {
          opacity: [0, 1], scale: [0.94, 1], delay: stagger(110, { start: 120 }), duration: 750, ease: 'outExpo',
        }),
        animate(root.current.querySelectorAll('[data-float]'), {
          translateY: [-5, 5], duration: 1700, ease: 'inOutSine', alternate: true, loop: true,
        }),
      ]
    }, { threshold: 0.01 })
    observer.observe(root.current)
    return () => {
      mounted = false
      observer.disconnect()
      animations.forEach(animation => animation.revert())
    }
  }, [])
  return root
}

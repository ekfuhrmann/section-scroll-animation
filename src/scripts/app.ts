import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimatedElement extends Element {
  dataset?: DOMStringMap
  timeline?: gsap.core.Timeline
}

const mm = gsap.matchMedia()

export const mmFilters = {
  isDesktop: '(min-width: 768px)',
  isMobile: '(max-width: 767.98px)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
}

mm.add(mmFilters, (context) => {
  let { isMobile, reduceMotion } = context.conditions ?? {}

  if (isMobile || reduceMotion) return

  const bgColors = [
    'hsla(156, 98%, 26%, 1)',
    'hsla(15, 25%, 48%, 1)',
    'hsla(196, 100%, 34%, 1)',
    'hsla(292, 53%, 43%, 1)',
    'hsla(216, 66%, 27%, 1)',
  ]

  const bgTimeline = gsap.timeline()

  bgColors.forEach((value) => {
    bgTimeline.to('[data-animate="background"]', {
      backgroundColor: value,
    })
  })

  ScrollTrigger.create({
    animation: bgTimeline,
    trigger: '[data-animate="background"]',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
  })

  gsap.set('[data-animate]', { opacity: 0 })

  ScrollTrigger.batch('[data-animate]', {
    onEnter: (batch) => {
      batch.forEach((el: AnimatedElement, i: number) => {
        setAnimation(el, i)
      })
    },
    onEnterBack: (batch) => {
      batch.forEach((el: AnimatedElement, i: number) => {
        setAnimation(el, i, -1)
      })
    },
    onLeave: (batch) => {
      batch.forEach((el: AnimatedElement) => {
        // kill the timeline when leaving the viewport
        el.timeline?.kill()

        gsap.to(el.querySelector('img'), { opacity: 0 })
      })
    },
    onLeaveBack: (batch) => {
      batch.forEach((el: AnimatedElement) => {
        // kill the timeline when leaving the viewport
        el.timeline?.kill()

        gsap.to(el.querySelector('img'), { opacity: 0 })
      })
    },
  })

  function setAnimation(
    el: AnimatedElement,
    index: number = 0,
    direction?: -1 | 1,
  ) {
    direction = direction || 1

    const y = `${150 * direction}dvh`

    const tl = gsap.timeline()
    const animationStagger = 0.25

    const initialY = gsap.getProperty(el, 'y')

    tl.set(el, { opacity: 1 })

    tl.fromTo(
      el.querySelector('img'),
      { opacity: 0 },
      {
        opacity: 1,
        delay: index * animationStagger,
        duration: 1,
      },
    ).fromTo(
      el.querySelector('img'),
      { y },
      {
        y: initialY,
        delay: index * animationStagger,
        ease: 'circ.out',
        duration: 0.75,
      },
      0,
    )

    // store the timeline on the element
    el.timeline = tl
  }
})

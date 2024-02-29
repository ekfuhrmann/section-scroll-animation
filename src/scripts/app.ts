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

        gsap.to(el, { opacity: 0 })
      })
    },
    onLeaveBack: (batch) => {
      batch.forEach((el: AnimatedElement) => {
        // kill the timeline when leaving the viewport
        el.timeline?.kill()

        gsap.to(el, { opacity: 0 })
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
      { opacity: 0, y },
      {
        opacity: 1,
        y: initialY,
        delay: index * animationStagger,
        ease: 'circ.out',
        duration: 1,
      },
    )

    // store the timeline on the element
    el.timeline = tl
  }
})

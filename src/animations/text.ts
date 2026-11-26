import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(SplitText, ScrollTrigger)

export function revealHeading(
  el: HTMLElement,
  tl: gsap.core.Timeline,
  position = '<'
): void {
  const split = new SplitText(el, { type: 'chars,words' })

  gsap.set(split.chars, {
    y: '110%',
    opacity: 0,
    rotationZ: 6,
    transformOrigin: 'left bottom',
  })

  tl.to(
    split.chars,
    {
      y: '0%',
      opacity: 1,
      rotationZ: 0,
      duration: 1.2,
      ease: 'power4.out',
      stagger: 0.03,
    },
    position
  )
}

export function revealLines(
  el: HTMLElement,
  scrollTriggerVars: ScrollTrigger.Vars
): SplitText {
  const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' })

  // Wrap each line in a clip container
  split.lines.forEach((line) => {
    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'overflow: hidden; display: block;'
    line.parentNode?.insertBefore(wrapper, line)
    wrapper.appendChild(line)
  })

  gsap.set(split.lines, { y: '100%', opacity: 0 })

  gsap.to(split.lines, {
    y: '0%',
    opacity: 1,
    duration: 1.0,
    ease: 'power4.out',
    stagger: 0.1,
    scrollTrigger: scrollTriggerVars,
  })

  return split
}

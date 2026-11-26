import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import styles from './About.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bioRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const headline = headlineRef.current
    const bio = bioRef.current
    if (!section || !headline || !bio) return

    const ctx = gsap.context(() => {
      // Headline reveal
      const headlineSplit = new SplitText(headline, { type: 'chars,words' })
      gsap.set(headlineSplit.chars, {
        y: '110%',
        opacity: 0,
        rotationZ: 4,
        transformOrigin: 'left bottom',
      })

      ScrollTrigger.create({
        trigger: headline,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(headlineSplit.chars, {
            y: '0%',
            opacity: 1,
            rotationZ: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: 0.02,
          })
        },
        once: true,
      })

      // Bio paragraphs reveal
      const paras = bio.querySelectorAll('p')
      paras.forEach((p) => {
        const split = new SplitText(p, { type: 'lines', linesClass: 'bio-line' })

        const wrappers = split.lines.map((line) => {
          const wrapper = document.createElement('div')
          wrapper.style.cssText = 'overflow: hidden; display: block;'
          line.parentNode?.insertBefore(wrapper, line)
          wrapper.appendChild(line)
          return wrapper
        })

        gsap.set(split.lines, { y: '100%' })

        ScrollTrigger.create({
          trigger: p,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(split.lines, {
              y: '0%',
              duration: 1.0,
              ease: 'power4.out',
              stagger: 0.08,
            })
          },
          once: true,
        })

        return () => {
          wrappers.forEach((w) => {
            const child = w.firstChild
            if (child) w.parentNode?.insertBefore(child, w)
            w.remove()
          })
        }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.about} data-section="about">
      <div className={styles.parallaxBg} aria-hidden="true" />

      <div className={styles.grid}>
        <span className={styles.rotatedLabel} aria-hidden="true">
          About
        </span>

        <div className={styles.rightCol}>
          <h2 ref={headlineRef} className={styles.headline}>
            MORE THAN
            <br />
            JUST CODE.
          </h2>

          <div className={styles.divider} />

          <div ref={bioRef} className={styles.bio}>
            <p>
              I&apos;m Shahzod, a Full-Stack Developer focused on building meaningful digital
              products.
            </p>
            <p>
              My journey started with frontend development, where I learned how to turn ideas into
              intuitive interfaces. Over time, I expanded into backend engineering, system
              architecture, API integrations, and automation.
            </p>
            <p>
              I enjoy exploring the intersection of engineering, design, and emerging technologies.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

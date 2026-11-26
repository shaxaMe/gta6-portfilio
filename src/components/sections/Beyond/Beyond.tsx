import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import styles from './Beyond.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const INTERESTS = [
  { label: 'AI & Machine Learning' },
  { label: 'RAG Systems' },
  { label: 'Distributed Systems' },
  { label: 'Automation' },
  { label: 'Financial Technology' },
  { label: 'Software Architecture' },
  { label: 'Creative Coding' },
  { label: 'Open Source' },
]

export default function Beyond() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const headline = headlineRef.current
    const list = listRef.current
    if (!section || !headline || !list) return

    const ctx = gsap.context(() => {
      const split = new SplitText(headline, { type: 'chars,words' })
      gsap.set(split.chars, {
        y: '110%',
        opacity: 0,
        rotationZ: 4,
        transformOrigin: 'left bottom',
      })

      ScrollTrigger.create({
        trigger: headline,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(split.chars, {
            y: '0%',
            opacity: 1,
            rotationZ: 0,
            duration: 1.0,
            ease: 'power4.out',
            stagger: 0.02,
          })
        },
        once: true,
      })

      const items = list.querySelectorAll<HTMLElement>(`.${styles.item}`)
      gsap.set(items, { opacity: 0, x: -16 })

      ScrollTrigger.create({
        trigger: list,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(items, {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.06,
          })
        },
        once: true,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.beyond} data-section="beyond">
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.sectionLabel}>05 — Interests</p>

        <h2 ref={headlineRef} className={styles.headline}>
          STILL<br />EXPLORING.
        </h2>

        <div ref={listRef} className={styles.list}>
          {INTERESTS.map((item, i) => (
            <div key={item.label} className={styles.item}>
              <span className={styles.itemNumber}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.itemLabel}>{item.label}</span>
              <div className={styles.itemLine} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

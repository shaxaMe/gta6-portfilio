import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '@/data/journey'
import styles from './Journey.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const chapters = section.querySelectorAll<HTMLElement>(`.${styles.chapter}`)

      chapters.forEach((chapter) => {
        const year = chapter.querySelector<HTMLElement>(`.${styles.chapterYear}`)
        const content = chapter.querySelector<HTMLElement>(`.${styles.chapterContent}`)
        const accentLine = chapter.querySelector<HTMLElement>(`.${styles.accentLine}`)

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: chapter,
            start: 'top 78%',
            once: true,
          },
        })

        if (year) {
          gsap.set(year, { opacity: 0, x: -24 })
          tl.to(year, { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, 0)
        }

        if (accentLine) {
          gsap.set(accentLine, { scaleX: 0, transformOrigin: 'left center' })
          tl.to(accentLine, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, 0.15)
        }

        if (content) {
          gsap.set(content, { opacity: 0, y: 18 })
          tl.to(content, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.2)
        }
      })

      gsap.from('[data-journey-heading]', {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.journey} data-section="journey">
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.topBar}>
          <span className={styles.sectionLabel}>04 — The Journey</span>
        </div>

        <h2 data-journey-heading className={styles.sectionHeading}>
          THE JOURNEY IS<br />THE PRODUCT.
        </h2>

        <div className={styles.chapters}>
          {journey.map((m, i) => (
            <div key={m.id} className={styles.chapter}>
              <div className={styles.chapterLeft}>
                <span className={styles.chapterYear}>{m.year}</span>
                <div className={styles.accentLine} />
              </div>
              <div className={styles.chapterContent}>
                <div className={styles.chapterMeta}>
                  <span className={styles.chapterIndex}>{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className={styles.chapterTitle}>{m.title}</h3>
                <p className={styles.chapterDesc}>{m.description}</p>
                <div className={styles.tags}>
                  {m.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { skillCategories } from '@/data/skills'
import styles from './Expertise.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function Expertise() {
  const sectionRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const skillsGridRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState(skillCategories[0].id)
  const [isMobile, setIsMobile] = useState(false)

  const activeCategory = skillCategories.find((c) => c.id === activeId) ?? skillCategories[0]

  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Headline reveal
  useEffect(() => {
    const headline = headlineRef.current
    if (!headline) return

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
    }, headline)

    return () => ctx.revert()
  }, [])

  // Skills tags stagger-in when category changes
  useEffect(() => {
    const grid = skillsGridRef.current
    if (!grid || isMobile) return

    const tags = grid.querySelectorAll<HTMLElement>(`.${styles.skillTag}`)
    gsap.killTweensOf(tags)
    gsap.set(tags, { opacity: 0, y: 12 })
    gsap.to(tags, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
      stagger: 0.04,
      delay: 0.05,
    })
  }, [activeId, isMobile])

  return (
    <section ref={sectionRef} className={styles.expertise} data-section="expertise">
      <div className={styles.inner}>
        <p className={styles.sectionLabel}>02 — Capabilities</p>

        <h2 ref={headlineRef} className={styles.headline}>
          THE ENGINEERING
          <br />
          SYSTEM
        </h2>

        <div className={styles.layout}>
          {/* Categories list */}
          <div className={styles.categories}>
            {skillCategories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.category} ${activeId === cat.id ? styles.active : ''}`}
                onClick={() => setActiveId(activeId === cat.id ? '' : cat.id)}
                onMouseEnter={() => !isMobile && setActiveId(cat.id)}
              >
                <span className={styles.catNumber}>{cat.number}</span>
                <span className={styles.catLabel}>{cat.label}</span>

                {/* Mobile accordion */}
                {isMobile && (
                  <div className={styles.accordionContent}>
                    <div className={styles.accordionSkills}>
                      {cat.skills.map((skill) => (
                        <span key={skill} className={styles.accordionSkill}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Skills panel — desktop only */}
          {!isMobile && (
            <div className={styles.skillsPanel}>
              <h3 className={styles.activeLabel}>{activeCategory.label}</h3>
              <div ref={skillsGridRef} className={styles.skillsGrid}>
                {activeCategory.skills.map((skill) => (
                  <span key={skill} className={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

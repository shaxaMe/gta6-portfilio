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
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const headline = headlineRef.current
    const grid = gridRef.current
    if (!section || !headline || !grid) return

    const ctx = gsap.context(() => {
      // Headline reveal
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

      // Tiles stagger-in
      const tiles = grid.querySelectorAll<HTMLElement>(`.${styles.tile}`)
      ScrollTrigger.create({
        trigger: grid,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(tiles, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.07,
          })
        },
        once: true,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  // 3D tilt on mouse move
  function handleTileMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const tile = e.currentTarget
    const rect = tile.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateY = ((x - cx) / cx) * 6
    const rotateX = -((y - cy) / cy) * 6

    gsap.to(tile, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 400,
    })
  }

  function handleTileMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }

  return (
    <section ref={sectionRef} className={styles.beyond} data-section="beyond">
      <div className={styles.inner}>
        <p className={styles.sectionLabel}>05 — Interests</p>

        <h2 ref={headlineRef} className={styles.headline}>
          ALWAYS EXPLORING
          <br />
          WHAT&apos;S NEXT.
        </h2>

        <div ref={gridRef} className={styles.grid}>
          {INTERESTS.map((item, i) => (
            <div
              key={item.label}
              className={styles.tile}
              onMouseMove={handleTileMouseMove}
              onMouseLeave={handleTileMouseLeave}
            >
              <div className={styles.tileBorder} />
              <span className={styles.tileNumber}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={styles.tileLabel}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

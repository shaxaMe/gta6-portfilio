import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { journey } from '@/data/journey'
import styles from './Journey.module.css'

gsap.registerPlugin(ScrollTrigger)

const SECTION_HEIGHT_VH = 280

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) return

    const section = sectionRef.current
    const track = trackRef.current
    const progressLine = progressLineRef.current
    if (!section || !track || !progressLine) return

    const ctx = gsap.context(() => {
      // Calculate how far track needs to travel
      const getTrackX = () => {
        const trackW = track.scrollWidth
        const viewportW = window.innerWidth
        return -(trackW - viewportW + 160)
      }

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${SECTION_HEIGHT_VH}%`,
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Move track horizontally
          gsap.set(track, { x: getTrackX() * self.progress })

          // Animate progress line width
          const totalW = track.scrollWidth - 160
          gsap.set(progressLine, { width: `${self.progress * totalW}px` })

          // Determine active milestone
          const idx = Math.min(
            Math.floor(self.progress * journey.length * 1.05),
            journey.length - 1
          )
          setActiveIndex(idx)
        },
      })

      // Animate section heading on enter
      gsap.from('[data-journey-heading]', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      })

      return () => st.kill()
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className={styles.journey}
      data-section="journey"
      style={isMobile ? undefined : { height: `${SECTION_HEIGHT_VH}vh` }}
    >
      {isMobile ? (
        <MobileJourney />
      ) : (
        <div className={styles.sticky}>
          {/* Top bar */}
          <div className={styles.topBar}>
            <span className={styles.sectionLabel}>04 — The Journey</span>
            <span className={styles.counter}>
              <span className={styles.counterActive}>{String(activeIndex + 1).padStart(2, '0')}</span>
              <span className={styles.counterSep}>/</span>
              <span className={styles.counterTotal}>{String(journey.length).padStart(2, '0')}</span>
            </span>
          </div>

          {/* Background large heading */}
          <h2 data-journey-heading className={styles.bgHeading} aria-hidden="true">
            THE JOURNEY IS<br />THE PRODUCT.
          </h2>

          {/* Timeline track */}
          <div className={styles.trackWrap}>
            {/* Background rail */}
            <div className={styles.rail} />
            {/* Animated progress line */}
            <div ref={progressLineRef} className={styles.progressLine} style={{ width: '0px' }} />

            {/* Milestones */}
            <div ref={trackRef} className={styles.track}>
              {/* Spacer at start */}
              <div className={styles.trackSpacer} />

              {journey.map((m, i) => {
                const isActive = i === activeIndex
                const isPast = i < activeIndex
                const isTop = m.position === 'top'

                return (
                  <div
                    key={m.id}
                    className={`${styles.milestone} ${isTop ? styles.milestoneTop : styles.milestoneBottom} ${isActive ? styles.isActive : ''} ${isPast ? styles.isPast : ''}`}
                  >
                    {/* Ghost year */}
                    <span className={styles.ghostYear} aria-hidden="true">{m.year}</span>

                    {/* Content card */}
                    <div className={styles.card}>
                      <div className={styles.cardIndex}>
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <h3 className={styles.cardTitle}>{m.title}</h3>
                      <p className={styles.cardDesc}>{m.description}</p>
                      <div className={styles.tags}>
                        {m.tags.map((tag) => (
                          <span key={tag} className={styles.tag}>{tag}</span>
                        ))}
                      </div>
                    </div>

                    {/* Dot on rail */}
                    <div className={styles.dot}>
                      <div className={styles.dotInner} />
                    </div>

                    {/* Vertical connector line */}
                    <div className={styles.connector} />
                  </div>
                )
              })}

              {/* Spacer at end */}
              <div className={styles.trackSpacer} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function MobileJourney() {
  return (
    <div className={styles.mobileWrap}>
      <div className={styles.topBar}>
        <span className={styles.sectionLabel}>04 — The Journey</span>
      </div>
      <h2 className={styles.mobileHeading}>
        THE JOURNEY IS<br />THE PRODUCT.
      </h2>
      <div className={styles.mobileList}>
        {journey.map((m, i) => (
          <div key={m.id} className={styles.mobileItem}>
            <div className={styles.mobileLeft}>
              <span className={styles.mobileDot} />
              {i < journey.length - 1 && <span className={styles.mobileConnector} />}
            </div>
            <div className={styles.mobileContent}>
              <span className={styles.mobileYear}>{m.year}</span>
              <h3 className={styles.mobileTitle}>{m.title}</h3>
              <p className={styles.mobileDesc}>{m.description}</p>
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
  )
}

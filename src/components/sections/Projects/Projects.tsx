import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { projects, type Project } from '@/data/projects'
import styles from './Projects.module.css'

gsap.registerPlugin(ScrollTrigger)

// Only show real projects (exclude empty placeholder)
const realProjects = projects.filter((p) => p.tech.length > 0)
const PANEL_COUNT = realProjects.length // 4

function ProjectPanel({
  project,
  index,
  isActive,
}: {
  project: Project
  index: number
  isActive: boolean
}) {
  return (
    <div className={`${styles.panel} ${isActive ? styles.panelActive : ''}`}>
      {/* Ghost number */}
      <span className={styles.panelNumber} aria-hidden="true">
        {project.number}
      </span>

      {/* Accent line top */}
      <div
        className={styles.panelTopLine}
        style={{ background: project.accentColor }}
      />

      <div className={styles.panelInner}>
        <div className={styles.panelMeta}>
          <span className={styles.panelIndex}>
            {String(index + 1).padStart(2, '0')} /{' '}
            {String(PANEL_COUNT).padStart(2, '0')}
          </span>
          <span className={styles.panelCategory}>{project.category}</span>
          <span className={styles.panelYear}>{project.year}</span>
        </div>

        <h3 className={styles.panelTitle}>{project.title}</h3>

        <p className={styles.panelDesc}>{project.description}</p>

        {project.tech.length > 0 && (
          <div className={styles.techStack}>
            {project.tech.map((t) => (
              <span key={t} className={styles.techTag}>
                {t}
              </span>
            ))}
          </div>
        )}

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.panelLink}
          >
            View Project ↗
          </a>
        )}
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
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
    if (!section || !track) return

    // Each panel gets exactly window.innerHeight (100vh) of scroll — simple and predictable.
    // Total pin duration = (PANEL_COUNT - 1) screens.
    const getPinDuration = () => (PANEL_COUNT - 1) * window.innerHeight
    const getTravelX = () => -(PANEL_COUNT - 1) * window.innerWidth

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: getTravelX,          // function — recalculates on resize
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getPinDuration()}`,
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              Math.floor(self.progress * PANEL_COUNT),
              PANEL_COUNT - 1
            )
            setActiveIndex(idx)
          },
        },
      })
    }, section)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className={styles.projects}
      data-section="projects"
    >
      {!isMobile ? (
        <div className={styles.sticky}>
          <div className={styles.topBar}>
            <p className={styles.sectionLabel}>03 — Selected Work</p>
            <span className={styles.counter}>
              <span className={styles.counterActive}>
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className={styles.counterSep}>/</span>
              <span className={styles.counterTotal}>
                {String(PANEL_COUNT).padStart(2, '0')}
              </span>
            </span>
          </div>

          <div ref={trackRef} className={styles.track}>
            {realProjects.map((p, i) => (
              <ProjectPanel
                key={p.id}
                project={p}
                index={i}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.mobileWrap}>
          <div className={styles.topBar}>
            <p className={styles.sectionLabel}>03 — Selected Work</p>
          </div>
          <div className={styles.mobileList}>
            {realProjects.map((p) => (
              <div key={p.id} className={styles.mobileCard}>
                <div className={styles.mobileCardTop}>
                  <span className={styles.mobileCardNumber}>{p.number}</span>
                  <span className={styles.panelCategory}>{p.category}</span>
                </div>
                <h3 className={styles.mobilePanelTitle}>{p.title}</h3>
                <p className={styles.panelDesc}>{p.description}</p>
                <div className={styles.techStack}>
                  {p.tech.map((t) => (
                    <span key={t} className={styles.techTag}>
                      {t}
                    </span>
                  ))}
                </div>
                <div
                  className={styles.mobileAccentLine}
                  style={{ background: p.accentColor }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

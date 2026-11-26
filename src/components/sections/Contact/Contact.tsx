import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { getRenderer } from '@/three/renderer'
import { ContactScene } from '@/three/ContactScene'
import { siteConfig } from '@/data/config'
import styles from './Contact.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const CONTACT_LINKS = [
  { label: siteConfig.email, type: 'Email', href: `mailto:${siteConfig.email}`, icon: '@' },
  { label: 'GitHub', type: 'Code', href: siteConfig.github, icon: '{ }' },
  { label: 'LinkedIn', type: 'Professional', href: siteConfig.linkedin, icon: 'in' },
  { label: 'Telegram', type: 'Direct', href: siteConfig.telegram, icon: '→' },
]

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sceneRef = useRef<ContactScene | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const scene = new ContactScene()
    scene.init()
    sceneRef.current = scene

    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      const rendererState = getRenderer()
      if (!rendererState || !sceneRef.current || !canvasRef.current) return

      const { renderer } = rendererState
      const rect = canvasRef.current.getBoundingClientRect()

      if (rect.bottom < 0 || rect.top > window.innerHeight) return

      sceneRef.current.update()
      sceneRef.current.render(renderer, rect)
    }

    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return

    const ctx = gsap.context(() => {
      const lines = heading.querySelectorAll<HTMLElement>('span[class]')

      lines.forEach((line) => {
        const split = new SplitText(line, { type: 'chars,words' })
        gsap.set(split.chars, {
          y: '110%',
          opacity: 0,
          rotationZ: 4,
          transformOrigin: 'left bottom',
        })

        ScrollTrigger.create({
          trigger: line,
          start: 'top 85%',
          onEnter: () => {
            gsap.to(split.chars, {
              y: '0%',
              opacity: 1,
              rotationZ: 0,
              duration: 1.0,
              ease: 'power4.out',
              stagger: 0.025,
            })
          },
          once: true,
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.contact} data-section="contact">
      <div ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.atmosphere} aria-hidden="true" />

      <div className={styles.inner}>
        <p className={styles.sectionLabel}>06 — Contact</p>

        <h2 ref={headingRef} className={styles.heading}>
          <span className={styles.line1}>LET&apos;S CREATE</span>
          <span className={styles.line2}>SOMETHING</span>
          <span className={styles.line3}>
            UNFORGETTABLE<span className={styles.period}>.</span>
          </span>
        </h2>

        <p className={styles.supportText}>
          Open to new projects, collaborations, and interesting conversations.
          <br />
          Let&apos;s build something worth building.
        </p>

        <div className={styles.links}>
          {CONTACT_LINKS.map(({ label, type, href, icon }) => (
            <a
              key={type}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className={styles.contactLink}
            >
              <div className={styles.linkLeft}>
                <div className={styles.linkIcon}>{icon}</div>
                <span className={styles.linkLabel}>{label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className={styles.linkType}>{type}</span>
                <span className={styles.arrow}>↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

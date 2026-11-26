import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { getRenderer } from '@/three/renderer'
import { HeroScene } from '@/three/HeroScene'
import styles from './Hero.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

interface HeroProps {
  playReveal: boolean
}

export default function Hero({ playReveal }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLSpanElement>(null)
  const taglinePreRef = useRef<HTMLSpanElement>(null)
  const sceneRef = useRef<HeroScene | null>(null)
  const rafRef = useRef<number>(0)
  const mouseXRef = useRef(0)
  const mouseYRef = useRef(0)
  const scrollProgressRef = useRef(0)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile) return

    const scene = new HeroScene()
    scene.init()
    sceneRef.current = scene

    function onMouseMove(e: MouseEvent) {
      mouseXRef.current = (e.clientX / window.innerWidth - 0.5) * 2
      mouseYRef.current = (e.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMouseMove)

    function tick() {
      rafRef.current = requestAnimationFrame(tick)
      const rendererState = getRenderer()
      if (!rendererState || !sceneRef.current) return

      const { renderer } = rendererState
      renderer.clear()

      const canvasEl = canvasRef.current
      if (canvasEl) {
        const rect = canvasEl.getBoundingClientRect()
        sceneRef.current.update(scrollProgressRef.current, mouseXRef.current, mouseYRef.current)
        sceneRef.current.render(renderer, rect)
      }
    }

    tick()

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      scene.dispose()
      sceneRef.current = null
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!playReveal) return

    const heading = headingRef.current
    const subtitle = subtitleRef.current
    const tagline = taglineRef.current
    const taglinePre = taglinePreRef.current
    if (!heading) return

    const ctx = gsap.context(() => {
      const split = new SplitText(heading, { type: 'chars,words' })

      gsap.set(split.chars, {
        y: '110%',
        opacity: 0,
        rotationZ: 6,
        transformOrigin: 'left bottom',
      })

      const tl = gsap.timeline()

      tl.to(split.chars, {
        y: '0%',
        opacity: 1,
        rotationZ: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.025,
      })

      if (subtitle) {
        tl.to(subtitle, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      }

      if (taglinePre) {
        tl.to(taglinePre, { opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.6')
      }

      if (tagline) {
        tl.to(tagline, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.5')
      }
    }, heading)

    return () => ctx.revert()
  }, [playReveal])

  return (
    <section ref={sectionRef} className={styles.hero} data-section="hero">
      <div ref={canvasRef} className={styles.canvas} aria-hidden="true" />
      <div className={styles.atmosphere} aria-hidden="true" />
      <span className={styles.yearMarker} aria-hidden="true">25</span>

      <div className={styles.topBar}>
        <span className={styles.locationTag}>Tashkent, UZ</span>
        <span className={styles.statusTag}>Available for work</span>
      </div>

      <div className={styles.content}>
        <div className={styles.nameBlock}>
          <h1 ref={headingRef} className={styles.heading}>
            <span className={styles.line}>SHAHZOD</span>
            <span className={styles.line}>ISMATOV</span>
          </h1>
          <p ref={subtitleRef} className={styles.subtitle}>
            Full-Stack Developer &amp; Creative Engineer
          </p>
        </div>

        <div className={styles.taglineBlock}>
          <span ref={taglinePreRef} className={styles.taglinePre}>I Build</span>
          <span ref={taglineRef} className={styles.tagline}>
            DIGITAL<br />WORLDS.
          </span>
        </div>
      </div>

      <div className={styles.dividerLine} aria-hidden="true" />
      <div className={styles.scrollIndicator} aria-hidden="true">↓ SCROLL</div>
    </section>
  )
}

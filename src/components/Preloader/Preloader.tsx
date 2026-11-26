import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import styles from './Preloader.module.css'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const path1Ref = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)
  useEffect(() => {
    const container = containerRef.current
    const fill = progressFillRef.current
    const counter = counterRef.current
    const p1 = path1Ref.current
    const p2 = path2Ref.current

    if (!container || !fill || !counter || !p1 || !p2) return

    const ctx = gsap.context(() => {
      // Set initial stroke dash for SVG paths
      const len1 = p1.getTotalLength()
      const len2 = p2.getTotalLength()

      gsap.set(p1, { strokeDasharray: len1, strokeDashoffset: len1 })
      gsap.set(p2, { strokeDasharray: len2, strokeDashoffset: len2 })

      const tl = gsap.timeline()

      // Draw SVG paths
      tl.to(p1, {
        strokeDashoffset: 0,
        duration: 1.0,
        ease: 'power3.inOut',
      })
        .to(
          p2,
          {
            strokeDashoffset: 0,
            duration: 1.0,
            ease: 'power3.inOut',
          },
          '-=0.6'
        )
        // Progress bar fill + counter
        .to(
          fill,
          {
            width: '100%',
            duration: 1.6,
            ease: 'power2.inOut',
          },
          0
        )
        .to(
          {},
          {
            duration: 1.6,
            ease: 'none',
            onUpdate() {
              const progress = Math.round(this.progress() * 100)
              if (counter) counter.textContent = `${progress}%`
            },
          },
          0
        )
        // Hold briefly
        .to({}, { duration: 0.3 })
        // Fire onComplete at the START of the wipe — hero animations
        // play during the 0.9s exit so content is already revealing
        // as the preloader lifts away.
        .call(() => onComplete())
        // Wipe entire preloader up
        .to(container, {
          yPercent: -100,
          duration: 0.9,
          ease: 'power4.inOut',
        })
    }, container)

    return () => ctx.revert()
  }, [onComplete])

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.monogram}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* S letter path */}
          <path
            ref={path1Ref}
            d="M 65 20 C 65 20 35 20 35 35 C 35 50 65 50 65 65 C 65 80 35 80 35 80"
          />
          {/* H letter path */}
          <path
            ref={path2Ref}
            d="M 20 15 L 20 50 M 20 50 L 50 50 M 50 15 L 50 85 M 60 15 L 80 15 L 80 85 L 60 85"
          />
        </svg>
      </div>

      <span ref={counterRef} className={styles.counter}>
        0%
      </span>

      <div className={styles.progressBar}>
        <div ref={progressFillRef} className={styles.progressFill} />
      </div>
    </div>
  )
}

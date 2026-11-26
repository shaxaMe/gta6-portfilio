import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isPointerFine, setIsPointerFine] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setIsPointerFine(fine)
  }, [])

  useEffect(() => {
    if (!isPointerFine) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // QuickTo for fast cursor movement
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    function onMouseMove(e: MouseEvent) {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    function onMouseEnter() {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3, ease: 'power2.out' })
    }

    function onMouseLeave() {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3, ease: 'power2.out' })
    }

    function onMouseOver(e: MouseEvent) {
      const target = e.target as Element
      if (target.closest('a, button, [data-magnetic]')) {
        setHovered(true)
      }
    }

    function onMouseOut(e: MouseEvent) {
      const target = e.target as Element
      if (target.closest('a, button, [data-magnetic]')) {
        setHovered(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [isPointerFine])

  if (!isPointerFine) return null

  return (
    <>
      <div ref={dotRef} className={styles.dot} aria-hidden="true" />
      <div
        ref={ringRef}
        className={`${styles.ring} ${hovered ? styles.hovered : ''}`}
        aria-hidden="true"
      />
    </>
  )
}

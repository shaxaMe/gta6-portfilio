import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { getLenis } from '@/animations/lenis'
import styles from './Navigation.module.css'

interface NavigationProps {
  loaded: boolean
}

const NAV_LINKS = [
  { label: 'About', section: 'about' },
  { label: 'Work', section: 'projects' },
  { label: 'Journey', section: 'journey' },
  { label: 'Contact', section: 'contact' },
]

export default function Navigation({ loaded }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    if (loaded) {
      gsap.to(nav, {
        y: 0,
        duration: 1.0,
        ease: 'power4.out',
        delay: 0.2,
      })
    }
  }, [loaded])

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 100)

      // Track active section
      const sections = NAV_LINKS.map((l) => document.querySelector(`[data-section="${l.section}"]`))
      let current = ''

      sections.forEach((section, i) => {
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.top <= window.innerHeight * 0.5) {
          current = NAV_LINKS[i].section
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function scrollToSection(section: string) {
    const el = document.querySelector(`[data-section="${section}"]`) as HTMLElement
    if (!el) return

    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.4, offset: -80 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function scrollToTop() {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.8 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`${styles.nav} ${loaded ? styles.visible : ''} ${scrolled ? styles.scrolled : ''}`}
    >
      <button className={styles.logo} onClick={scrollToTop} aria-label="Back to top">
        SI
      </button>

      <ul className={styles.links}>
        {NAV_LINKS.map(({ label, section }) => (
          <li key={section}>
            <button
              className={`${styles.link} ${activeSection === section ? styles.active : ''}`}
              onClick={() => scrollToSection(section)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

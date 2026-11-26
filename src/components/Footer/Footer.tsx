import { getLenis } from '@/animations/lenis'
import styles from './Footer.module.css'

export default function Footer() {
  function handleBackToTop() {
    const lenis = getLenis()
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.monogram}>SH</span>
          Shahzod Ismatov &copy; 2025
        </div>

        <p className={styles.center}>Built with React, Three.js &amp; GSAP</p>

        <div className={styles.right}>
          <button className={styles.backTop} onClick={handleBackToTop}>
            <span>↑</span>
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}

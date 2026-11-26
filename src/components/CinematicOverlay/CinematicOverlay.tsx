import styles from './CinematicOverlay.module.css'

export default function CinematicOverlay() {
  return (
    <>
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
    </>
  )
}

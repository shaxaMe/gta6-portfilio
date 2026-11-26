import { useEffect, useState } from 'react'
import { initRenderer, disposeRenderer } from '@/three/renderer'
import { initLenis, destroyLenis } from '@/animations/lenis'

import Preloader from '@/components/Preloader/Preloader'
import CustomCursor from '@/components/CustomCursor/CustomCursor'
import Navigation from '@/components/Navigation/Navigation'
import Hero from '@/components/sections/Hero/Hero'
import About from '@/components/sections/About/About'
import Expertise from '@/components/sections/Expertise/Expertise'
import Projects from '@/components/sections/Projects/Projects'
import Journey from '@/components/sections/Journey/Journey'
import Beyond from '@/components/sections/Beyond/Beyond'
import Contact from '@/components/sections/Contact/Contact'
import Footer from '@/components/Footer/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  useEffect(() => {
    // Init renderer first
    initRenderer()
    // Then init Lenis (which also configures ScrollTrigger)
    initLenis()

    return () => {
      destroyLenis()
      disposeRenderer()
    }
  }, [])

  function handlePreloaderComplete() {
    setLoaded(true)
    setHeroReady(true)
  }

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />
      <CustomCursor />
      <Navigation loaded={loaded} />
      <main>
        <Hero playReveal={heroReady} />
        <About />
        <Expertise />
        <Projects />
        <Journey />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

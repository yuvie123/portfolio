import { About } from '../content/sections/About'
import { Contact } from '../content/sections/Contact'
import { Education } from '../content/sections/Education'
import { Experience } from '../content/sections/Experience'
import { Projects } from '../content/sections/Projects'
import { Skills } from '../content/sections/Skills'
import { Footer } from './Footer'
import { Header } from './Header'

export function FallbackSite() {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-6 sm:px-12 lg:flex lg:justify-between lg:gap-12">
      <Header />
      <main id="content" tabIndex={-1} className="pt-16 focus:outline-none lg:w-7/12 lg:py-24">
        <div className="space-y-24">
          <About />
          <Experience />
          <Projects />
          <Education />
          <Skills />
          <Contact />
        </div>
        <Footer />
      </main>
    </div>
  )
}

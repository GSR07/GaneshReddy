import { useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Education from '../components/sections/Education'
import Experience from '../components/sections/Experience'
import ProjectsSection from '../components/sections/ProjectsSection'
import Contact from '../components/sections/Contact'

function addReveal() {
  document.querySelectorAll(
    '.glass-card, .timeline-item, .exp-card, .project-card, .about-text, .about-card, .contact-info, .contact-cta'
  ).forEach(el => el.classList.add('reveal'))

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  return observer
}

export default function Home() {
  useEffect(() => {
    const observer = addReveal()

    // Stagger grid children
    document.querySelectorAll('.skills-grid, .projects-grid, .exp-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * 80}ms`
      })
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Education />
      <Experience />
      <ProjectsSection />
      <Contact />
      <Footer />
    </>
  )
}

import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import DroneSwarm from '../robots/DroneSwarm'

const PHRASES = ['Robotics Engineer', 'Computer Vision Engineer', 'Embedded Systems Engineer']

export default function Hero() {
  const typedRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let phraseIdx = 0, charIdx = 0, deleting = false, paused = false
    let timeout: ReturnType<typeof setTimeout>

    function type() {
      if (paused || !typedRef.current) return
      const current = PHRASES[phraseIdx]
      if (deleting) {
        typedRef.current.textContent = current.slice(0, charIdx--)
        if (charIdx < 0) {
          deleting = false
          phraseIdx = (phraseIdx + 1) % PHRASES.length
          timeout = setTimeout(type, 400)
          return
        }
        timeout = setTimeout(type, 45)
      } else {
        typedRef.current.textContent = current.slice(0, charIdx++)
        if (charIdx > current.length) {
          paused = true
          timeout = setTimeout(() => { paused = false; deleting = true; type() }, 2000)
          return
        }
        timeout = setTimeout(type, 65)
      }
    }
    type()
    return () => clearTimeout(timeout)
  }, [])

  return (
    <section id="hero">
      <div className="hero-bg" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="grid-overlay" />
        <DroneSwarm />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Open to Robotics Internship, Werkstudent &amp; M.Sc. Thesis — Germany &amp; Europe
        </div>
        <h1>Ganesh <span className="gradient-text">Reddy</span></h1>
        <p className="hero-tagline">
          <span ref={typedRef} className="typed-text" />
          <span className="cursor" />
        </p>
        <p className="hero-sub">
          Master's student at <strong>FAU Erlangen</strong> · ROS2 · MoveIt2 · Embedded Systems · Autonomous Navigation
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn-primary" onClick={e => {
            e.preventDefault()
            document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
          }}>View My Work</a>
          <a href="/cv/cv/Ganesh_Reddy_CV_MSc_Autonomy_Technologies.pdf" target="_blank" className="btn-ghost">Download CV</a>
        </div>
        <div className="hero-socials">
          <a href="mailto:ganeshreddy30102000@gmail.com" aria-label="Email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </a>
          <a href="https://www.linkedin.com/in/ganeshssreddy09" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          <a href="https://github.com/gsr07" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </a>
        </div>
      </div>

      <div className="hero-photo-wrap">
        <div className="photo-ring" />
        <img src="/ganesh_photo.jpg" alt="Ganesh Reddy" className="hero-photo" />
      </div>

      <a href="#about" className="scroll-down" aria-label="Scroll down" onClick={e => {
        e.preventDefault()
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </a>
    </section>
  )
}

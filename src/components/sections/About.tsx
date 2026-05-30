import { useEffect, useRef } from 'react'
import RobotArm from '../robots/RobotArm'

function animateCounter(el: HTMLElement, target: number, duration = 1200) {
  const isFloat = target % 1 !== 0
  const start = performance.now()
  const update = (now: number) => {
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const val = eased * target
    el.textContent = isFloat ? val.toFixed(1) : String(Math.floor(val))
    if (progress < 1) requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}

export default function About() {
  const highlightsRef = useRef<HTMLDivElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    if (!highlightsRef.current) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          highlightsRef.current?.querySelectorAll<HTMLElement>('.highlight-num').forEach(el => {
            const raw = parseFloat(el.textContent ?? '0')
            if (!isNaN(raw)) animateCounter(el, raw)
          })
        }
      })
    }, { threshold: 0.5 })
    observer.observe(highlightsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" className="section">
      <div className="container">
        <RobotArm />
        <div className="section-label">01 / About</div>
        <h2 className="section-title">Who Am I<span className="arm-q-target" aria-hidden="true">?</span></h2>
        <div className="about-grid">
          <div className="about-text reveal">
            <p>I'm a <strong>Master's student in Autonomy Technologies</strong> at Friedrich-Alexander-Universität (FAU) Erlangen-Nürnberg, building robotic systems end-to-end — from schematic to motion planner.</p>
            <p>My core work is in <strong>manipulation and mobile robotics</strong>: I've built a vision-guided pick-and-place pipeline on the Franka Panda using ROS2 and MoveIt2, and deployed full autonomous navigation stacks with Nav2, AMCL, and LiDAR-IMU sensor fusion on TurtleBot3. I design in SolidWorks, simulate in Gazebo, and write firmware in C and ESP-IDF — the full stack from circuit board to trajectory planner.</p>
            <p>I'm currently seeking a <strong>Master's thesis placement, Pflichtpraktikum (10+ weeks), or Werkstudent role</strong> in robotics, autonomous systems, or embedded engineering — at research labs, Fraunhofer institutes, or industrial teams across Germany and Europe.</p>

            <div className="about-highlights" ref={highlightsRef}>
              <div className="highlight-item">
                <span className="highlight-num">70</span><span className="highlight-unit">.0</span>
                <div className="highlight-label">ECTS Earned</div>
              </div>
              <div className="highlight-item">
                <span className="highlight-num">2</span><span className="highlight-unit">+</span>
                <div className="highlight-label">Years Experience</div>
              </div>
              <div className="highlight-item">
                <span className="highlight-num">3</span>
                <div className="highlight-label">Research Areas</div>
              </div>
            </div>
          </div>

          <div className="about-card glass-card reveal">
            <div className="card-chip">Research Focus</div>
            <ul className="focus-list">
              <li>
                <span className="focus-icon">
                  <svg className="icon-svg icon-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="5" y="8" width="14" height="12" rx="2" />
                    <circle cx="9.5" cy="13.5" r="1.5" fill="currentColor" /><circle cx="14.5" cy="13.5" r="1.5" fill="currentColor" />
                    <path d="M9 17.5h6M12 8V5M10 5h4" /><path d="M3 10.5v3M21 10.5v3" />
                  </svg>
                </span>
                <div><strong>Robotics &amp; Manipulation</strong><p>ROS2, MoveIt2, Franka Panda, Gazebo/Ignition simulation, D-H kinematics, Dynamixel servo control</p></div>
              </li>
              <li>
                <span className="focus-icon">
                  <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 20h5l2-8 5-2 2-6" /><circle cx="18" cy="4" r="2" />
                    <path d="M7 20c0-1.1.9-2 2-2h5a2 2 0 0 1 0 4H9a2 2 0 0 1-2-2z" />
                  </svg>
                </span>
                <div><strong>Mobile Robotics &amp; Navigation</strong><p>ROS2, Nav2, AMCL, SLAM, LiDAR-IMU sensor fusion, autonomous waypoint navigation</p></div>
              </li>
              <li>
                <span className="focus-icon">
                  <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div><strong>Computer Vision</strong><p>OpenCV, YOLOv3, HSV segmentation, TF2 transforms, real-time object detection</p></div>
              </li>
              <li>
                <span className="focus-icon">
                  <svg className="icon-svg icon-ping" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><circle cx="12" cy="20" r="1" fill="currentColor" />
                  </svg>
                </span>
                <div><strong>Embedded &amp; IoT</strong><p>ESP32, BLE, KiCad PCB design, ESP-IDF firmware, MQTT, OTA updates</p></div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

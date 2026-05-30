
const LocSVG = () => (
  <svg className="loc-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
)
const DocSVG = () => (
  <svg className="doc-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
  </svg>
)

export default function Education() {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-label">03 / Education</div>
        <h2 className="section-title">Academic Background</h2>
        <div className="timeline">
          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content glass-card">
              <div className="timeline-period">Apr 2024 – Present</div>
              <h3>M.Sc. Autonomy Technologies</h3>
              <div className="timeline-org">Friedrich-Alexander-Universität Erlangen–Nürnberg (FAU)</div>
              <div className="timeline-loc"><LocSVG /> Erlangen, Germany</div>
              <div className="timeline-stats">
                <span><strong>ECTS:</strong> 70.0 / 120</span>
                <span><strong>GPA:</strong> 2.6</span>
              </div>
              <div className="coursework">
                <div className="coursework-label">Relevant Coursework</div>
                <div className="course-pills">
                  {['Robotics 1','Deep Learning','Pattern Recognition','ML in Signal Processing',
                    'AI in Medical Robotics','Human-Robot Co-adaptation','Intent Detection & Feedback',
                    'Rehabilitation & Assistive Robotics'].map(c => (
                    <span key={c} className="pill">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-item reveal">
            <div className="timeline-dot" />
            <div className="timeline-content glass-card">
              <div className="timeline-period">Aug 2018 – Jul 2022</div>
              <h3>B.E. Automation &amp; Robotics</h3>
              <div className="timeline-org">KLE Technological University</div>
              <div className="timeline-loc"><LocSVG /> Hubballi, India</div>
              <div className="timeline-stats"><span><strong>GPA:</strong> 1.9</span></div>
              <p className="thesis-note">
                <DocSVG /> Bachelor's Thesis: <em>"Automated Grading and Sorting System using Computer Vision"</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

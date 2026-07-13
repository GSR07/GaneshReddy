// Tool-chip strip. Every entry below is pulled verbatim (or lightly shortened)
// from tags used in src/data/projects.ts and SKILL_GROUPS in ./Skills.tsx.

const DD_STYLE = `
.dd-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}
.dd-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text);
  transition: transform var(--transition), border-color var(--transition), background var(--transition);
}
.dd-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(99, 102, 241, 0.35);
  background: var(--glass-bg-hover);
}
.dd-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-2);
  flex-shrink: 0;
}
#daily-drivers .section-label,
#daily-drivers .section-title {
  margin-bottom: 12px;
}
#daily-drivers .section-title {
  margin-bottom: 8px;
}
`

// Traced to: projects.ts tags (ROS2, Python, C++, OpenCV, PyTorch, KiCad,
// Gazebo/Ignition, Nav2, ESP-IDF, Git/Docker/Linux via Skills.tsx Tools & DevOps group).
const TOOLS = [
  'ROS2', 'Python', 'C++', 'OpenCV', 'PyTorch', 'Gazebo / Ignition',
  'Nav2', 'KiCad', 'ESP-IDF', 'Git', 'Docker', 'Linux (Ubuntu)',
]

export default function DailyDrivers() {
  return (
    <section id="daily-drivers" className="section section-alt">
      <style>{DD_STYLE}</style>
      <div className="container">
        <div className="section-label">Daily Drivers</div>
        <h2 className="section-title">Tools I Reach For</h2>
        <div className="dd-panel">
          {TOOLS.map(tool => (
            <span key={tool} className="dd-chip">
              <span className="dd-dot" aria-hidden="true" />
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

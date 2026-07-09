
const EXPERIENCE = [
  {
    badge: 'Research', badgeType: 'research', period: 'Nov 2025 – Present',
    title: 'Student Research Assistant', org: 'IDEA LABS · FAU Erlangen',
    bullets: [
      'Built GitHub Classroom automated grading workflow, cutting manual evaluation turnaround by <strong>50–60%</strong> across 30+ students',
      'Wrote Python exercise-evaluation and result-parsing scripts, reducing repeat student queries by <strong>~25%</strong>',
      'Supported debugging, reproducibility, and evaluation of ML workflows on structured scientific datasets',
    ],
  },
  {
    badge: 'Industry', badgeType: 'industry', period: 'Jan 2023 – Oct 2023',
    title: 'IoT Engineering Intern', org: 'Digital Associates India · Hyderabad',
    bullets: [
      'Designed custom PCB (KiCad) and wrote ESP32 firmware (C, ESP-IDF) for BLE/RSSI indoor localisation across <strong>20–30 nodes</strong> covering a <strong>50 m</strong> area',
      'OTA firmware pipeline reduced field deployment time by <strong>~25%</strong>; hardware validation cut PCB rework by <strong>~20%</strong>',
      'Integrated MQTT telemetry with Azure Cloud; built real-time Power BI dashboards for asset tracking',
    ],
  },
  {
    badge: 'Internship', badgeType: 'intern', period: 'Jan 2022 – Jul 2022',
    title: 'Systems Engineer Intern', org: 'Centre for Autonomous Systems Engineering · Hubballi',
    bullets: [
      'Designed and fabricated a <strong>4-DOF robotic arm</strong> (5 Dynamixel XM430 actuators) in SolidWorks — full mechanical CAD, 3D-printed gripper and link assemblies, Dynamixel XM430 servo motors; achieved <strong>±5 mm</strong> end-effector accuracy with <strong>5 kg</strong> payload',
      'Derived D-H kinematic model, implemented forward/inverse kinematics, built URDF/Xacro model, validated in Gazebo, and configured MoveIt2 for collision-aware pick-and-place',
      'Programmed Dynamixel XM430 servo controllers (Python/C++ SDK) for joint-level trajectory execution; simulation-first approach reduced physical rework by <strong>10–20%</strong>',
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section section-alt">
      <div className="container">
        <div className="section-label">04 / Experience</div>
        <h2 className="section-title">Work &amp; Research</h2>
        <div className="exp-grid">
          {EXPERIENCE.map(exp => (
            <div key={exp.title} className="exp-card glass-card reveal">
              <div className="exp-header">
                <div className={`exp-badge exp-badge-${exp.badgeType}`}>{exp.badge}</div>
                <div className="exp-period">{exp.period}</div>
              </div>
              <h3>{exp.title}</h3>
              <div className="exp-org">{exp.org}</div>
              <ul className="exp-bullets">
                {exp.bullets.map((b, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

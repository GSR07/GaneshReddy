
const SKILL_GROUPS = [
  {
    cls: 'skill-primary', icon: (
      <svg className="icon-svg icon-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="8" width="14" height="12" rx="2" />
        <circle cx="9.5" cy="13.5" r="1.5" fill="currentColor" /><circle cx="14.5" cy="13.5" r="1.5" fill="currentColor" />
        <path d="M9 17.5h6M12 8V5M10 5h4" /><path d="M3 10.5v3M21 10.5v3" />
      </svg>
    ),
    title: 'Robotics & Manipulation',
    tags: [
      { name: 'ROS2', level: 90, hot: true }, { name: 'MoveIt2', level: 85, hot: true },
      { name: 'Nav2', level: 80 }, { name: 'Gazebo / Ignition', level: 85 },
      { name: 'Kinematics', level: 85 }, { name: 'EKF / Sensor Fusion', level: 75 }, { name: 'SolidWorks', level: 70 },
    ],
  },
  {
    cls: 'skill-secondary', icon: (
      <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
    title: 'Computer Vision',
    tags: [
      { name: 'OpenCV', level: 90, hot: true }, { name: 'YOLO', level: 85, hot: true },
      { name: 'HSV Segmentation', level: 85 }, { name: 'TF2 Transforms', level: 80 }, { name: 'Image Preprocessing', level: 75 },
    ],
  },
  {
    cls: '', icon: (
      <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 14l-3-2.5L8 9M16 9l3 2.5L16 14M12 9l-2 6" /><path d="M1 20h22" />
      </svg>
    ),
    title: 'Programming',
    tags: [
      { name: 'Python', level: 95, hot: true }, { name: 'C++', level: 85 },
      { name: 'C / Embedded C', level: 80 }, { name: 'MATLAB', level: 75 },
    ],
  },
  {
    cls: '', icon: (
      <svg className="icon-svg icon-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5c-3.9 0-7 3.1-7 7 0 2.2 1 4.2 2.6 5.5L8 20h8l.4-2.5C18 16.2 19 14.2 19 12c0-3.9-3.1-7-7-7z" />
        <path d="M9 11h6M10 14h4M12 5V3" />
      </svg>
    ),
    title: 'AI & Deep Learning',
    tags: [
      { name: 'PyTorch', level: 85, hot: true }, { name: 'TensorFlow', level: 80 },
      { name: 'CNNs', level: 85 }, { name: 'Transfer Learning', level: 80 }, { name: 'YOLOv3', level: 75 },
    ],
  },
  {
    cls: '', icon: (
      <svg className="icon-svg icon-ping" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
      </svg>
    ),
    title: 'Embedded & IoT',
    tags: [
      { name: 'ESP32 (ESP-IDF)', level: 90 }, { name: 'STM32 / Arduino', level: 85 },
      { name: 'KiCad PCB Design', level: 80 }, { name: 'BLE / MQTT', level: 75 }, { name: 'RTOS / OTA', level: 70 },
    ],
  },
  {
    cls: '', icon: (
      <svg className="icon-svg icon-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: 'Tools & DevOps',
    tags: [
      { name: 'Linux (Ubuntu)', level: 90 }, { name: 'Git', level: 90 },
      { name: 'Docker', level: 80 }, { name: 'Simulink', level: 75 }, { name: 'Azure Cloud', level: 70 },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section section-alt">
      <div className="container">
        <div className="section-label">02 / Skills</div>
        <h2 className="section-title">Technical Stack</h2>
        <div className="skills-grid">
          {SKILL_GROUPS.map(group => (
            <div key={group.title} className={`skill-group glass-card reveal ${group.cls}`}>
              <div className="skill-group-icon">{group.icon}</div>
              <h3>{group.title}</h3>
              <div className="skill-tags">
                {group.tags.map(tag => (
                  <span
                    key={tag.name}
                    className={`tag${tag.hot ? ' tag-hot' : ''}`}
                    style={{ '--skill-level': `${tag.level}%` } as React.CSSProperties}
                    data-percent={`${tag.level}%`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

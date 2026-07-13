// Condensed overview of the 6 skill groups in Skills.tsx, folded into 5 cards.
// Source of truth for every tag/description below: SKILL_GROUPS in ./Skills.tsx

const WIWO_STYLE = `
.wiwo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  margin-top: 8px;
}
.wiwo-card {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wiwo-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm, 7px);
  background: rgba(99, 102, 241, 0.12);
  color: var(--accent);
  flex-shrink: 0;
}
.wiwo-icon svg {
  width: 24px;
  height: 24px;
}
.wiwo-card h3 {
  font-family: var(--font-head);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.wiwo-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.55;
  margin: 0;
  flex-grow: 1;
}
.wiwo-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.wiwo-tag {
  display: inline-block;
  padding: 3px 10px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: 50px;
  font-size: 0.72rem;
  color: var(--accent-2);
  white-space: nowrap;
}
`

interface Card {
  title: string
  description: string
  tags: string[]
  icon: React.ReactNode
}

// Each card condenses one or two SKILL_GROUPS entries from Skills.tsx into a
// single overview card — no tags or facts invented beyond what's listed there.
const CARDS: Card[] = [
  {
    title: 'Robotics & Manipulation',
    description: 'Simulating and controlling robot arms and mobile platforms with ROS2, MoveIt2, and Gazebo/Ignition.',
    tags: ['ROS2', 'MoveIt2', 'Nav2'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="5" y="8" width="14" height="12" rx="2" />
        <circle cx="9.5" cy="13.5" r="1.5" fill="currentColor" /><circle cx="14.5" cy="13.5" r="1.5" fill="currentColor" />
        <path d="M9 17.5h6M12 8V5M10 5h4" /><path d="M3 10.5v3M21 10.5v3" />
      </svg>
    ),
  },
  {
    title: 'Computer Vision',
    description: 'Real-time object detection and localisation with OpenCV, YOLO, HSV segmentation, and TF2 transforms.',
    tags: ['OpenCV', 'YOLO', 'TF2 Transforms'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: 'AI & Deep Learning',
    description: 'Training CNN classifiers with transfer learning in PyTorch and TensorFlow for real-world image data.',
    tags: ['PyTorch', 'TensorFlow', 'CNNs'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 5c-3.9 0-7 3.1-7 7 0 2.2 1 4.2 2.6 5.5L8 20h8l.4-2.5C18 16.2 19 14.2 19 12c0-3.9-3.1-7-7-7z" />
        <path d="M9 11h6M10 14h4M12 5V3" />
      </svg>
    ),
  },
  {
    title: 'Embedded & IoT',
    description: 'Designing PCBs in KiCad and shipping ESP32 firmware for BLE/MQTT connected sensor networks.',
    tags: ['ESP32 (ESP-IDF)', 'KiCad PCB Design', 'BLE / MQTT'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="7" y="7" width="10" height="10" rx="1" />
        <path d="M9 3v4M12 3v4M15 3v4M9 17v4M12 17v4M15 17v4M3 9h4M3 12h4M3 15h4M17 9h4M17 12h4M17 15h4" />
      </svg>
    ),
  },
  {
    title: 'Programming & Tools',
    description: 'Writing Python and C++ day to day, versioned with Git and shipped through Docker and Linux.',
    tags: ['Python', 'C++', 'Git', 'Docker'],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="4" width="20" height="14" rx="2" />
        <path d="M8 14l-3-2.5L8 9M16 9l3 2.5L16 14M12 9l-2 6" /><path d="M1 20h22" />
      </svg>
    ),
  },
]

export default function WhatIWorkOn() {
  return (
    <section id="what-i-work-on" className="section">
      <style>{WIWO_STYLE}</style>
      <div className="container">
        <div className="section-label">Overview / What I Work On</div>
        <h2 className="section-title">Focus Areas</h2>
        <div className="wiwo-grid">
          {CARDS.map(card => (
            <div key={card.title} className="wiwo-card glass-card">
              <div className="wiwo-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="wiwo-tags">
                {card.tags.map(tag => (
                  <span key={tag} className="wiwo-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

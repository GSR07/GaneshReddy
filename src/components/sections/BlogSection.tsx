import { formatDate } from '../../lib/utils'

const POSTS = [
  {
    id: 'franka',
    title: 'Franka Panda Pick & Place — Full ROS2 Build',
    summary: 'Vision-guided pick-and-place pipeline with ROS2, MoveIt2, HSV segmentation, and Ignition Gazebo — from scratch.',
    tags: ['ROS2', 'MoveIt2', 'Gazebo'],
    url: '/franka-pick-and-place-blog.html',
    date: '2025-03-30',
  },
  {
    id: 'nav2',
    title: 'Nav2 + EKF Localisation on TurtleBot3',
    summary: 'Full autonomous navigation stack — LiDAR-IMU sensor fusion SLAM, AMCL localisation, and dynamic obstacle avoidance.',
    tags: ['ROS2', 'Nav2', 'SLAM'],
    url: '/nav2-ekf-blog.html',
    date: '2025-03-28',
  },
  {
    id: 'ble',
    title: 'BLE Indoor Localisation — PCB to Deployment',
    summary: 'KiCad PCB design, ESP32 ESP-IDF firmware, and deployment of a 20-node BLE/RSSI trilateration system.',
    tags: ['ESP32', 'BLE', 'KiCad'],
    url: '/ble.html',
    date: '2025-03-25',
  },
  {
    id: 'yolov8',
    title: 'YOLOv8 on ESP32-CAM',
    summary: 'Running lightweight object detection inference on edge hardware — model quantisation and real-time ESP32 integration.',
    tags: ['YOLO', 'ESP32', 'Edge AI'],
    url: '/yolov8-esp32-blog.html',
    date: '2025-03-20',
  },
]

export default function BlogSection() {
  return (
    <section id="blog" className="section section-alt">
      <div className="container">
        <div className="section-label">07 / Writing</div>
        <h2 className="section-title">Blog</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))', gap: '1.25rem' }}>
          {POSTS.map(post => (
            <a
              key={post.id}
              href={post.url}
              style={{ textDecoration: 'none' }}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className="glass-card blog-list-card"
                style={{ padding: '1.4rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '.5rem' }}
              >
                <div className="project-tags">
                  {post.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
                </div>
                <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.35, color: 'var(--text)', flex: 1 }}>
                  {post.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '.85rem', lineHeight: 1.6 }}>
                  {post.summary}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '.25rem' }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--text-dim)' }}>{formatDate(post.date)}</span>
                  <span style={{ fontSize: '.78rem', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '.25rem' }}>
                    Read
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a href="/blog.html" className="btn-ghost">
            View All Posts →
          </a>
        </div>
      </div>
    </section>
  )
}

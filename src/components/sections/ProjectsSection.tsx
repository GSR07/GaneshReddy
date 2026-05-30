import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../types'

const STATIC_PROJECTS: Project[] = [
  {
    id: 'franka', title: 'Franka Panda — Vision-Guided Pick & Place Simulation',
    description: 'Full ROS2 + MoveIt2 simulation of the Franka Emika Panda 7-DOF robot arm performing autonomous colour-targeted pick-and-place in Ignition Gazebo (Fortress).',
    long_description: 'A custom ColorDetector node processes live camera images using HSV segmentation and TF2 transforms to localise objects in the robot\'s base frame. A GraspManager node dynamically creates/removes fixed joints in Gazebo to reliably attach and release objects — solving the physics engine grasping limitation. Achieved 80–85% grasp success rate and 95–100% colour detection accuracy across 3+ object classes.',
    tags: ['ROS2 Humble','MoveIt2','Ignition Gazebo','OpenCV','TF2','ros2_control','Python','C++'],
    badges: ['Key Highlight','Robotics','Computer Vision','Manipulation'],
    featured: true, sort_order: 1, visual_class: 'pv-franka', video_url: '/franka_video.mp4',
    created_at: '', updated_at: '',
  },
  {
    id: 'amr', title: '5-DOF Robotic Arm — Design to Deployment',
    description: 'Designed and fabricated a 5-DOF robotic arm (SolidWorks, Dynamixel XM430) as the manipulation module of a 300 kg warehouse AGV/AMR. Derived D-H kinematic model, configured MoveIt2 for pick-and-place, and achieved ±5 mm end-effector accuracy.',
    tags: ['ROS2','MoveIt2','SolidWorks','Dynamixel XM430','Gazebo','URDF/Xacro'],
    badges: ['Robotics','Manipulation'], featured: false, sort_order: 2, visual_class: 'pv-robotics',
    created_at: '', updated_at: '',
  },
  {
    id: 'turtlebot', title: 'TurtleBot3 SLAM & Autonomous Navigation',
    description: 'Deployed a full ROS2 navigation stack on TurtleBot3 — LiDAR-IMU sensor fusion SLAM achieving 90–95% map coverage, Nav2 with AMCL localisation attaining 80–90% autonomous waypoint success rate, and dynamic obstacle avoidance in both Gazebo and real-world indoor environments.',
    tags: ['ROS2','Nav2','AMCL','SLAM','LiDAR','IMU'],
    badges: ['Mobile Robotics','SLAM'], featured: false, sort_order: 3, visual_class: 'pv-cv',
    created_at: '', updated_at: '',
  },
  {
    id: 'sort', title: 'Automated Grading & Sorting System',
    description: 'Bachelor\'s thesis: real-time OpenCV image recognition pipeline for automated part sorting achieving 90% classification accuracy at 5–10 items/min. Led the CV module within a 4-person team; integrated detection output with SolidWorks-designed mechanical actuators end-to-end.',
    tags: ['OpenCV','Python','SolidWorks','Automation'],
    badges: ['Computer Vision','Thesis'], featured: false, sort_order: 4, visual_class: 'pv-driver',
    created_at: '', updated_at: '',
  },
  {
    id: 'xray', title: 'Lung Disease Detection from Chest X-rays',
    description: 'CNN-based classifiers (ResNet, VGG) with transfer learning on 5,000 chest X-ray images, achieving 85% diagnostic accuracy across pneumonia and COVID-19 classes.',
    tags: ['PyTorch','TensorFlow','CNNs','Transfer Learning'],
    badges: ['Medical AI','Deep Learning'], featured: false, sort_order: 5, visual_class: 'pv-medical',
    created_at: '', updated_at: '',
  },
  {
    id: 'iot', title: 'BLE Indoor Localisation System',
    description: 'Custom PCB (KiCad) + ESP32 firmware (ESP-IDF) for BLE/RSSI trilateration across 20–30 sensor nodes covering a 50 m indoor area. OTA pipeline reduced deployment time ~25%. MQTT → Azure → Power BI telemetry stack for real-time asset tracking.',
    tags: ['ESP32','BLE / RSSI','KiCad','ESP-IDF','MQTT','Azure'],
    badges: ['IoT','Embedded'], featured: false, sort_order: 6, visual_class: 'pv-iot',
    created_at: '', updated_at: '',
  },
  {
    id: 'dl', title: 'Medical Image Classification Pipeline',
    description: 'End-to-end supervised learning pipeline for medical imaging: dataset curation, quality checks, bias analysis, model training, and failure-case analysis.',
    tags: ['PyTorch','Data Curation','Bias Analysis'],
    badges: ['Medical AI','ML Pipeline'], featured: false, sort_order: 7, visual_class: 'pv-dl',
    created_at: '', updated_at: '',
  },
]

function tiltCard(card: HTMLElement, e: MouseEvent) {
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => tiltCard(card, e)
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [])

  return (
    <div ref={cardRef} className="project-card glass-card reveal">
      <div className={`project-visual ${project.visual_class || ''}`}>
        {project.image_url
          ? <img src={project.image_url} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div className="pv-icon">
            <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M4 20h5l2-8 5-2 2-6" /><circle cx="18" cy="4" r="2" />
              <path d="M7 20c0-1.1.9-2 2-2h5a2 2 0 0 1 0 4H9a2 2 0 0 1-2-2z" />
            </svg>
          </div>
        }
      </div>
      <div className="project-body">
        <div className="project-badges">
          {project.badges.map(b => <span key={b} className="pbadge">{b}</span>)}
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-tags">
          {project.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
        </div>
        {(project.github_url || project.demo_url || project.blog_url) && (
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>GitHub</a>}
            {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>Demo</a>}
            {project.blog_url && <a href={project.blog_url} target="_blank" rel="noreferrer" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>Blog</a>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([])
  const featuredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.from('projects').select('*').order('sort_order').then(({ data }) => {
      setProjects(data && data.length > 0 ? (data as Project[]) : STATIC_PROJECTS)
    }).catch(() => setProjects(STATIC_PROJECTS))
  }, [])

  useEffect(() => {
    const card = featuredRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => tiltCard(card, e)
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [projects])

  const featured = projects.find(p => p.featured) ?? projects[0]
  const grid = projects.filter(p => !p.featured)

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-label">05 / Projects</div>
        <h2 className="section-title">Featured Work</h2>

        {featured && (
          <div ref={featuredRef} className="project-card project-featured glass-card reveal">
            <div className="project-visual pv-franka">
              <div className="pv-franka-content">
                <div className="pv-franka-arm">
                  {featured.video_url
                    ? <video className="pv-franka-video" src={featured.video_url} autoPlay loop muted playsInline aria-label="Project video" />
                    : featured.image_url && <img src={featured.image_url} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                </div>
                <div className="pv-franka-labels">
                  {featured.tags.slice(0, 4).map(t => <span key={t} className="pv-label">{t}</span>)}
                </div>
              </div>
            </div>
            <div className="project-body">
              <div className="project-badges">
                {featured.badges.map(b => (
                  <span key={b} className={`pbadge${b === 'Key Highlight' ? ' pbadge-star' : ''}`}>
                    {b === 'Key Highlight' && (
                      <svg style={{ width: 12, height: 12, verticalAlign: -1, marginRight: 3 }} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    )}
                    {b}
                  </span>
                ))}
              </div>
              <h3>{featured.title}</h3>
              <p className="featured-desc" dangerouslySetInnerHTML={{ __html: featured.long_description || featured.description }} />
              <div className="project-tags">
                {featured.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
              </div>
              {(featured.github_url || featured.demo_url) && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                  {featured.github_url && <a href={featured.github_url} target="_blank" rel="noreferrer" className="btn-ghost">GitHub</a>}
                  {featured.demo_url && <a href={featured.demo_url} target="_blank" rel="noreferrer" className="btn-primary">Demo</a>}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="projects-grid">
          {grid.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/projects" className="btn-ghost">View All Projects →</Link>
        </div>
      </div>
    </section>
  )
}

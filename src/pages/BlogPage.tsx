import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabase'
import type { BlogPost } from '../types'
import { formatDate } from '../lib/utils'
import { PageLoader } from '../components/ui/LoadingSpinner'

const STATIC_POSTS = [
  { id: 'franka-blog', title: 'Franka Panda Pick & Place — Full ROS2 Build', slug: '', summary: 'How I built a vision-guided pick-and-place pipeline using ROS2, MoveIt2, and Ignition Gazebo on the Franka Emika Panda.', tags: ['ROS2','MoveIt2','Gazebo'], published: true, static_url: '/franka-pick-and-place-blog.html', created_at: '2025-03-30' },
  { id: 'nav2-ekf', title: 'Nav2 + EKF Localisation on TurtleBot3', slug: '', summary: 'Full autonomous navigation stack deployment — LiDAR-IMU sensor fusion, SLAM, and AMCL localisation.', tags: ['ROS2','Nav2','SLAM'], published: true, static_url: '/nav2-ekf-blog.html', created_at: '2025-03-28' },
  { id: 'ble-blog', title: 'BLE Indoor Localisation — PCB to Deployment', slug: '', summary: 'Designing a KiCad PCB, writing ESP32 firmware, and deploying a 20-node BLE/RSSI localisation system.', tags: ['ESP32','BLE','KiCad'], published: true, static_url: '/ble.html', created_at: '2025-03-25' },
  { id: 'yolov8', title: 'YOLOv8 on ESP32-CAM', slug: '', summary: 'Running lightweight object detection inference on edge hardware — model quantisation and ESP32 integration.', tags: ['YOLO','ESP32','Edge AI'], published: true, static_url: '/yolov8-esp32-blog.html', created_at: '2025-03-20' },
]

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Blog — Ganesh Reddy'
    supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts((data as BlogPost[]) ?? [])
        setLoading(false)
      }).catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.25rem' }}>
          <div className="section-label">Writing</div>
          <h1 className="section-title" style={{ marginBottom: '2rem' }}>Blog</h1>

          {loading ? <PageLoader /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Supabase-managed posts */}
              {posts.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                    <div className="project-tags" style={{ marginBottom: '0.5rem' }}>
                      {post.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-head)', marginBottom: '0.4rem' }}>{post.title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{post.summary}</p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{formatDate(post.created_at)}</span>
                  </div>
                </Link>
              ))}

              {/* Static legacy posts */}
              {STATIC_POSTS.map(post => (
                <a key={post.id} href={post.static_url} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '1.5rem', transition: 'transform 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = '')}>
                    <div className="project-tags" style={{ marginBottom: '0.5rem' }}>
                      {post.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
                    </div>
                    <h2 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-head)', marginBottom: '0.4rem' }}>{post.title}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.5rem' }}>{post.summary}</p>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{formatDate(post.created_at)}</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

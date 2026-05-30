import { useEffect, useState } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabase'
import type { BlogPost } from '../types'
import { formatDate } from '../lib/utils'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const STATIC_POSTS = [
  {
    id: 'franka-blog',
    title: 'Franka Panda Pick & Place — Full ROS2 Build',
    summary: 'How I built a vision-guided pick-and-place pipeline using ROS2, MoveIt2, and Ignition Gazebo on the Franka Emika Panda.',
    tags: ['ROS2', 'MoveIt2', 'Gazebo'],
    static_url: '/franka-pick-and-place-blog.html',
    created_at: '2025-03-30',
  },
  {
    id: 'nav2-ekf',
    title: 'Nav2 + EKF Localisation on TurtleBot3',
    summary: 'Full autonomous navigation stack deployment — LiDAR-IMU sensor fusion, SLAM, and AMCL localisation.',
    tags: ['ROS2', 'Nav2', 'SLAM'],
    static_url: '/nav2-ekf-blog.html',
    created_at: '2025-03-28',
  },
  {
    id: 'ble-blog',
    title: 'BLE Indoor Localisation — PCB to Deployment',
    summary: 'Designing a KiCad PCB, writing ESP32 firmware, and deploying a 20-node BLE/RSSI localisation system.',
    tags: ['ESP32', 'BLE', 'KiCad'],
    static_url: '/ble.html',
    created_at: '2025-03-25',
  },
  {
    id: 'yolov8',
    title: 'YOLOv8 on ESP32-CAM',
    summary: 'Running lightweight object detection inference on edge hardware — model quantisation and ESP32 integration.',
    tags: ['YOLO', 'ESP32', 'Edge AI'],
    static_url: '/yolov8-esp32-blog.html',
    created_at: '2025-03-20',
  },
]

function PostCard({ href, title, summary, tags, date }: {
  href: string; title: string; summary: string; tags: string[]; date: string
}) {
  return (
    <a href={href} style={{ textDecoration: 'none' }}>
      <div
        className="glass-card blog-list-card"
        style={{ padding: '1.5rem' }}
      >
        <div className="project-tags" style={{ marginBottom: '0.5rem' }}>
          {tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
        </div>
        <h2 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-head)', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '0.5rem' }}>
          {summary}
        </p>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{formatDate(date)}</span>
      </div>
    </a>
  )
}

export default function BlogPage() {
  const [supabasePosts, setSupabasePosts] = useState<BlogPost[]>([])
  const [loadingDB, setLoadingDB] = useState(true)

  useEffect(() => {
    document.title = 'Blog — Ganesh Reddy'
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSupabasePosts((data as BlogPost[]) ?? [])
        setLoadingDB(false)
      })
      .catch(() => setLoadingDB(false))
  }, [])

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div
          className="container"
          style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.25rem' }}
        >
          <div className="section-label">Writing</div>
          <h1 className="section-title" style={{ marginBottom: '2rem' }}>Blog</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Supabase-managed posts — show when loaded */}
            {loadingDB ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                <LoadingSpinner size="sm" /> Loading new posts…
              </div>
            ) : (
              supabasePosts.map(post => (
                <PostCard
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  title={post.title}
                  summary={post.summary ?? ''}
                  tags={post.tags}
                  date={post.created_at}
                />
              ))
            )}

            {/* Static legacy posts — always visible immediately */}
            {STATIC_POSTS.map(post => (
              <PostCard
                key={post.id}
                href={post.static_url}
                title={post.title}
                summary={post.summary}
                tags={post.tags}
                date={post.created_at}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

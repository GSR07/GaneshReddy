import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabase'
import type { Project } from '../types'
import { PageLoader } from '../components/ui/LoadingSpinner'

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return
    supabase.from('projects').select('*').eq('id', id).single().then(({ data }) => {
      if (data) {
        setProject(data as Project)
        document.title = `${(data as Project).title} — Ganesh Reddy`
      } else {
        navigate('/projects', { replace: true })
      }
      setLoading(false)
    }).catch(() => { setLoading(false); navigate('/projects', { replace: true }) })
  }, [id, navigate])

  if (loading) return <><Navbar /><div style={{ paddingTop: 'var(--nav-h)' }}><PageLoader /></div><Footer /></>
  if (!project) return null

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.25rem' }}>
          <Link to="/projects" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '2rem' }}>
            ← Back to Projects
          </Link>

          <div className="project-badges" style={{ marginBottom: '0.75rem' }}>
            {project.badges.map(b => <span key={b} className="pbadge">{b}</span>)}
          </div>
          <h1 className="section-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', marginBottom: '1.5rem' }}>{project.title}</h1>

          {project.video_url ? (
            <video src={project.video_url} controls style={{ width: '100%', borderRadius: 12, marginBottom: '1.5rem' }} />
          ) : project.image_url ? (
            <img src={project.image_url} alt={project.title} style={{ width: '100%', borderRadius: 12, marginBottom: '1.5rem', objectFit: 'cover', maxHeight: 400 }} />
          ) : null}

          <div className="glass-card" style={{ padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
            <div className="project-tags" style={{ marginBottom: '1rem' }}>
              {project.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
            </div>
            <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1rem' }}
              dangerouslySetInnerHTML={{ __html: project.long_description || project.description }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-ghost">View on GitHub</a>}
            {project.demo_url && <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn-primary">Live Demo</a>}
            {project.blog_url && <a href={project.blog_url} target="_blank" rel="noreferrer" className="btn-ghost">Read Blog Post</a>}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

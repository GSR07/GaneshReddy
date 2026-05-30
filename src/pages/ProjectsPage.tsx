import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabase'
import { STATIC_PROJECTS } from '../data/projects'
import type { Project } from '../types'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    document.title = 'Projects — Ganesh Reddy'
    supabase
      .from('projects')
      .select('*')
      .order('sort_order')
      .then(({ data, error }) => {
        if (!error && data && data.length > 0) setProjects(data as Project[])
      })
      .catch(() => {/* keep static */})
  }, [])

  const filtered = filter
    ? projects.filter(p =>
        p.title.toLowerCase().includes(filter.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())) ||
        p.badges.some(b => b.toLowerCase().includes(filter.toLowerCase()))
      )
    : projects

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.25rem' }}>
          <div className="section-label">All Projects</div>
          <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>Project Portfolio</h1>

          <input
            type="text"
            placeholder="Filter by name, tag, or category..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              width: '100%', maxWidth: 420, background: 'var(--surface)',
              border: '1px solid var(--surface-border)', borderRadius: 10,
              padding: '0.6rem 1rem', color: 'var(--text)', fontSize: '0.9rem',
              outline: 'none', fontFamily: 'var(--font-main)', marginBottom: '2rem',
            }}
          />

          <div className="projects-grid">
            {filtered.map(p => (
              <div key={p.id} className="project-card glass-card">
                <div className={`project-visual ${p.visual_class ?? ''}`}>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div className="pv-icon">
                      <svg className="icon-svg" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.3">
                        <path d="M4 20h5l2-8 5-2 2-6" /><circle cx="18" cy="4" r="2" />
                        <path d="M7 20c0-1.1.9-2 2-2h5a2 2 0 0 1 0 4H9a2 2 0 0 1-2-2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="project-body">
                  <div className="project-badges">
                    {p.badges.map(b => <span key={b} className="pbadge">{b}</span>)}
                  </div>
                  <h3>{p.title}</h3>
                  <p style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                  <div className="project-tags" style={{ marginBottom: '0.75rem' }}>
                    {p.tags.slice(0, 5).map(t => <span key={t} className="tag-sm">{t}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Link
                      to={`/projects/${p.id}`}
                      className="btn-primary"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      View Details
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ width: 11, height: 11 }}>
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                    {p.github_url && (
                      <a href={p.github_url} target="_blank" rel="noreferrer"
                        className="btn-ghost" style={{ fontSize: '0.78rem', padding: '0.35rem 0.9rem' }}>
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '2rem 0' }}>
                No projects match "{filter}"
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

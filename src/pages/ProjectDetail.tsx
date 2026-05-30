import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import { supabase } from '../lib/supabase'
import { STATIC_PROJECTS } from '../data/projects'
import type { Project } from '../types'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const MD_STYLE = `
  .md-body { color: var(--text); line-height: 1.8; font-family: var(--font-main); }
  .md-body h1,.md-body h2,.md-body h3,.md-body h4 {
    font-family: var(--font-head); font-weight: 700; margin: 1.75rem 0 0.75rem;
    color: var(--text);
  }
  .md-body h1 { font-size: 1.75rem; }
  .md-body h2 { font-size: 1.35rem; border-bottom: 1px solid var(--surface-border); padding-bottom: 0.4rem; }
  .md-body h3 { font-size: 1.1rem; }
  .md-body p { margin: 0.85rem 0; }
  .md-body ul,.md-body ol { padding-left: 1.5rem; margin: 0.85rem 0; }
  .md-body li { margin: 0.3rem 0; }
  .md-body code {
    background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2);
    border-radius: 4px; padding: 0.15em 0.45em; font-size: 0.85em;
    color: #a5b4fc; font-family: 'Fira Code', 'Consolas', monospace;
  }
  .md-body pre {
    background: rgba(0,0,0,0.4); border: 1px solid var(--surface-border);
    border-radius: 10px; padding: 1.25rem 1.5rem; overflow-x: auto;
    margin: 1.25rem 0;
  }
  .md-body pre code {
    background: none; border: none; padding: 0; color: #e2e8f0;
    font-size: 0.875rem;
  }
  .md-body blockquote {
    border-left: 3px solid var(--accent); margin: 1rem 0;
    padding: 0.5rem 1.25rem; color: var(--text-muted);
    background: var(--surface); border-radius: 0 8px 8px 0;
  }
  .md-body table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
  .md-body th,.md-body td { padding: 0.6rem 1rem; border: 1px solid var(--surface-border); text-align: left; }
  .md-body th { background: var(--surface); font-weight: 600; }
  .md-body img { max-width: 100%; border-radius: 10px; margin: 1rem 0; }
  .md-body a { color: var(--accent); text-decoration: none; }
  .md-body a:hover { text-decoration: underline; }
  .md-body hr { border: none; border-top: 1px solid var(--surface-border); margin: 2rem 0; }
  .md-body strong { color: var(--text); font-weight: 600; }
`

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [markdownContent, setMarkdownContent] = useState<string | null>(null)
  const [mdLoading, setMdLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load project data — try Supabase first, fall back to static
  useEffect(() => {
    if (!id) return
    const staticMatch = STATIC_PROJECTS.find(p => p.id === id)

    supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProject(data as Project)
          document.title = `${(data as Project).title} — Ganesh Reddy`
        } else if (staticMatch) {
          setProject(staticMatch)
          document.title = `${staticMatch.title} — Ganesh Reddy`
        } else {
          navigate('/projects', { replace: true })
        }
        setLoading(false)
      })
      .catch(() => {
        if (staticMatch) {
          setProject(staticMatch)
          document.title = `${staticMatch.title} — Ganesh Reddy`
        } else {
          navigate('/projects', { replace: true })
        }
        setLoading(false)
      })
  }, [id, navigate])

  // Try to load a .md file from public/projects/{id}.md
  useEffect(() => {
    if (!id) return
    fetch(`/projects/${id}.md`)
      .then(res => {
        if (res.ok) return res.text()
        throw new Error('No markdown file')
      })
      .then(text => { setMarkdownContent(text); setMdLoading(false) })
      .catch(() => { setMarkdownContent(null); setMdLoading(false) })
  }, [id])

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ paddingTop: 'var(--nav-h)', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoadingSpinner size="lg" />
        </div>
        <Footer />
      </>
    )
  }

  if (!project) return null

  return (
    <>
      <style>{MD_STYLE}</style>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)' }}>
        <div className="container" style={{ maxWidth: 860, margin: '0 auto', padding: '3rem 1.25rem 5rem' }}>

          {/* Back link */}
          <Link to="/projects"
            style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginBottom: '2rem', opacity: 0.85 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            All Projects
          </Link>

          {/* Badges */}
          <div className="project-badges" style={{ marginBottom: '0.75rem' }}>
            {project.badges.map(b => <span key={b} className="pbadge">{b}</span>)}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-head)', fontWeight: 800,
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', lineHeight: 1.15,
            marginBottom: '1.5rem', color: 'var(--text)',
          }}>
            {project.title}
          </h1>

          {/* Tags */}
          <div className="project-tags" style={{ marginBottom: '1.5rem' }}>
            {project.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
          </div>

          {/* Media */}
          {project.video_url && (
            <video src={project.video_url} controls
              style={{ width: '100%', borderRadius: 12, marginBottom: '2rem', maxHeight: 420 }} />
          )}
          {!project.video_url && project.image_url && (
            <img src={project.image_url} alt={project.title}
              style={{ width: '100%', borderRadius: 12, marginBottom: '2rem', objectFit: 'cover', maxHeight: 420 }} />
          )}

          {/* Markdown content if available */}
          {!mdLoading && markdownContent ? (
            <div className="glass-card md-body" style={{ padding: '2rem 2.5rem', marginBottom: '2rem' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdownContent}
              </ReactMarkdown>
            </div>
          ) : (
            /* Fallback to description when no MD file yet */
            <div className="glass-card" style={{ padding: '2rem 2.5rem', marginBottom: '2rem' }}>
              {!mdLoading && (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.75rem', color: 'var(--text-dim)',
                  background: 'var(--surface)', borderRadius: 6, padding: '0.25rem 0.65rem',
                  marginBottom: '1rem', border: '1px solid var(--surface-border)',
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  Detailed write-up coming soon
                </div>
              )}
              <p style={{ color: 'var(--text)', lineHeight: 1.8, fontSize: '1rem' }}
                dangerouslySetInnerHTML={{ __html: project.long_description ?? project.description }} />
            </div>
          )}

          {/* Action links */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-primary">
                View on GitHub
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn-primary">
                Live Demo
              </a>
            )}
            {project.blog_url && (
              <a href={project.blog_url} target="_blank" rel="noreferrer" className="btn-ghost">
                Read Blog Post
              </a>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

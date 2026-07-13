import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Project } from '../../types'
import { asset } from '../../lib/utils'
import LoadingSpinner from './LoadingSpinner'
import ConceptChips from './ConceptChips'

const MD_STYLE = `
.md-body{color:var(--text);line-height:1.8;font-family:var(--font-main)}
.md-body h1,.md-body h2,.md-body h3{font-family:var(--font-head);font-weight:700;margin:1.5rem 0 .6rem;color:var(--text)}
.md-body h1{font-size:1.6rem}.md-body h2{font-size:1.25rem;border-bottom:1px solid var(--surface-border);padding-bottom:.35rem}.md-body h3{font-size:1.05rem}
.md-body p{margin:.75rem 0}.md-body ul,.md-body ol{padding-left:1.4rem;margin:.75rem 0}.md-body li{margin:.25rem 0}
.md-body code{background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.2);border-radius:4px;padding:.12em .4em;font-size:.84em;color:#a5b4fc;font-family:monospace}
.md-body pre{background:rgba(0,0,0,.4);border:1px solid var(--surface-border);border-radius:10px;padding:1.1rem 1.4rem;overflow-x:auto;margin:1rem 0}
.md-body pre code{background:none;border:none;padding:0;color:#e2e8f0;font-size:.875rem}
.md-body blockquote{border-left:3px solid var(--accent);margin:1rem 0;padding:.4rem 1.1rem;color:var(--text-muted);background:var(--surface);border-radius:0 8px 8px 0}
.md-body table{width:100%;border-collapse:collapse;margin:1rem 0}
.md-body th,.md-body td{padding:.55rem .9rem;border:1px solid var(--surface-border);text-align:left}
.md-body th{background:var(--surface);font-weight:600}
.md-body img{max-width:100%;border-radius:10px;margin:.75rem 0}
.md-body a{color:var(--accent);text-decoration:none}.md-body a:hover{text-decoration:underline}
.md-body hr{border:none;border-top:1px solid var(--surface-border);margin:1.75rem 0}
.md-body strong{color:var(--text);font-weight:600}
`

interface Props { project: Project; onClose: () => void }

export default function ProjectModal({ project, onClose }: Props) {
  const [md, setMd]         = useState<string | null>(null)
  const [mdLoading, setMdL] = useState(true)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    fetch(asset(`/projects/${project.id}.md`))
      .then(r => { if (r.ok) return r.text(); throw new Error('no md') })
      // the SPA fallback serves index.html for missing files, so reject HTML
      .then(t => { setMd(t.trimStart().startsWith('<') ? null : t); setMdL(false) })
      .catch(() => { setMd(null); setMdL(false) })
  }, [project.id])

  return (
    <div
      style={{ position:'fixed',inset:0,zIndex:1000,display:'flex',alignItems:'flex-start',justifyContent:'center',padding:'2rem 1rem',overflowY:'auto' }}
      onClick={onClose}
    >
      <style>{MD_STYLE}</style>
      {/* backdrop */}
      <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.75)',backdropFilter:'blur(6px)' }} />

      {/* panel */}
      <div
        style={{ position:'relative',zIndex:1,width:'100%',maxWidth:800,background:'var(--bg-alt)',border:'1px solid var(--surface-border)',borderRadius:16,overflow:'hidden',animation:'pageEnter .28s ease forwards' }}
        onClick={e => e.stopPropagation()}
      >
        {/* close */}
        <button
          onClick={onClose}
          style={{ position:'absolute',top:16,right:16,zIndex:2,background:'var(--surface)',border:'1px solid var(--surface-border)',borderRadius:8,width:32,height:32,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:16,height:16 }}>
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        {/* media */}
        {project.video_url && (
          <video src={asset(project.video_url)} controls autoPlay muted
            style={{ width:'100%',maxHeight:360,objectFit:'cover',display:'block' }} />
        )}
        {!project.video_url && project.image_url && (
          <img src={asset(project.image_url)} alt={project.title}
            style={{ width:'100%',maxHeight:320,objectFit:'cover',display:'block' }} />
        )}
        {!project.video_url && !project.image_url && project.youtube_id && (
          <iframe
            src={`https://www.youtube.com/embed/${project.youtube_id}?autoplay=1&mute=1&rel=0`}
            title={project.title}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            style={{ width:'100%',aspectRatio:'16/9',border:'none',display:'block' }} />
        )}

        <div style={{ padding:'1.75rem 2rem 2rem' }}>
          {/* badges */}
          <div className="project-badges" style={{ marginBottom:'.6rem' }}>
            {project.badges.map(b => <span key={b} className="pbadge">{b}</span>)}
          </div>

          {/* title */}
          <h2 style={{ fontFamily:'var(--font-head)',fontWeight:800,fontSize:'clamp(1.3rem,3vw,1.8rem)',marginBottom:'.75rem',lineHeight:1.2,color:'var(--text)' }}>
            {project.title}
          </h2>

          {/* tags */}
          <div className="project-tags" style={{ marginBottom:'1rem' }}>
            {project.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
          </div>

          {/* concept links */}
          {project.concepts && project.concepts.length > 0 && (
            <div style={{ marginBottom:'1.25rem' }}>
              <ConceptChips concepts={project.concepts} />
            </div>
          )}

          {/* content */}
          {mdLoading ? (
            <div style={{ display:'flex',justifyContent:'center',padding:'2rem 0' }}>
              <LoadingSpinner size="md" />
            </div>
          ) : md ? (
            <div className="md-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
            </div>
          ) : (
            <div>
              <div style={{ display:'inline-flex',alignItems:'center',gap:'.35rem',fontSize:'.72rem',color:'var(--text-dim)',background:'var(--surface)',borderRadius:6,padding:'.2rem .6rem',marginBottom:'.9rem',border:'1px solid var(--surface-border)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width:11,height:11 }}>
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                Detailed write-up coming soon
              </div>
              <p style={{ color:'var(--text)',lineHeight:1.8 }}
                dangerouslySetInnerHTML={{ __html: project.long_description ?? project.description }} />
            </div>
          )}

          {/* links */}
          <div style={{ display:'flex',gap:'.65rem',flexWrap:'wrap',marginTop:'1.5rem' }}>
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-primary"
                style={{ fontSize:'.85rem',padding:'.45rem 1rem' }}>
                GitHub
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer" className="btn-primary"
                style={{ fontSize:'.85rem',padding:'.45rem 1rem' }}>
                Live Demo
              </a>
            )}
            {project.blog_url && (
              <a href={asset(project.blog_url)} target="_blank" rel="noreferrer" className="btn-ghost"
                style={{ fontSize:'.85rem',padding:'.45rem 1rem' }}>
                Read Blog Post ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

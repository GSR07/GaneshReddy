import { useEffect, useRef, useState } from 'react'
import { STATIC_PROJECTS } from '../../data/projects'
import { asset } from '../../lib/utils'
import type { Project } from '../../types'
import ProjectModal from '../ui/ProjectModal'

function tiltCard(card: HTMLElement, e: MouseEvent) {
  const rect = card.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  card.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: (p: Project) => void }) {
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
      <div className={`project-visual ${project.visual_class ?? ''}`}>
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
        ) : project.video_url ? (
          <video src={asset(project.video_url)} autoPlay loop muted playsInline
            style={{ width:'100%',height:'100%',objectFit:'cover' }} />
        ) : (
          <div className="pv-icon">
            <svg className="icon-svg icon-bob" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M4 20h5l2-8 5-2 2-6"/><circle cx="18" cy="4" r="2"/>
              <path d="M7 20c0-1.1.9-2 2-2h5a2 2 0 0 1 0 4H9a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
        )}
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
        <div style={{ display:'flex',gap:'.5rem',marginTop:'1rem',flexWrap:'wrap',alignItems:'center' }}>
          <button
            onClick={() => onOpen(project)}
            className="btn-primary"
            style={{ fontSize:'.78rem',padding:'.35rem .9rem',cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'.3rem' }}
          >
            View Details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:12,height:12 }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-ghost"
              style={{ fontSize:'.78rem',padding:'.35rem .9rem' }}>GitHub</a>
          )}
          {project.blog_url && (
            <a href={asset(project.blog_url)} target="_blank" rel="noreferrer" className="btn-ghost"
              style={{ fontSize:'.78rem',padding:'.35rem .9rem' }}>Blog Post</a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const [selected, setSelected]     = useState<Project | null>(null)
  const featuredRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = featuredRef.current
    if (!card) return
    const onMove = (e: MouseEvent) => tiltCard(card, e)
    const onLeave = () => { card.style.transform = '' }
    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    return () => { card.removeEventListener('mousemove', onMove); card.removeEventListener('mouseleave', onLeave) }
  }, [])

  const featured = STATIC_PROJECTS.find(p => p.featured) ?? STATIC_PROJECTS[0]
  const grid     = STATIC_PROJECTS.filter(p => p.id !== featured.id)

  return (
    <>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}

      <section id="projects" className="section">
        <div className="container">
          <div className="section-label">05 / Projects</div>
          <h2 className="section-title">Featured Work</h2>

          {featured && (
            <div ref={featuredRef} className="project-card project-featured glass-card reveal">
              <div className="project-visual pv-franka">
                <div className="pv-franka-arm">
                  {featured.video_url ? (
                    <video className="pv-franka-video" src={asset(featured.video_url)} autoPlay loop muted playsInline />
                  ) : featured.image_url ? (
                    <img src={featured.image_url} alt={featured.title} className="pv-franka-video" />
                  ) : null}
                </div>
                <div className="pv-franka-labels">
                  {featured.tags.slice(0,4).map(t => <span key={t} className="pv-label">{t}</span>)}
                </div>
              </div>
              <div className="project-body">
                <div className="project-badges">
                  {featured.badges.map(b => (
                    <span key={b} className={`pbadge${b === 'Key Highlight' ? ' pbadge-star' : ''}`}>
                      {b === 'Key Highlight' && (
                        <svg style={{ width:12,height:12,verticalAlign:-1,marginRight:3 }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      )}{b}
                    </span>
                  ))}
                </div>
                <h3>{featured.title}</h3>
                <p className="featured-desc"
                  dangerouslySetInnerHTML={{ __html: featured.long_description ?? featured.description }} />
                <div className="project-tags" style={{ marginBottom:'1rem' }}>
                  {featured.tags.map(t => <span key={t} className="tag-sm">{t}</span>)}
                </div>
                <div style={{ display:'flex',gap:'.75rem',flexWrap:'wrap',alignItems:'center' }}>
                  <button onClick={() => setSelected(featured)} className="btn-primary"
                    style={{ cursor:'pointer',display:'inline-flex',alignItems:'center',gap:'.4rem' }}>
                    View Details
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width:14,height:14 }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                  {featured.github_url && (
                    <a href={featured.github_url} target="_blank" rel="noreferrer" className="btn-ghost">GitHub</a>
                  )}
                  {featured.blog_url && (
                    <a href={asset(featured.blog_url)} target="_blank" rel="noreferrer" className="btn-ghost">Read Blog</a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="projects-grid">
            {grid.map(p => <ProjectCard key={p.id} project={p} onOpen={setSelected} />)}
          </div>
        </div>
      </section>
    </>
  )
}

import { useEffect, useState } from 'react'
import { asset } from '../../lib/utils'

const HASH_LINKS = [
  { href: '#about',      label: 'About' },
  { href: '#skills',     label: 'Skills' },
  { href: '#education',  label: 'Education' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects',   label: 'Projects' },
]

function smoothTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const offset = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top: offset, behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('')
  const [theme, setTheme]         = useState<'dark'|'light'>(
    () => document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
  )

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = HASH_LINKS.map(l => l.href.slice(1)).concat(['contact'])
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [])

  function handleHashClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault()
    setMenuOpen(false)
    smoothTo(id)
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') document.documentElement.setAttribute('data-theme', 'light')
    else document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', next)
  }

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo" onClick={e => handleHashClick(e, 'hero')}>
        GR<span className="accent">.</span>
      </a>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        {/* Hash scroll links */}
        {HASH_LINKS.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              onClick={e => handleHashClick(e, href.slice(1))}
              style={active === href.slice(1) ? { color: 'var(--accent)' } : undefined}
            >
              {label}
            </a>
          </li>
        ))}

        {/* Blog → opens blog listing page */}
        <li>
          <a href={asset('/blog.html')} onClick={() => setMenuOpen(false)}>
            Blog
          </a>
        </li>

        {/* Concepts → glossary page */}
        <li>
          <a href={asset('/concepts.html')} onClick={() => setMenuOpen(false)}>
            Concepts
          </a>
        </li>

        <li>
          <a href="#contact" className="btn-nav" onClick={e => handleHashClick(e, 'contact')}>
            Contact
          </a>
        </li>
      </ul>

      <div className="nav-controls" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="nav-status-pill">
          <span className="badge-dot" />
          Open to Work
        </span>
        <button
          id="theme-toggle" className="theme-btn" aria-label="Toggle theme"
          onClick={toggleTheme}
          style={{ background: 'transparent', border: 'none', color: 'var(--text)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          {theme === 'dark' ? (
            <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 22, height: 22 }}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <button
          id="hamburger" aria-label="Toggle menu" aria-expanded={menuOpen}
          onClick={() => setMenuOpen(o => !o)} className={menuOpen ? 'open' : ''}
        >
          <span/><span/><span/>
        </button>
      </div>
    </nav>
  )
}

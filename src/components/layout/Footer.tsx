function handleContactClick(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  const el = document.getElementById('contact')
  if (!el) return
  const offset = el.getBoundingClientRect().top + window.scrollY - 64
  window.scrollTo({ top: offset, behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer>
      <p style={{ marginBottom: 8, fontSize: '0.95rem' }}>
        Building something in robotics?{' '}
        <a href="#contact" className="gradient-text" onClick={handleContactClick} style={{ fontWeight: 600 }}>
          Let&apos;s talk →
        </a>
      </p>
      <p>© {new Date().getFullYear()} Ganesh Reddy · Built with precision &amp; purpose</p>
    </footer>
  )
}

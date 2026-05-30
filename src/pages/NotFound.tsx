import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 'var(--nav-h)', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div className="gradient-text" style={{ fontSize: '5rem', fontFamily: 'var(--font-head)', fontWeight: 800, lineHeight: 1 }}>404</div>
        <h2 style={{ fontSize: '1.5rem', margin: '1rem 0 0.5rem', fontFamily: 'var(--font-head)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </>
  )
}

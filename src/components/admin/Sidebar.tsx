import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⬛' },
  { to: '/admin/projects', label: 'Projects', icon: '🗂' },
  { to: '/admin/skills', label: 'Skills', icon: '⚡' },
  { to: '/admin/experience', label: 'Experience', icon: '💼' },
  { to: '/admin/education', label: 'Education', icon: '🎓' },
  { to: '/admin/certificates', label: 'Certificates', icon: '📜' },
  { to: '/admin/messages', label: 'Messages', icon: '✉' },
  { to: '/admin/testimonials', label: 'Testimonials', icon: '💬' },
  { to: '/admin/blog', label: 'Blog Posts', icon: '📝' },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { signOut, user } = useAuth()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
      isActive
        ? 'bg-sky-500/15 text-sky-400 font-medium'
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`

  return (
    <aside className="flex h-full flex-col bg-slate-900 border-r border-slate-800">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 font-bold text-sm font-head">GR</div>
        <div>
          <div className="text-sm font-semibold text-slate-100 font-head">Portfolio Admin</div>
          <div className="text-xs text-slate-500 truncate max-w-[140px]">{user?.email}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 admin-scrollbar">
        {NAV.map(item => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <span className="w-4 text-center" style={{ fontSize: '0.85rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="border-t border-slate-800 mt-3 pt-3">
          <NavLink to="/admin/settings" className={linkClass} onClick={onClose}>
            <span className="w-4 text-center">⚙</span> Settings
          </NavLink>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-slate-800 p-3 space-y-2">
        <NavLink to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <span>←</span> View Portfolio
        </NavLink>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span>⏻</span> Sign Out
        </button>
      </div>
    </aside>
  )
}

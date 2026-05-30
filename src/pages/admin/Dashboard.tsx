import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

interface Stats { projects: number; messages: number; unread: number; testimonials: number; blogPosts: number }

const STAT_CARDS = [
  { key: 'projects', label: 'Projects', to: '/admin/projects', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { key: 'messages', label: 'Messages', to: '/admin/messages', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { key: 'unread', label: 'Unread', to: '/admin/messages', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'testimonials', label: 'Testimonials', to: '/admin/testimonials', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'blogPosts', label: 'Blog Posts', to: '/admin/blog', color: 'text-rose-400', bg: 'bg-rose-500/10' },
]

const QUICK_LINKS = [
  { to: '/admin/projects', label: 'Add Project', desc: 'Publish a new project' },
  { to: '/admin/blog', label: 'Write Post', desc: 'Create a blog entry' },
  { to: '/admin/messages', label: 'Read Messages', desc: 'View contact submissions' },
  { to: '/admin/skills', label: 'Update Skills', desc: 'Keep your tech stack fresh' },
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ projects: 0, messages: 0, unread: 0, testimonials: 0, blogPosts: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('id', { count: 'exact', head: true }).eq('read', false),
      supabase.from('testimonials').select('id', { count: 'exact', head: true }),
      supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    ]).then(([projects, messages, unread, testimonials, blogPosts]) => {
      setStats({
        projects: projects.count ?? 0,
        messages: messages.count ?? 0,
        unread: unread.count ?? 0,
        testimonials: testimonials.count ?? 0,
        blogPosts: blogPosts.count ?? 0,
      })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STAT_CARDS.map(card => (
          <Link key={card.key} to={card.to} className="group rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 transition-colors">
            <div className={`text-2xl font-bold font-head ${card.color} mb-1`}>
              {loading ? '—' : stats[card.key as keyof Stats]}
            </div>
            <div className="text-xs text-slate-500">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.map(link => (
            <Link key={link.to} to={link.to}
              className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group">
              <div className="text-sm font-medium text-slate-200 group-hover:text-sky-400 transition-colors mb-1">{link.label}</div>
              <div className="text-xs text-slate-500">{link.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-500 leading-relaxed">
        <strong className="text-slate-400">Tip:</strong> Changes made here are live on your portfolio immediately after saving.
        The public site fetches data from Supabase on every page load.
      </div>
    </div>
  )
}

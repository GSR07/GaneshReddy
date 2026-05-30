import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const PAGE_TITLES: Record<string, string> = {
  dashboard: 'Dashboard',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  education: 'Education',
  certificates: 'Certificates',
  messages: 'Messages',
  testimonials: 'Testimonials',
  blog: 'Blog Posts',
  settings: 'Settings',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const segment = pathname.split('/').pop() ?? 'dashboard'
  const pageTitle = PAGE_TITLES[segment] ?? 'Admin'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-main">
      {/* Desktop sidebar */}
      <div className="hidden w-56 flex-shrink-0 lg:flex lg:flex-col">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-50 w-56 h-full">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur">
          <button
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-slate-100 font-head">{pageTitle}</h1>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 admin-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

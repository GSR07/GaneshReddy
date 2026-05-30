import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetail from './pages/ProjectDetail'
import BlogPage from './pages/BlogPage'
import NotFound from './pages/NotFound'
import AdminLogin from './pages/admin/AdminLogin'
import Dashboard from './pages/admin/Dashboard'
import ProjectsAdmin from './pages/admin/ProjectsAdmin'
import SkillsAdmin from './pages/admin/SkillsAdmin'
import ExperienceAdmin from './pages/admin/ExperienceAdmin'
import EducationAdmin from './pages/admin/EducationAdmin'
import CertificatesAdmin from './pages/admin/CertificatesAdmin'
import MessagesAdmin from './pages/admin/MessagesAdmin'
import TestimonialsAdmin from './pages/admin/TestimonialsAdmin'
import BlogAdmin from './pages/admin/BlogAdmin'
import Settings from './pages/admin/Settings'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="/blog" element={<BlogPage />} />

      {/* Admin login — no layout */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin — protected with layout */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="education" element={<EducationAdmin />} />
        <Route path="certificates" element={<CertificatesAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="testimonials" element={<TestimonialsAdmin />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

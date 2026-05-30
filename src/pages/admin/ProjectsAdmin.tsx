import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Project } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'

const BLANK: Partial<Project> = {
  title: '', description: '', long_description: '', tags: [], badges: [],
  image_url: '', video_url: '', github_url: '', demo_url: '', blog_url: '',
  featured: false, sort_order: 0, visual_class: '',
}

export default function ProjectsAdmin() {
  const [rows, setRows] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Project>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setRows((data as Project[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setEditing(null); setModalOpen(true) }
  function openEdit(row: Project) { setForm(row); setEditing(row.id); setModalOpen(true) }

  function set(key: keyof Project, val: unknown) {
    setForm(f => ({ ...f, [key]: val }))
  }

  async function handleSave() {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    const { error } = editing
      ? await supabase.from('projects').update(payload).eq('id', editing)
      : await supabase.from('projects').insert([payload])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Project updated' : 'Project created')
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors">
          + Add Project
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title', render: r => <span className="font-medium text-slate-200">{r.title}</span> },
          { key: 'featured', header: 'Featured', width: '80px', render: r => r.featured ? <span className="text-sky-400 text-xs">★ Yes</span> : <span className="text-slate-600 text-xs">—</span> },
          { key: 'tags', header: 'Tags', render: r => <span className="text-slate-400 text-xs">{r.tags.slice(0, 3).join(', ')}{r.tags.length > 3 ? '…' : ''}</span> },
          { key: 'order', header: 'Order', width: '60px', render: r => <span className="text-slate-500 text-xs">{r.sort_order}</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading}
        empty="No projects yet. Click 'Add Project' to create one."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'New Project'} maxWidth="max-w-2xl">
        <div className="space-y-3">
          <FormField label="Title *" value={form.title ?? ''} onChange={e => set('title', e.target.value)} placeholder="Project title" />
          <FormField as="textarea" label="Short description *" value={form.description ?? ''} onChange={e => set('description', e.target.value)} rows={2} />
          <FormField as="textarea" label="Long description (HTML allowed)" value={form.long_description ?? ''} onChange={e => set('long_description', e.target.value)} rows={4} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Tags (comma-separated)" value={(form.tags ?? []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
            <FormField label="Badges (comma-separated)" value={(form.badges ?? []).join(', ')} onChange={e => set('badges', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="GitHub URL" type="url" value={form.github_url ?? ''} onChange={e => set('github_url', e.target.value)} placeholder="https://github.com/..." />
            <FormField label="Demo URL" type="url" value={form.demo_url ?? ''} onChange={e => set('demo_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Blog URL" type="url" value={form.blog_url ?? ''} onChange={e => set('blog_url', e.target.value)} />
            <FormField label="Video URL" type="url" value={form.video_url ?? ''} onChange={e => set('video_url', e.target.value)} placeholder="/franka_video.mp4 or external URL" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Visual class" value={form.visual_class ?? ''} onChange={e => set('visual_class', e.target.value)} placeholder="pv-robotics, pv-cv, pv-iot..." />
            <FormField label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={e => set('sort_order', parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Project image</label>
            <ImageUpload value={form.image_url} onChange={url => set('image_url', url)} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form.featured ?? false} onChange={e => set('featured', e.target.checked)} className="accent-sky-500" />
            Featured project (shown prominently on homepage)
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget} danger
        title="Delete Project" message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

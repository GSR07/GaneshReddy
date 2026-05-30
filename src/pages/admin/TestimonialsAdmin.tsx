import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Testimonial } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'

const BLANK: Partial<Testimonial> = { name: '', role: '', company: '', content: '', image_url: '', featured: false, sort_order: 0 }

export default function TestimonialsAdmin() {
  const [rows, setRows] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Testimonial>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order')
    setRows((data as Testimonial[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setEditing(null); setModalOpen(true) }
  function openEdit(row: Testimonial) { setForm(row); setEditing(row.id); setModalOpen(true) }

  async function handleSave() {
    if (!form.name || !form.content) { toast.error('Name and content are required'); return }
    setSaving(true)
    const { error } = editing
      ? await supabase.from('testimonials').update(form).eq('id', editing)
      : await supabase.from('testimonials').insert([form])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Updated' : 'Created')
    setModalOpen(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  const s = (key: keyof Testimonial, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">+ Add Testimonial</button>
      </div>

      <DataTable
        columns={[
          { key: 'name', header: 'Name', render: r => <span className="font-medium text-slate-200">{r.name}</span> },
          { key: 'role', header: 'Role / Company', render: r => <span className="text-slate-400 text-xs">{[r.role, r.company].filter(Boolean).join(' · ')}</span> },
          { key: 'featured', header: 'Featured', width: '80px', render: r => r.featured ? <span className="text-sky-400 text-xs">★ Yes</span> : <span className="text-slate-600 text-xs">—</span> },
          { key: 'content', header: 'Preview', render: r => <span className="text-slate-500 text-xs truncate">{r.content.slice(0, 60)}…</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No testimonials yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Testimonial' : 'New Testimonial'}>
        <div className="space-y-3">
          <FormField label="Name *" value={form.name ?? ''} onChange={e => s('name', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Role" value={form.role ?? ''} onChange={e => s('role', e.target.value)} placeholder="Professor, Supervisor..." />
            <FormField label="Company / Institution" value={form.company ?? ''} onChange={e => s('company', e.target.value)} />
          </div>
          <FormField as="textarea" rows={4} label="Testimonial *" value={form.content ?? ''} onChange={e => s('content', e.target.value)} />
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Photo</label>
            <ImageUpload value={form.image_url} onChange={url => s('image_url', url)} folder="testimonials" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={e => s('sort_order', parseInt(e.target.value) || 0)} />
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer mt-5">
              <input type="checkbox" checked={form.featured ?? false} onChange={e => s('featured', e.target.checked)} className="accent-sky-500" />
              Featured
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Testimonial"
        message={`Delete testimonial from "${deleteTarget?.name}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

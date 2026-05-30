import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Experience } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import toast from 'react-hot-toast'

const BLANK: Partial<Experience> = { badge: '', badge_type: 'intern', title: '', organization: '', period: '', bullets: [], sort_order: 0 }

export default function ExperienceAdmin() {
  const [rows, setRows] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Experience>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null)
  const [saving, setSaving] = useState(false)
  const [bulletsRaw, setBulletsRaw] = useState('')

  async function load() {
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    setRows((data as Experience[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setBulletsRaw(''); setEditing(null); setModalOpen(true) }
  function openEdit(row: Experience) {
    setForm(row); setBulletsRaw(row.bullets.join('\n')); setEditing(row.id); setModalOpen(true)
  }

  async function handleSave() {
    if (!form.title) { toast.error('Title is required'); return }
    const bullets = bulletsRaw.split('\n').filter(Boolean)
    setSaving(true)
    const payload = { ...form, bullets }
    const { error } = editing
      ? await supabase.from('experience').update(payload).eq('id', editing)
      : await supabase.from('experience').insert([payload])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Updated' : 'Created')
    setModalOpen(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('experience').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  const s = (key: keyof Experience, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">+ Add Experience</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Role', render: r => <span className="font-medium text-slate-200">{r.title}</span> },
          { key: 'org', header: 'Organisation', render: r => <span className="text-slate-400 text-xs">{r.organization}</span> },
          { key: 'period', header: 'Period', width: '160px', render: r => <span className="text-slate-500 text-xs">{r.period}</span> },
          { key: 'badge', header: 'Type', width: '90px', render: r => <span className="text-xs text-slate-400">{r.badge}</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No experience yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Experience' : 'New Experience'}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Job title *" value={form.title ?? ''} onChange={e => s('title', e.target.value)} />
            <FormField label="Badge label" value={form.badge ?? ''} onChange={e => s('badge', e.target.value)} placeholder="Research / Industry / Internship" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Organisation" value={form.organization ?? ''} onChange={e => s('organization', e.target.value)} />
            <FormField label="Period" value={form.period ?? ''} onChange={e => s('period', e.target.value)} placeholder="Jan 2023 – Oct 2023" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Badge type</label>
            <select value={form.badge_type ?? 'intern'} onChange={e => s('badge_type', e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-sky-500 focus:outline-none">
              <option value="research">Research</option>
              <option value="industry">Industry</option>
              <option value="intern">Internship</option>
            </select>
          </div>
          <FormField as="textarea" rows={6} label="Bullet points (one per line, HTML allowed)"
            value={bulletsRaw} onChange={e => setBulletsRaw(e.target.value)} />
          <FormField label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={e => s('sort_order', parseInt(e.target.value) || 0)} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Experience"
        message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

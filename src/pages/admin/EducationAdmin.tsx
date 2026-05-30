import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Education } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import toast from 'react-hot-toast'

const BLANK: Partial<Education> = { degree: '', university: '', location: '', period: '', gpa: '', ects: '', coursework: [], thesis: '', sort_order: 0 }

export default function EducationAdmin() {
  const [rows, setRows] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Education>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null)
  const [saving, setSaving] = useState(false)
  const [courseworkRaw, setCourseworkRaw] = useState('')

  async function load() {
    const { data } = await supabase.from('education').select('*').order('sort_order')
    setRows((data as Education[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setCourseworkRaw(''); setEditing(null); setModalOpen(true) }
  function openEdit(row: Education) {
    setForm(row); setCourseworkRaw(row.coursework.join('\n')); setEditing(row.id); setModalOpen(true)
  }

  async function handleSave() {
    if (!form.degree) { toast.error('Degree is required'); return }
    const coursework = courseworkRaw.split('\n').filter(Boolean)
    setSaving(true)
    const payload = { ...form, coursework }
    const { error } = editing
      ? await supabase.from('education').update(payload).eq('id', editing)
      : await supabase.from('education').insert([payload])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Updated' : 'Created')
    setModalOpen(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('education').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  const s = (key: keyof Education, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">+ Add Education</button>
      </div>

      <DataTable
        columns={[
          { key: 'degree', header: 'Degree', render: r => <span className="font-medium text-slate-200">{r.degree}</span> },
          { key: 'university', header: 'University', render: r => <span className="text-slate-400 text-xs">{r.university}</span> },
          { key: 'period', header: 'Period', width: '160px', render: r => <span className="text-slate-500 text-xs">{r.period}</span> },
          { key: 'gpa', header: 'GPA', width: '60px', render: r => <span className="text-slate-500 text-xs">{r.gpa}</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No education entries yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Education' : 'New Education'}>
        <div className="space-y-3">
          <FormField label="Degree *" value={form.degree ?? ''} onChange={e => s('degree', e.target.value)} placeholder="M.Sc. Autonomy Technologies" />
          <FormField label="University" value={form.university ?? ''} onChange={e => s('university', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Location" value={form.location ?? ''} onChange={e => s('location', e.target.value)} placeholder="Erlangen, Germany" />
            <FormField label="Period" value={form.period ?? ''} onChange={e => s('period', e.target.value)} placeholder="Apr 2024 – Sep 2026" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="GPA" value={form.gpa ?? ''} onChange={e => s('gpa', e.target.value)} placeholder="2.6" />
            <FormField label="ECTS" value={form.ects ?? ''} onChange={e => s('ects', e.target.value)} placeholder="70.0 / 120" />
          </div>
          <FormField label="Thesis" value={form.thesis ?? ''} onChange={e => s('thesis', e.target.value)} />
          <FormField as="textarea" rows={5} label="Coursework (one per line)"
            value={courseworkRaw} onChange={e => setCourseworkRaw(e.target.value)} />
          <FormField label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={e => s('sort_order', parseInt(e.target.value) || 0)} />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Education"
        message={`Delete "${deleteTarget?.degree}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

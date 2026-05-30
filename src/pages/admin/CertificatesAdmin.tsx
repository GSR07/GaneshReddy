import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Certificate } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import toast from 'react-hot-toast'

const BLANK: Partial<Certificate> = { title: '', issuer: '', issue_date: '', credential_url: '', image_url: '' }

export default function CertificatesAdmin() {
  const [rows, setRows] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<Certificate>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false })
    setRows((data as Certificate[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setEditing(null); setModalOpen(true) }
  function openEdit(row: Certificate) { setForm(row); setEditing(row.id); setModalOpen(true) }

  async function handleSave() {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const { error } = editing
      ? await supabase.from('certificates').update(form).eq('id', editing)
      : await supabase.from('certificates').insert([form])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Updated' : 'Created')
    setModalOpen(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('certificates').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  const s = (key: keyof Certificate, val: string) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">+ Add Certificate</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Certificate', render: r => <span className="font-medium text-slate-200">{r.title}</span> },
          { key: 'issuer', header: 'Issuer', render: r => <span className="text-slate-400 text-xs">{r.issuer}</span> },
          { key: 'date', header: 'Date', width: '120px', render: r => <span className="text-slate-500 text-xs">{r.issue_date}</span> },
          { key: 'link', header: 'Link', width: '80px', render: r => r.credential_url ? <a href={r.credential_url} target="_blank" rel="noreferrer" className="text-xs text-sky-400 hover:underline">View</a> : <span className="text-slate-600 text-xs">—</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No certificates yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Certificate' : 'New Certificate'}>
        <div className="space-y-3">
          <FormField label="Certificate title *" value={form.title ?? ''} onChange={e => s('title', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Issuer" value={form.issuer ?? ''} onChange={e => s('issuer', e.target.value)} placeholder="Coursera, Udemy..." />
            <FormField label="Issue date" value={form.issue_date ?? ''} onChange={e => s('issue_date', e.target.value)} placeholder="2024-06" />
          </div>
          <FormField label="Credential URL" type="url" value={form.credential_url ?? ''} onChange={e => s('credential_url', e.target.value)} />
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Certificate image</label>
            <ImageUpload value={form.image_url} onChange={url => setForm(f => ({ ...f, image_url: url }))} folder="certificates" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Certificate"
        message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

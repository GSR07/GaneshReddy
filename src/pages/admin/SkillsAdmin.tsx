import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { SkillGroup } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import toast from 'react-hot-toast'

const BLANK: Partial<SkillGroup> = { category: '', card_class: '', items: [], sort_order: 0 }

export default function SkillsAdmin() {
  const [rows, setRows] = useState<SkillGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<SkillGroup>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SkillGroup | null>(null)
  const [saving, setSaving] = useState(false)
  const [itemsRaw, setItemsRaw] = useState('')

  async function load() {
    const { data } = await supabase.from('skill_groups').select('*').order('sort_order')
    setRows((data as SkillGroup[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setItemsRaw(''); setEditing(null); setModalOpen(true) }
  function openEdit(row: SkillGroup) {
    setForm(row)
    setItemsRaw(row.items.map(i => `${i.name}|${i.level}${i.hot ? '|hot' : ''}`).join('\n'))
    setEditing(row.id)
    setModalOpen(true)
  }

  async function handleSave() {
    if (!form.category) { toast.error('Category is required'); return }
    const items = itemsRaw.split('\n').filter(Boolean).map(line => {
      const [name, levelStr, hotFlag] = line.split('|')
      return { name: name.trim(), level: parseInt(levelStr) || 75, hot: hotFlag?.trim() === 'hot' }
    })
    setSaving(true)
    const payload = { ...form, items }
    const { error } = editing
      ? await supabase.from('skill_groups').update(payload).eq('id', editing)
      : await supabase.from('skill_groups').insert([payload])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Updated' : 'Created')
    setModalOpen(false)
    load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('skill_groups').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors">
          + Add Skill Group
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'category', header: 'Category', render: r => <span className="font-medium text-slate-200">{r.category}</span> },
          { key: 'items', header: 'Skills', render: r => <span className="text-slate-400 text-xs">{r.items.map(i => i.name).slice(0, 4).join(', ')}{r.items.length > 4 ? '…' : ''}</span> },
          { key: 'order', header: 'Order', width: '60px', render: r => <span className="text-slate-500 text-xs">{r.sort_order}</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No skill groups yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Skill Group' : 'New Skill Group'}>
        <div className="space-y-3">
          <FormField label="Category name *" value={form.category ?? ''} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="Robotics & Manipulation" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Card CSS class" value={form.card_class ?? ''} onChange={e => setForm(f => ({ ...f, card_class: e.target.value }))} placeholder="skill-primary" />
            <FormField label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
          </div>
          <FormField
            as="textarea" rows={8}
            label="Skills (one per line: Name|Level|hot)"
            value={itemsRaw}
            onChange={e => setItemsRaw(e.target.value)}
            hint="Example:  ROS2|90|hot   (level 0–100, add |hot for highlighted)"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Skill Group"
        message={`Delete "${deleteTarget?.category}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

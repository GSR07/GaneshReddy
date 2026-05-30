import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { BlogPost } from '../../types'
import DataTable from '../../components/admin/DataTable'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import FormField from '../../components/ui/FormField'
import ImageUpload from '../../components/ui/ImageUpload'
import { slugify, formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

const BLANK: Partial<BlogPost> = { title: '', slug: '', summary: '', content: '', image_url: '', tags: [], published: false }

export default function BlogAdmin() {
  const [rows, setRows] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<BlogPost>>(BLANK)
  const [editing, setEditing] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)
  const [saving, setSaving] = useState(false)

  async function load() {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
    setRows((data as BlogPost[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() { setForm(BLANK); setEditing(null); setModalOpen(true) }
  function openEdit(row: BlogPost) { setForm(row); setEditing(row.id); setModalOpen(true) }

  async function handleSave() {
    if (!form.title || !form.slug) { toast.error('Title and slug are required'); return }
    setSaving(true)
    const payload = { ...form, updated_at: new Date().toISOString() }
    const { error } = editing
      ? await supabase.from('blog_posts').update(payload).eq('id', editing)
      : await supabase.from('blog_posts').insert([payload])
    setSaving(false)
    if (error) { toast.error(error.message); return }
    toast.success(editing ? 'Post updated' : 'Post created')
    setModalOpen(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
  }

  const s = (key: keyof BlogPost, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500">+ New Post</button>
      </div>

      <DataTable
        columns={[
          { key: 'title', header: 'Title', render: r => <span className="font-medium text-slate-200">{r.title}</span> },
          { key: 'published', header: 'Status', width: '90px', render: r => r.published
            ? <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-xs">Published</span>
            : <span className="rounded-full bg-slate-700 text-slate-400 px-2 py-0.5 text-xs">Draft</span>
          },
          { key: 'tags', header: 'Tags', render: r => <span className="text-slate-400 text-xs">{r.tags.join(', ')}</span> },
          { key: 'date', header: 'Date', width: '110px', render: r => <span className="text-slate-500 text-xs">{formatDate(r.created_at)}</span> },
        ]}
        data={rows} keyFn={r => r.id} loading={loading} empty="No blog posts yet."
        onEdit={openEdit} onDelete={r => setDeleteTarget(r)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Post' : 'New Post'} maxWidth="max-w-2xl">
        <div className="space-y-3">
          <FormField label="Title *" value={form.title ?? ''} onChange={e => {
            s('title', e.target.value)
            if (!editing) s('slug', slugify(e.target.value))
          }} />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Slug *" value={form.slug ?? ''} onChange={e => s('slug', e.target.value)} hint="URL-safe, e.g. my-post-title" />
            <FormField label="Tags (comma-separated)" value={(form.tags ?? []).join(', ')} onChange={e => s('tags', e.target.value.split(',').map(t => t.trim()).filter(Boolean))} />
          </div>
          <FormField as="textarea" rows={2} label="Summary" value={form.summary ?? ''} onChange={e => s('summary', e.target.value)} />
          <FormField as="textarea" rows={8} label="Content (HTML)" value={form.content ?? ''} onChange={e => s('content', e.target.value)} hint="Supports full HTML markup" />
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">Cover image</label>
            <ImageUpload value={form.image_url} onChange={url => s('image_url', url)} folder="blog" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
            <input type="checkbox" checked={form.published ?? false} onChange={e => s('published', e.target.checked)} className="accent-sky-500" />
            Published (visible on blog page)
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50">
              {saving ? 'Saving…' : editing ? 'Update' : 'Publish'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} danger title="Delete Post"
        message={`Delete "${deleteTarget?.title}"?`} confirmLabel="Delete"
        onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  )
}

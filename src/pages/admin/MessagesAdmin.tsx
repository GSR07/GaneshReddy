import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { ContactMessage } from '../../types'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatDate } from '../../lib/utils'
import toast from 'react-hot-toast'

export default function MessagesAdmin() {
  const [rows, setRows] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null)

  async function load() {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setRows((data as ContactMessage[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function markRead(msg: ContactMessage) {
    await supabase.from('contact_messages').update({ read: true }).eq('id', msg.id)
    setRows(rows.map(r => r.id === msg.id ? { ...r, read: true } : r))
  }

  async function handleDelete() {
    if (!deleteTarget) return
    const { error } = await supabase.from('contact_messages').delete().eq('id', deleteTarget.id)
    if (error) toast.error(error.message)
    else { toast.success('Deleted'); load() }
    setDeleteTarget(null)
    if (selected?.id === deleteTarget.id) setSelected(null)
  }

  if (loading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-slate-800 animate-pulse" />)}</div>

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* List */}
      <div className="space-y-2">
        {rows.length === 0 && <div className="rounded-xl border border-slate-800 py-16 text-center text-sm text-slate-500">No messages yet.</div>}
        {rows.map(msg => (
          <div
            key={msg.id}
            onClick={() => { setSelected(msg); if (!msg.read) markRead(msg) }}
            className={`cursor-pointer rounded-xl border p-3 transition-colors ${
              selected?.id === msg.id ? 'border-sky-500/50 bg-sky-500/5' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {!msg.read && <span className="h-2 w-2 rounded-full bg-sky-400 flex-shrink-0 mt-1" />}
                <div>
                  <div className="text-sm font-medium text-slate-200">{msg.name}</div>
                  <div className="text-xs text-slate-500">{msg.email}</div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs text-slate-600">{formatDate(msg.created_at)}</div>
                <button
                  onClick={e => { e.stopPropagation(); setDeleteTarget(msg) }}
                  className="text-xs text-red-500 hover:text-red-400 mt-1"
                >Delete</button>
              </div>
            </div>
            {msg.subject && <div className="text-xs text-slate-400 mt-1 truncate">{msg.subject}</div>}
            <div className="text-xs text-slate-500 mt-1 truncate">{msg.message}</div>
          </div>
        ))}
      </div>

      {/* Detail */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
        {selected ? (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-100">{selected.name}</h3>
                <a href={`mailto:${selected.email}`} className="text-sm text-sky-400 hover:underline">{selected.email}</a>
              </div>
              <span className="text-xs text-slate-500">{formatDate(selected.created_at)}</span>
            </div>
            {selected.subject && <div className="text-sm font-medium text-slate-300 mb-3">Re: {selected.subject}</div>}
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap bg-slate-800/40 rounded-lg p-3">{selected.message}</div>
            <a
              href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? 'Your message')}`}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
            >
              Reply via Email
            </a>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-sm py-10">Select a message to read it</div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget} danger title="Delete Message"
        message={`Delete message from "${deleteTarget?.name}"?`}
        confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

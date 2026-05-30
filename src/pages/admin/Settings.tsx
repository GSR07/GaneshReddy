import { FormEvent, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user, updatePassword, updateEmail } = useAuth()
  const [newEmail, setNewEmail] = useState(user?.email ?? '')
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)
  const [savingPw, setSavingPw] = useState(false)

  async function handleEmailChange(e: FormEvent) {
    e.preventDefault()
    if (!newEmail) return
    setSavingEmail(true)
    const { error } = await updateEmail(newEmail)
    setSavingEmail(false)
    if (error) toast.error(error.message)
    else toast.success('Confirmation sent to new email address.')
  }

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { toast.error('Passwords do not match'); return }
    if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setSavingPw(true)
    const { error } = await updatePassword(newPw)
    setSavingPw(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    }
  }

  const fieldCls = 'w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500'

  return (
    <div className="max-w-xl space-y-6">
      {/* Account info */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-1">Account</h2>
        <p className="text-xs text-slate-500 mb-4">Signed in as <span className="text-slate-400">{user?.email}</span></p>

        <form onSubmit={handleEmailChange} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email address</label>
            <input type="email" required value={newEmail} onChange={e => setNewEmail(e.target.value)} className={fieldCls} />
          </div>
          <button type="submit" disabled={savingEmail} className="rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-600 disabled:opacity-50 transition-colors">
            {savingEmail ? 'Sending…' : 'Update Email'}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">New password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Min. 8 characters" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Confirm new password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Repeat password" className={fieldCls} />
          </div>
          <button type="submit" disabled={savingPw} className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:opacity-50 transition-colors">
            {savingPw ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5">
        <h2 className="text-sm font-semibold text-red-400 mb-1">Deployment</h2>
        <p className="text-xs text-slate-500 mb-3">Your portfolio is deployed to Vercel and connected to this Supabase project.</p>
        <div className="text-xs text-slate-500 space-y-1">
          <div>• <strong className="text-slate-400">VITE_SUPABASE_URL</strong> — set in Vercel Environment Variables</div>
          <div>• <strong className="text-slate-400">VITE_SUPABASE_ANON_KEY</strong> — set in Vercel Environment Variables</div>
          <div>• Public site fetches live from Supabase on every load</div>
        </div>
      </div>
    </div>
  )
}

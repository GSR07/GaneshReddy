import { ChangeEvent, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadImageToSupabase, getPublicUrl } from '../../lib/utils'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  value?: string
  onChange: (url: string) => void
  folder?: string
}

export default function ImageUpload({ value, onChange, folder = 'projects' }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const { data, error } = await uploadImageToSupabase(supabase, file, 'portfolio', folder)
    if (error) {
      toast.error('Upload failed: ' + error.message)
    } else if (data) {
      const url = getPublicUrl(supabase, data.path)
      onChange(url)
      toast.success('Image uploaded')
    }
    setUploading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      {value && (
        <img src={value} alt="preview" className="h-32 w-full rounded-lg object-cover border border-slate-700" />
      )}
      <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-600 px-4 py-3 text-sm text-slate-400 hover:border-sky-500 hover:text-sky-400 transition-colors">
        {uploading ? <LoadingSpinner size="sm" /> : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8" />
          </svg>
        )}
        {uploading ? 'Uploading…' : 'Click to upload image'}
        <input type="file" accept="image/*" className="sr-only" onChange={handleFile} disabled={uploading} />
      </label>
      {value && (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Or paste image URL"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-xs text-slate-300 focus:border-sky-500 focus:outline-none"
        />
      )}
    </div>
  )
}

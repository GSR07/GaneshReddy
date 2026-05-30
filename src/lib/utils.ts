export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uploadImageToSupabase(
  supabase: import('@supabase/supabase-js').SupabaseClient,
  file: File,
  bucket = 'portfolio',
  folder = 'projects',
) {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}.${ext}`
  return supabase.storage.from(bucket).upload(path, file, { upsert: true })
}

export function getPublicUrl(
  supabase: import('@supabase/supabase-js').SupabaseClient,
  path: string,
  bucket = 'portfolio',
) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

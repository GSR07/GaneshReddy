// Prefixes root-relative asset paths with the Vite base URL so they
// resolve under GitHub Pages subpath hosting (e.g. /GaneshReddy/).
export function asset(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

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

import { ReactNode } from 'react'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => ReactNode
  width?: string
}

interface Props<T> {
  columns: Column<T>[]
  data: T[]
  keyFn: (row: T) => string
  loading?: boolean
  empty?: string
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

export default function DataTable<T>({ columns, data, keyFn, loading, empty = 'No records yet.', onEdit, onDelete }: Props<T>) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-slate-800/60 animate-pulse" />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 py-16 text-center text-sm text-slate-500">
        {empty}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/80">
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider w-24">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
          {data.map(row => (
            <tr key={keyFn(row)} className="hover:bg-slate-800/40 transition-colors">
              {columns.map(col => (
                <td key={col.key} className="px-4 py-3 text-slate-300">
                  {col.render(row)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="rounded-md px-2 py-1 text-xs text-sky-400 hover:bg-sky-500/10 transition-colors">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="rounded-md px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 transition-colors">
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

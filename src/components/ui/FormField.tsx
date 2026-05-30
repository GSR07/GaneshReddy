import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface BaseProps {
  label: string
  error?: string
  hint?: string
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }
type TextAreaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea'; rows?: number }

type Props = InputProps | TextAreaProps

const fieldClass =
  'w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-colors'

export default function FormField(props: Props) {
  const { label, error, hint, as, ...rest } = props as InputProps & TextAreaProps

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {as === 'textarea' ? (
        <textarea
          className={`${fieldClass} resize-y`}
          rows={(rest as TextAreaProps).rows ?? 3}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input className={fieldClass} {...(rest as InputHTMLAttributes<HTMLInputElement>)} />
      )}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

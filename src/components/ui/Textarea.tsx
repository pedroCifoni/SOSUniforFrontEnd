import { useId, type TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

export function Textarea({ label, className = '', ...rest }: TextareaProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-brand-900">
        {label}
      </label>
      <textarea
        id={id}
        rows={5}
        className={`w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm outline-none placeholder:text-muted focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
        {...rest}
      />
    </div>
  )
}

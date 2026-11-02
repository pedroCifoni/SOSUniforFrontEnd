import { useId, type InputHTMLAttributes, type ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: ReactNode
  trailing?: ReactNode
}

export function Input({ label, icon, trailing, className = '', ...rest }: InputProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-brand-900">
        {label}
      </label>
      <div className="flex h-12 items-center gap-2 rounded-xl border border-line bg-surface px-3 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20">
        {icon && <span className="text-muted">{icon}</span>}
        <input
          id={id}
          className={`h-full min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted ${className}`}
          {...rest}
        />
        {trailing}
      </div>
    </div>
  )
}

import { useId, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: readonly string[]
  placeholder?: string
}

export function Select({ label, options, placeholder, className = '', ...rest }: SelectProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-brand-900">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`h-12 w-full appearance-none rounded-xl border border-line bg-surface px-3 pr-10 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${className}`}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
      </div>
    </div>
  )
}

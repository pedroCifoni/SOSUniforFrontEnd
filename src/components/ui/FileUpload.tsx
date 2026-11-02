import { useEffect, useId, useMemo, type ChangeEvent, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface FileUploadProps {
  label: string
  icon: ReactNode
  texto: string
  accept: string
  multiple?: boolean
  arquivos: File[]
  onChange: (arquivos: File[]) => void
}

export function FileUpload({ label, icon, texto, accept, multiple, arquivos, onChange }: FileUploadProps) {
  const id = useId()

  const previews = useMemo(
    () => arquivos.map((f) => ({ file: f, url: f.type.startsWith('image/') ? URL.createObjectURL(f) : null })),
    [arquivos],
  )

  useEffect(() => () => previews.forEach((p) => p.url && URL.revokeObjectURL(p.url)), [previews])

  function aoSelecionar(e: ChangeEvent<HTMLInputElement>) {
    const novos = Array.from(e.target.files ?? [])
    onChange(multiple ? [...arquivos, ...novos] : novos.slice(0, 1))
    e.target.value = ''
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs font-semibold text-brand-900">{label}</span>
      <label
        htmlFor={id}
        className="flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-500/60 bg-brand-50/40 p-4 text-center text-xs font-semibold text-brand-500 transition hover:bg-brand-50 focus-within:ring-2 focus-within:ring-brand-500/30"
      >
        {icon}
        {texto}
        <input id={id} type="file" accept={accept} multiple={multiple} onChange={aoSelecionar} className="sr-only" />
      </label>

      {previews.length > 0 && (
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {previews.map(({ file, url }, i) => (
            <li key={`${file.name}-${i}`} className="relative overflow-hidden rounded-lg border border-line bg-white">
              {url ? (
                <img src={url} alt={file.name} className="h-20 w-full object-cover" />
              ) : (
                <div className="grid h-20 place-items-center px-2 text-center text-[11px] text-muted">{file.name}</div>
              )}
              <button
                type="button"
                aria-label={`Remover ${file.name}`}
                onClick={() => onChange(arquivos.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

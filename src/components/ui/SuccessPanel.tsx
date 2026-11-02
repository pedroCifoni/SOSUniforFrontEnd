import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface SuccessPanelProps {
  titulo: string
  mensagem: string
  protocolo: string
}

export function SuccessPanel({ titulo, mensagem, protocolo }: SuccessPanelProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center" role="status">
      <CheckCircle2 size={56} className="text-emerald-500" />
      <h2 className="text-xl font-bold text-brand-900">{titulo}</h2>
      <p className="max-w-sm text-sm text-muted">{mensagem}</p>
      <p className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-500">Protocolo {protocolo}</p>
      <div className="mt-4 flex w-full max-w-xs flex-col gap-2">
        <Link
          to="/minhas-ocorrencias"
          className="grid h-12 place-items-center rounded-xl bg-brand-900 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Acompanhar ocorrência
        </Link>
        <Link to="/" className="grid h-12 place-items-center rounded-xl text-sm font-semibold text-brand-900 hover:bg-brand-50">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}

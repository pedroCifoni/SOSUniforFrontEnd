import { STATUS_LABEL, type StatusOcorrencia } from '@/models/ocorrencia'

const styles: Record<StatusOcorrencia, string> = {
  pendente: 'bg-sos-50 text-sos-700',
  em_andamento: 'bg-amber-100 text-amber-700',
  concluido: 'bg-emerald-100 text-emerald-700',
}

export function StatusBadge({ status }: { status: StatusOcorrencia }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  )
}

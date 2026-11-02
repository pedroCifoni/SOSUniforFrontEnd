import type { Ocorrencia, TipoOcorrencia } from '@/models/ocorrencia'
import { dataHora } from '@/utils/format'

const SETOR: Record<TipoOcorrencia, string> = {
  manutencao: 'Divisão de Manutenção',
  sos: 'Central de Segurança',
  denuncia: 'Ouvidoria e Segurança',
}

type Etapa = { titulo: string; detalhe: string; estado: 'feito' | 'atual' | 'pendente' }

// Deriva as etapas a partir do status até o backend expor o histórico real.
function etapas(o: Ocorrencia): Etapa[] {
  const encaminhado = o.status !== 'pendente'
  const concluido = o.status === 'concluido'
  const encaminhadoEm = new Date(new Date(o.criadoEm).getTime() + 78 * 60_000).toISOString()

  return [
    {
      titulo: 'Registrado pelo usuário',
      detalhe: `${dataHora(o.criadoEm)} · Por ${o.solicitante}`,
      estado: 'feito',
    },
    {
      titulo: 'Encaminhado ao setor',
      detalhe: encaminhado ? `${dataHora(encaminhadoEm)} · ${SETOR[o.tipo]}` : 'Aguardando triagem',
      estado: encaminhado ? 'feito' : 'atual',
    },
    {
      titulo: 'Em Atendimento',
      detalhe: o.status === 'em_andamento' ? 'Técnico designado no local' : concluido ? 'Atendimento realizado' : 'Aguardando atendimento',
      estado: concluido ? 'feito' : o.status === 'em_andamento' ? 'atual' : 'pendente',
    },
    {
      titulo: 'Concluído',
      detalhe: concluido ? 'Ocorrência resolvida' : 'Pendente de resolução',
      estado: concluido ? 'feito' : 'pendente',
    },
  ]
}

const ponto = {
  feito: 'bg-emerald-500 border-emerald-500',
  atual: 'bg-brand-500 border-brand-500',
  pendente: 'bg-white border-line',
}

export function Timeline({ ocorrencia }: { ocorrencia: Ocorrencia }) {
  const lista = etapas(ocorrencia)
  return (
    <ol className="mt-4 space-y-0">
      {lista.map((e, i) => (
        <li key={e.titulo} className="relative flex gap-3 pb-4 last:pb-0">
          {i < lista.length - 1 && (
            <span
              aria-hidden
              className={`absolute left-[5px] top-3 h-full w-0.5 ${e.estado === 'feito' ? 'bg-emerald-300' : 'bg-line'}`}
            />
          )}
          <span className={`relative mt-1 size-3 shrink-0 rounded-full border-2 ${ponto[e.estado]}`} />
          <div className="min-w-0">
            <p
              className={`text-sm font-semibold leading-tight ${
                e.estado === 'atual' ? 'text-brand-500' : e.estado === 'pendente' ? 'text-muted' : 'text-brand-900'
              }`}
            >
              {e.titulo}
            </p>
            <p className="text-xs text-muted">{e.detalhe}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

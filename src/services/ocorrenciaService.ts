import { simulateRequest } from '@/api/client'
import { ocorrenciasMock } from '@/mocks/db'
import { notificacaoService } from '@/services/notificacaoService'
import type { NovaOcorrencia, Ocorrencia, StatusOcorrencia } from '@/models/ocorrencia'
import type { Usuario } from '@/models/usuario'

let banco: Ocorrencia[] = [...ocorrenciasMock]

const maisRecentesPrimeiro = (a: Ocorrencia, b: Ocorrencia) => b.criadoEm.localeCompare(a.criadoEm)

export const ocorrenciaService = {
  listar(): Promise<Ocorrencia[]> {
    return simulateRequest(() => [...banco].sort(maisRecentesPrimeiro))
  },

  listarPorAutor(autorId: string): Promise<Ocorrencia[]> {
    return simulateRequest(() => banco.filter((o) => o.autorId === autorId).sort(maisRecentesPrimeiro))
  },

  listarPorResponsavel(responsavelId: string): Promise<Ocorrencia[]> {
    return simulateRequest(() => banco.filter((o) => o.responsavelId === responsavelId).sort(maisRecentesPrimeiro))
  },

  buscarPorId(id: string): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const alvo = banco.find((o) => o.id === id)
      if (!alvo) throw new Error('Ocorrência não encontrada.')
      return alvo
    }, 200)
  },

  criar(dados: NovaOcorrencia, autor: Usuario): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const nova: Ocorrencia = {
        id: crypto.randomUUID(),
        protocolo: `#2026-${String(banco.length + 40).padStart(4, '0')}`,
        status: 'pendente',
        criadoEm: new Date().toISOString(),
        solicitante: dados.anonima ? 'Anônimo' : autor.nome,
        autorId: autor.id,
        ...dados,
      }
      banco = [nova, ...banco]

      const sos = nova.tipo === 'sos'
      const titulo = { sos: 'SOS acionado', manutencao: 'Novo chamado de manutenção', denuncia: 'Nova denúncia' }[nova.tipo]
      notificacaoService.emitir(
        notificacaoService.idsPorPerfil('admin', ...(sos ? (['seguranca'] as const) : [])),
        { tipo: 'criada', titulo, mensagem: sos ? nova.local : `${nova.titulo} · ${nova.protocolo}`, ocorrenciaId: nova.id },
        autor.id,
      )
      return nova
    })
  },

  encaminhar(id: string, responsavelId: string): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const alvo = banco.find((o) => o.id === id)
      if (!alvo) throw new Error('Ocorrência não encontrada.')
      const atualizada = { ...alvo, status: 'em_andamento' as const, responsavelId }
      banco = banco.map((o) => (o.id === id ? atualizada : o))

      notificacaoService.emitir([responsavelId], {
        tipo: 'encaminhada',
        titulo: 'Ocorrência encaminhada para você',
        mensagem: `${atualizada.titulo} · ${atualizada.local}`,
        ocorrenciaId: id,
      })
      notificacaoService.emitir([atualizada.autorId], {
        tipo: 'encaminhada',
        titulo: 'Seu chamado está em andamento',
        mensagem: `${atualizada.protocolo} · ${atualizada.titulo}`,
        ocorrenciaId: id,
      })
      return atualizada
    }, 250)
  },

  atualizarStatus(id: string, status: StatusOcorrencia, porId?: string): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const alvo = banco.find((o) => o.id === id)
      if (!alvo) throw new Error('Ocorrência não encontrada.')
      const atualizada = { ...alvo, status }
      banco = banco.map((o) => (o.id === id ? atualizada : o))

      if (status === 'concluido') {
        const sos = atualizada.tipo === 'sos'
        notificacaoService.emitir(
          [atualizada.autorId, ...notificacaoService.idsPorPerfil('admin')],
          {
            tipo: 'concluida',
            titulo: sos ? 'SOS encerrado' : 'Chamado resolvido',
            mensagem: `${atualizada.protocolo} · ${atualizada.titulo}`,
            ocorrenciaId: id,
          },
          porId,
        )
      }
      return atualizada
    }, 250)
  },
}

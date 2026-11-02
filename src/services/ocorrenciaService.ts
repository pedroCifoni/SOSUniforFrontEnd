import { simulateRequest } from '@/api/client'
import { ocorrenciasMock } from '@/mocks/db'
import type { NovaOcorrencia, Ocorrencia, StatusOcorrencia } from '@/models/ocorrencia'
import type { Usuario } from '@/models/usuario'

// Cópia mutável em memória para os botões funcionarem enquanto não há backend.
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
      return nova
    })
  },

  /** Admin encaminha a ocorrência a um segurança. */
  encaminhar(id: string, responsavelId: string): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const alvo = banco.find((o) => o.id === id)
      if (!alvo) throw new Error('Ocorrência não encontrada.')
      const atualizada = { ...alvo, status: 'em_andamento' as const, responsavelId }
      banco = banco.map((o) => (o.id === id ? atualizada : o))
      return atualizada
    }, 250)
  },

  atualizarStatus(id: string, status: StatusOcorrencia): Promise<Ocorrencia> {
    return simulateRequest(() => {
      const alvo = banco.find((o) => o.id === id)
      if (!alvo) throw new Error('Ocorrência não encontrada.')
      const atualizada = { ...alvo, status }
      banco = banco.map((o) => (o.id === id ? atualizada : o))
      return atualizada
    }, 250)
  },
}

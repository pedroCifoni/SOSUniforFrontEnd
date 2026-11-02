import { useState, type FormEvent } from 'react'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { Select } from '@/components/ui/Select'
import { SuccessPanel } from '@/components/ui/SuccessPanel'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { TIPOS_DENUNCIA } from '@/models/catalogo'
import type { Ocorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { paraAnexo } from '@/utils/anexo'

export function NovaDenunciaPage() {
  const { usuario } = useAuth()
  const toast = useToast()
  const [anonima, setAnonima] = useState(true)
  const [tipo, setTipo] = useState<string>(TIPOS_DENUNCIA[0])
  const [descricao, setDescricao] = useState('')
  const [evidencias, setEvidencias] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)
  const [criada, setCriada] = useState<Ocorrencia | null>(null)

  if (criada) {
    return (
      <SuccessPanel
        titulo="Denúncia registrada!"
        mensagem={
          anonima
            ? 'Seu envio foi anônimo: nenhum dado pessoal foi vinculado à denúncia.'
            : 'A equipe responsável vai analisar o relato com sigilo.'
        }
        protocolo={criada.protocolo}
      />
    )
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!usuario) return
    if (descricao.trim().length < 10) {
      toast.erro('Descreva os fatos com pelo menos 10 caracteres.')
      return
    }
    setEnviando(true)
    try {
      setCriada(
        await ocorrenciaService.criar(
          {
            tipo: 'denuncia',
            titulo: tipo,
            descricao: descricao.trim(),
            local: 'Não informado',
            anonima,
            anexos: evidencias.map(paraAnexo),
          },
          usuario,
        ),
      )
      toast.sucesso('Denúncia registrada com sucesso.')
    } catch {
      toast.erro('Não foi possível registrar a denúncia. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-xl space-y-5" noValidate>
      <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-500/40 bg-brand-50 p-3">
        <div>
          <p className="text-sm font-semibold text-brand-900">Envio Anônimo</p>
          <p className="text-xs text-muted">Seus dados não serão vinculados à denúncia</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={anonima}
          aria-label="Envio anônimo"
          onClick={() => setAnonima((v) => !v)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition ${anonima ? 'bg-brand-500' : 'bg-slate-300'}`}
        >
          <span
            className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${anonima ? 'left-[22px]' : 'left-0.5'}`}
          />
        </button>
      </div>

      <Select label="Tipo de Ocorrência" options={TIPOS_DENUNCIA} value={tipo} onChange={(e) => setTipo(e.target.value)} />

      <Textarea
        label="Descrição dos Fatos"
        placeholder="Informe o máximo de detalhes possível, incluindo horário aproximado, fisionomias ou direção tomada…"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <FileUpload
        label="Anexar Evidência (Fotos/Vídeos)"
        icon={<Upload size={22} />}
        texto="Anexar mídia ou arquivos"
        accept="image/*,video/*"
        multiple
        arquivos={evidencias}
        onChange={setEvidencias}
      />


      <Button type="submit" loading={enviando}>
        Registrar Denúncia
      </Button>
    </form>
  )
}

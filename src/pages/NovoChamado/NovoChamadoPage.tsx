import { useState, type FormEvent } from 'react'
import { Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { Select } from '@/components/ui/Select'
import { SuccessPanel } from '@/components/ui/SuccessPanel'
import { Textarea } from '@/components/ui/Textarea'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { LOCAIS_CAMPUS } from '@/models/catalogo'
import type { Ocorrencia } from '@/models/ocorrencia'
import { ocorrenciaService } from '@/services/ocorrenciaService'
import { paraAnexo } from '@/utils/anexo'

export function NovoChamadoPage() {
  const { usuario } = useAuth()
  const toast = useToast()
  const [local, setLocal] = useState<string>(LOCAIS_CAMPUS[3])
  const [descricao, setDescricao] = useState('')
  const [fotos, setFotos] = useState<File[]>([])
  const [enviando, setEnviando] = useState(false)
  const [criada, setCriada] = useState<Ocorrencia | null>(null)

  if (criada) {
    return (
      <SuccessPanel
        titulo="Chamado enviado!"
        mensagem="A equipe de manutenção recebeu sua solicitação e dará andamento em breve."
        protocolo={criada.protocolo}
      />
    )
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    if (!usuario) return
    if (descricao.trim().length < 10) {
      toast.erro('Descreva o problema com pelo menos 10 caracteres.')
      return
    }
    setEnviando(true)
    try {
      setCriada(
        await ocorrenciaService.criar(
          {
            tipo: 'manutencao',
            titulo: descricao.trim().slice(0, 40),
            descricao: descricao.trim(),
            local,
            anexos: fotos.map(paraAnexo),
          },
          usuario,
        ),
      )
      toast.sucesso('Chamado enviado com sucesso.')
    } catch {
      toast.erro('Não foi possível enviar o chamado. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto max-w-xl space-y-5" noValidate>
      <Select label="Localização no Campus" options={LOCAIS_CAMPUS} value={local} onChange={(e) => setLocal(e.target.value)} />

      <Textarea
        label="Descrição do Problema"
        placeholder="Descreva o que está acontecendo…"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />

      <FileUpload
        label="Anexar Foto (Opcional)"
        icon={<Camera size={22} />}
        texto="Tirar ou carregar foto"
        accept="image/*"
        arquivos={fotos}
        onChange={setFotos}
      />


      <Button type="submit" loading={enviando} className="bg-brand-500 hover:bg-brand-700">
        Enviar Chamado
      </Button>
    </form>
  )
}

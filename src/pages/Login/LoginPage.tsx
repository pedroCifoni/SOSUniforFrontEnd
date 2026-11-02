import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

export function LoginPage() {
  const { usuario, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  if (usuario) return <Navigate to={usuario.perfil === 'admin' ? '/admin' : '/'} replace />

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setCarregando(true)
    try {
      const logado = await login({ email, senha })
      navigate(logado.perfil === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      toast.erro(err instanceof Error ? err.message : 'Não foi possível entrar.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-b from-brand-50 to-surface px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <img src="/unifor-logo-vertical.svg" alt="UNIFOR" className="mb-4 h-20" />
          <h1 className="mt-1 text-2xl font-bold text-brand-900">Central de Reportes</h1>
          <p className="mt-1 text-sm text-muted">Gestão de ocorrências e segurança no campus</p>
        </div>

        <form onSubmit={enviar} className="space-y-4" noValidate>
          <Input
            label="E-mail Institucional"
            type="email"
            autoComplete="username"
            placeholder="nome.sobrenome@unifor.br"
            icon={<Mail size={18} />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type={mostrarSenha ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            trailing={
              <button
                type="button"
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                onClick={() => setMostrarSenha((v) => !v)}
                className="text-muted hover:text-brand-900"
              >
                {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />


          <Button type="submit" loading={carregando} disabled={!email || !senha}>
            Entrar
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-muted">
          Diretoria de Tecnologia da Informação · UNIFOR
        </p>
      </div>
    </div>
  )
}

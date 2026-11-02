import { LogOut, Mail, ShieldCheck, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { PERFIL_LABEL } from '@/models/usuario'
import { iniciais } from '@/utils/format'

export function PerfilPage() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  if (!usuario) return null

  const perfil = PERFIL_LABEL[usuario.perfil]
  const privilegiado = usuario.perfil !== 'usuario'

  function sair() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto max-w-md space-y-5">
      <section className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-6 text-center shadow-sm">
        <span className="grid size-20 place-items-center rounded-full bg-brand-900 text-2xl font-bold text-white">
          {iniciais(usuario.nome)}
        </span>
        <div>
          <h2 className="text-xl font-bold text-brand-900">{usuario.nome}</h2>
          <span
            className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ${
              privilegiado ? 'bg-brand-900 text-white' : 'bg-brand-50 text-brand-500'
            }`}
          >
            {privilegiado ? <ShieldCheck size={12} /> : <User size={12} />}
            {perfil}
          </span>
        </div>
      </section>

      <dl className="divide-y divide-line rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-3 p-4">
          <User size={18} className="text-brand-500" />
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">Nome</dt>
            <dd className="text-sm text-brand-900">{usuario.nome}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <Mail size={18} className="text-brand-500" />
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">E-mail institucional</dt>
            <dd className="text-sm text-brand-900">{usuario.email}</dd>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4">
          <ShieldCheck size={18} className="text-brand-500" />
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted">Perfil de acesso</dt>
            <dd className="text-sm text-brand-900">{perfil}</dd>
          </div>
        </div>
      </dl>

      <button
        onClick={sair}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line text-sm font-semibold text-sos-700 hover:bg-sos-50"
      >
        <LogOut size={18} /> Sair
      </button>
    </div>
  )
}

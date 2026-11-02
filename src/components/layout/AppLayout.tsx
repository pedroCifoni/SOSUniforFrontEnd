import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ClipboardList, Home, LayoutDashboard, LogOut, Menu, ShieldAlert, Wrench, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { iniciais } from '@/utils/format'

const TITULOS: Record<string, string> = {
  '/': 'Central de Reportes',
  '/novo-chamado': 'Novo Chamado',
  '/nova-denuncia': 'Nova Denúncia',
  '/minhas-ocorrencias': 'Minhas Ocorrências',
  '/admin': 'Painel de Monitoramento',
}

export function AppLayout() {
  const { usuario, logout } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [menuAberto, setMenuAberto] = useState(false)

  if (!usuario) return null

  const isHome = pathname === '/'
  const links = [
    { to: '/', label: 'Tela principal', icon: Home },
    { to: '/novo-chamado', label: 'Novo Chamado', icon: Wrench },
    { to: '/nova-denuncia', label: 'Nova Denúncia', icon: ShieldAlert },
    { to: '/minhas-ocorrencias', label: 'Minhas Ocorrências', icon: ClipboardList },
    ...(usuario.perfil === 'admin'
      ? [{ to: '/admin', label: 'Painel de Monitoramento', icon: LayoutDashboard }]
      : []),
  ]

  function sair() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col bg-white shadow-sm md:my-6 md:min-h-[calc(100vh-3rem)] md:overflow-hidden md:rounded-3xl md:border md:border-line">
      <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur">
        {isHome || pathname === '/admin' ? (
          <button
            aria-label="Abrir menu"
            onClick={() => setMenuAberto(true)}
            className="rounded-lg p-2 text-brand-900 hover:bg-brand-50"
          >
            <Menu size={22} />
          </button>
        ) : (
          <button
            aria-label="Voltar"
            onClick={() => navigate(-1)}
            className="rounded-lg p-2 text-brand-900 hover:bg-brand-50"
          >
            <ArrowLeft size={22} />
          </button>
        )}
        <h1 className="flex-1 truncate text-base font-semibold text-brand-900">
          {pathname.startsWith('/sos/') ? 'Emergência SOS' : (TITULOS[pathname] ?? 'Central de Reportes')}
        </h1>
        <span
          title={usuario.nome}
          className="grid size-8 place-items-center rounded-full bg-brand-100 text-xs font-semibold text-brand-500"
        >
          {iniciais(usuario.nome)}
        </span>
      </header>

      <main className="flex-1 px-4 py-5 md:px-8">
        <Outlet />
      </main>

      {menuAberto && (
        <div className="fixed inset-0 z-30 flex" role="dialog" aria-modal="true">
          <nav className="flex w-72 max-w-[85%] flex-col gap-1 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Link to="/" onClick={() => setMenuAberto(false)} className="text-sm font-bold text-brand-900">
                Central de Reportes
              </Link>
              <button aria-label="Fechar menu" onClick={() => setMenuAberto(false)} className="rounded-lg p-1.5 hover:bg-brand-50">
                <X size={20} />
              </button>
            </div>
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end
                onClick={() => setMenuAberto(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-500' : 'text-ink hover:bg-surface'
                  }`
                }
              >
                <Icon size={18} /> {label}
              </NavLink>
            ))}
            <button
              onClick={sair}
              className="mt-auto flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-sos-700 hover:bg-sos-50"
            >
              <LogOut size={18} /> Sair
            </button>
          </nav>
          <button aria-label="Fechar menu" className="flex-1 bg-black/40" onClick={() => setMenuAberto(false)} />
        </div>
      )}
    </div>
  )
}

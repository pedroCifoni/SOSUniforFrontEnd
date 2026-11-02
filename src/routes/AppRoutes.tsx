import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PainelAdminPage } from '@/pages/Admin/PainelAdminPage'
import { UsuariosPage } from '@/pages/Admin/UsuariosPage'
import { HomePage } from '@/pages/Home/HomePage'
import { LoginPage } from '@/pages/Login/LoginPage'
import { MinhasOcorrenciasPage } from '@/pages/MinhasOcorrencias/MinhasOcorrenciasPage'
import { NovaDenunciaPage } from '@/pages/NovaDenuncia/NovaDenunciaPage'
import { PerfilPage } from '@/pages/Perfil/PerfilPage'
import { NovoChamadoPage } from '@/pages/NovoChamado/NovoChamadoPage'
import { SegurancaHomePage } from '@/pages/Home/SegurancaHomePage'
import { SosPage } from '@/pages/Sos/SosPage'
import { useAuth } from '@/hooks/useAuth'
import { ProtectedRoute } from './ProtectedRoute'

function Inicio() {
  const { usuario } = useAuth()
  return usuario?.perfil === 'seguranca' ? <SegurancaHomePage /> : <HomePage />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Inicio />} />
          <Route path="novo-chamado" element={<NovoChamadoPage />} />
          <Route path="nova-denuncia" element={<NovaDenunciaPage />} />
          <Route path="sos/:id" element={<SosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
          <Route path="minhas-ocorrencias" element={<MinhasOcorrenciasPage />} />

          <Route element={<ProtectedRoute perfis={['admin']} />}>
            <Route path="admin" element={<PainelAdminPage />} />
            <Route path="admin/usuarios" element={<UsuariosPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

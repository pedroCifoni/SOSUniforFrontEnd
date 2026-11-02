import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { PainelAdminPage } from '@/pages/Admin/PainelAdminPage'
import { HomePage } from '@/pages/Home/HomePage'
import { LoginPage } from '@/pages/Login/LoginPage'
import { MinhasOcorrenciasPage } from '@/pages/MinhasOcorrencias/MinhasOcorrenciasPage'
import { NovaDenunciaPage } from '@/pages/NovaDenuncia/NovaDenunciaPage'
import { NovoChamadoPage } from '@/pages/NovoChamado/NovoChamadoPage'
import { SosPage } from '@/pages/Sos/SosPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="novo-chamado" element={<NovoChamadoPage />} />
          <Route path="nova-denuncia" element={<NovaDenunciaPage />} />
          <Route path="sos/:id" element={<SosPage />} />
          <Route path="minhas-ocorrencias" element={<MinhasOcorrenciasPage />} />

          <Route element={<ProtectedRoute perfis={['admin']} />}>
            <Route path="admin" element={<PainelAdminPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

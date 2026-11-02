import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthProvider'
import { NotificacoesProvider } from '@/contexts/NotificacoesProvider'
import { ToastProvider } from '@/contexts/ToastProvider'
import { AppRoutes } from '@/routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <NotificacoesProvider>
            <AppRoutes />
          </NotificacoesProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

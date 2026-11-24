import { LoaderCircle } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'

export function AdminRoute() {
  const { isConfigured, isLoading, profile, user } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-fondo-claro" role="status">
        <LoaderCircle aria-hidden="true" className="size-6 animate-spin text-violeta" />
        <span className="ml-3 text-sm text-marino/70">Verificando acceso...</span>
      </main>
    )
  }

  if (!isConfigured || !user) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />
  }

  if (profile?.role !== 'admin') {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}

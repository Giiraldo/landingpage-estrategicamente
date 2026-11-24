import { LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { BrandLogo } from '../BrandLogo'
import { Button, Toast, type ToastVariant } from '../ui'
import { useAuth } from '../../hooks/useAuth'
import { APP_NAME } from '../../lib/constants'
import { cn } from '../../lib/utils'
import { signOut } from '../../services/auth'

const navigation = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/leads', label: 'Prospectos', icon: Users, end: false },
]

interface ToastMessage {
  message: string
  variant: ToastVariant
}

export function AdminLayout() {
  const navigate = useNavigate()
  const { profile, user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Administrador'
  const userInitial = userName.trim().charAt(0).toUpperCase() || 'A'

  const handleSignOut = async () => {
    setIsSigningOut(true)

    try {
      await signOut()
      navigate('/admin/login', { replace: true })
    } catch {
      setToast({
        variant: 'error',
        message: 'No pudimos cerrar la sesión. Inténtalo nuevamente.',
      })
      setIsSigningOut(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-fondo-claro md:flex">
        {isSidebarOpen ? (
          <button
            aria-label="Cerrar navegación"
            className="fixed inset-0 z-40 bg-marino/45 md:hidden"
            type="button"
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-marino px-5 py-5 text-white transition-transform duration-200 md:static md:translate-x-0',
            isSidebarOpen && 'translate-x-0',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <NavLink
              className="inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste"
              to="/"
              onClick={() => setIsSidebarOpen(false)}
            >
              <BrandLogo alt="" aria-hidden="true" className="size-10 shrink-0" variant="mark" />
              <span>
                <span className="block text-[0.65rem] font-extrabold tracking-[0.12em] text-lavanda">ESTRATEGICA</span>
                <span className="mt-0.5 block text-sm font-extrabold tracking-[0.1em] text-white">MENTE</span>
                <span className="mt-1 block text-[0.65rem] font-semibold tracking-[0.14em] text-celeste">ADMIN</span>
              </span>
            </NavLink>
            <button
              aria-label="Cerrar menú"
              className="rounded-md p-1 text-white/75 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste md:hidden"
              type="button"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>

          <nav aria-label="Navegación administrativa" className="mt-10 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste',
                      isActive ? 'bg-white text-marino' : 'text-white/75 hover:bg-white/10 hover:text-white',
                    )
                  }
                  end={item.end}
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon aria-hidden="true" className="size-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">{APP_NAME}</p>
            <Button
              className="mt-4 w-full justify-start text-white hover:bg-white/10 hover:text-white"
              disabled={isSigningOut}
              loading={isSigningOut}
              variant="ghost"
              onClick={() => void handleSignOut()}
            >
              <LogOut aria-hidden="true" className="size-4" />
              Cerrar sesión
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between border-b border-marino/10 bg-fondo-claro/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
              aria-label="Abrir navegación"
              className="rounded-md p-2 text-marino transition hover:bg-violeta/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta md:hidden"
              type="button"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu aria-hidden="true" className="size-5" />
            </button>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-marino">Panel administrativo</p>
              <p className="mt-0.5 text-xs text-marino/55">Gestión de prospectos</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold text-marino">{userName}</p>
                <p className="mt-0.5 text-xs text-marino/55">Administrador</p>
              </div>
              <div
                aria-label={`Avatar de ${userName}`}
                className="flex size-9 items-center justify-center rounded-full bg-violeta text-sm font-extrabold text-white"
                role="img"
              >
                {userInitial}
              </div>
            </div>
          </header>
          <main className="min-w-0 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {toast ? <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} /> : null}
    </>
  )
}

import { Outlet } from 'react-router-dom'

import { Footer } from './Footer'
import { Header } from './Header'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        className="sr-only fixed left-4 top-4 z-[70] rounded-md bg-violeta px-3 py-2 text-sm font-bold text-white focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-celeste"
        href="#main-content"
      >
        Saltar al contenido principal
      </a>
      <Header />
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

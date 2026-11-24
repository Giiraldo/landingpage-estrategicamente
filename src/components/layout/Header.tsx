import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'

import { BrandLogo } from '../BrandLogo'
import { cn } from '../../lib/utils'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/cotizacion', label: 'Contacto' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-marino/10 bg-fondo-claro/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <NavLink
          aria-label="ESTRATEGICAMENTE, inicio"
          className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          <BrandLogo alt="" aria-hidden="true" className="size-9 shrink-0" variant="mark" />
          <span className="flex flex-col leading-none">
            <span className="text-[0.62rem] font-extrabold tracking-[0.12em] text-lavanda">ESTRATEGICA</span>
            <span className="mt-0.5 text-sm font-extrabold tracking-[0.1em] text-marino">MENTE</span>
          </span>
        </NavLink>

        <button
          aria-controls="public-navigation"
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          className="inline-flex rounded-md p-2 text-marino transition hover:bg-violeta/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta md:hidden"
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        </button>

        <nav
          aria-label="Navegación principal"
          className={cn(
            'w-full flex-col gap-1 border-t border-marino/10 pt-3 text-sm font-semibold md:w-auto md:flex-row md:items-center md:gap-1 md:border-t-0 md:pt-0',
            isMenuOpen ? 'flex' : 'hidden md:flex',
          )}
          id="public-navigation"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta',
                  isActive ? 'bg-violeta/10 text-violeta' : 'text-marino/75 hover:bg-violeta/10 hover:text-violeta',
                )
              }
              end={link.to === '/'}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            className="mt-2 rounded-lg bg-marino px-3 py-2 text-center text-white transition-colors hover:bg-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta focus-visible:ring-offset-2 md:ml-2 md:mt-0"
            to="/cotizacion"
            onClick={() => setIsMenuOpen(false)}
          >
            Solicitar cotización
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

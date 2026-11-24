import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { BrandLogo } from '../BrandLogo'
import { whatsappQuoteUrl } from '../../lib/offerings'

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/estrategicamente' },
  { label: 'Instagram', href: 'https://www.instagram.com/estrategicamente' },
]

const copyrightYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="bg-marino text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo alt="" aria-hidden="true" className="size-12 shrink-0" variant="mark" />
            <p className="leading-none">
              <span className="block text-xs font-extrabold tracking-[0.14em] text-lavanda">ESTRATEGICA</span>
              <span className="mt-1 block text-lg font-extrabold tracking-[0.1em] text-white">MENTE</span>
            </p>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
            Estrategia, tecnología y soluciones digitales para construir crecimiento con dirección.
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold text-celeste">Contacto</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <Link
              className="text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste"
              to="/cotizacion"
            >
              Solicitar cotización
            </Link>
            <a
              className="inline-flex items-center gap-2 text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste"
              href={whatsappQuoteUrl}
              rel="noreferrer"
              target="_blank"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-bold text-celeste">Redes</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            {socialLinks.map((socialLink) => (
              <a
                key={socialLink.label}
                className="text-white/75 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste"
                href={socialLink.href}
                rel="noreferrer"
                target="_blank"
              >
                {socialLink.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/55 sm:px-6 lg:px-8">
        © {copyrightYear} ESTRATEGICAMENTE. Todos los derechos reservados.
      </div>
    </footer>
  )
}

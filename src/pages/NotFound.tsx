import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-violeta">Error 404</p>
        <h1 className="mt-4 text-4xl font-extrabold text-marino sm:text-5xl">Esta ruta no forma parte del plan.</h1>
        <p className="mt-5 text-base leading-7 text-marino/65">
          La página que buscas no existe o cambió de dirección. Volvamos a un lugar con más claridad.
        </p>
        <Link
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-violeta px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-lavanda focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta focus-visible:ring-offset-2"
          to="/"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Volver al inicio
        </Link>
      </div>
    </section>
  )
}

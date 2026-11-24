import { ArrowRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '../../components/ui'
import { publicServices } from '../../lib/offerings'

export default function Services() {
  return (
    <div>
      <section className="bg-marino px-4 py-16 text-white sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-celeste">Servicios</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Capacidades conectadas para hacer que tu crecimiento tenga mejor ritmo.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Combinamos estrategia, creatividad y tecnología para transformar iniciativas dispersas en un sistema que aprende.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          {publicServices.map((service, index) => {
            const Icon = service.icon

            return (
              <Card
                key={service.name}
                className="grid gap-7 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.8fr)] md:items-start"
                padding="lg"
                variant={index === 1 ? 'elevated' : 'outlined'}
              >
                <div className="inline-flex size-12 items-center justify-center rounded-lg bg-violeta/10 text-violeta">
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-marino">{service.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-marino/65">{service.description}</p>
                  <Link
                    className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg bg-marino px-4 py-2 text-sm font-extrabold text-white transition hover:bg-violeta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta focus-visible:ring-offset-2"
                    to={`/cotizacion?service=${encodeURIComponent(service.name)}`}
                  >
                    Solicitar este servicio
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </div>
                <div className="border-t border-marino/10 pt-5 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                  <h3 className="text-sm font-extrabold uppercase tracking-[0.16em] text-violeta">Incluye</h3>
                  <ul className="mt-4 space-y-3">
                    {service.benefits.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-sm leading-6 text-marino/75">
                        <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-azul" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}

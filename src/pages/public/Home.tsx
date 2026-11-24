import { ArrowRight, BarChart3, CheckCircle2, Quote, ShieldCheck, Target, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Card } from '../../components/ui'
import { publicServices } from '../../lib/offerings'

const benefits = [
  {
    icon: Target,
    title: 'Dirección antes de ejecución',
    description: 'Cada decisión digital parte de un objetivo de negocio concreto.',
  },
  {
    icon: Zap,
    title: 'Velocidad con criterio',
    description: 'Convertimos ideas en experimentos accionables y medibles.',
  },
  {
    icon: BarChart3,
    title: 'Datos que orientan',
    description: 'Medimos lo que importa para iterar con claridad.',
  },
  {
    icon: ShieldCheck,
    title: 'Procesos que escalan',
    description: 'Diseñamos sistemas que sostienen el crecimiento del equipo.',
  },
]

const testimonials = [
  {
    quote: 'El equipo encontró el punto de unión entre nuestro mensaje, proceso comercial y producto digital.',
    name: 'María R.',
    company: 'Empresa demo, servicios B2B',
  },
  {
    quote: 'Pasamos de campañas aisladas a un sistema que entiende qué oportunidad necesita cada conversación.',
    name: 'Julián P.',
    company: 'Empresa demo, tecnología',
  },
  {
    quote: 'La claridad estratégica nos permitió priorizar y dejar de invertir esfuerzos en iniciativas sin impacto.',
    name: 'Carla M.',
    company: 'Empresa demo, consultoría',
  },
]

export default function Home() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-marino px-4 py-20 text-white sm:px-6 sm:py-28 lg:px-8">
        <div aria-hidden="true" className="absolute -right-32 -top-28 size-[28rem] rounded-full bg-violeta/35 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-40 left-1/3 size-[24rem] rounded-full bg-celeste/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-celeste sm:text-sm">Digital Growth</p>
            <h1 className="mt-5 break-words text-[clamp(1.5rem,7.5vw,2rem)] font-extrabold leading-[1.04] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              ESTRATEGICAMENTE.
              <span className="block text-lavanda">DIGITAL GROWTH</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80 sm:text-xl">
              Estrategia, tecnología y soluciones digitales para impulsar empresas.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-violeta px-5 py-3 text-sm font-extrabold text-white transition hover:bg-lavanda focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste focus-visible:ring-offset-2 focus-visible:ring-offset-marino"
                to="/cotizacion"
              >
                Solicitar cotización
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <Link
                className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste"
                to="/servicios"
              >
                Conocer servicios
              </Link>
            </div>
          </div>
          <div className="mt-14 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 sm:grid-cols-3">
            {['Estrategia conectada', 'Tecnología útil', 'Crecimiento medible'].map((item) => (
              <p key={item} className="bg-marino/65 px-5 py-4 text-sm font-bold text-white/85">
                {item}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violeta">Soluciones digitales</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-marino sm:text-4xl">
                Diseñamos el sistema que sostiene tu próxima etapa de crecimiento.
              </h2>
            </div>
            <Link
              className="inline-flex items-center gap-2 self-start text-sm font-extrabold text-violeta transition hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta md:self-auto"
              to="/servicios"
            >
              Ver todos los servicios
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {publicServices.map((service) => {
              const Icon = service.icon

              return (
                <Card key={service.name} className="group flex h-full flex-col" variant="outlined">
                  <div className="inline-flex size-12 items-center justify-center rounded-lg bg-violeta/10 text-violeta transition group-hover:bg-violeta group-hover:text-white">
                    <Icon aria-hidden="true" className="size-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-marino">{service.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-marino/65">{service.description}</p>
                  <Link
                    className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-violeta transition hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta"
                    to={`/cotizacion?service=${encodeURIComponent(service.name)}`}
                  >
                    Solicitar este servicio
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-marino/10 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violeta">Cómo trabajamos</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-marino">Menos intuición aislada. Más decisiones conectadas.</h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article key={benefit.title} className="flex gap-4">
                  <div className="shrink-0 rounded-lg bg-azul/10 p-3 text-azul">
                    <Icon aria-hidden="true" className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-marino">{benefit.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-marino/65">{benefit.description}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violeta">Perspectivas de demo</p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-marino">Lo que podría cambiar cuando todo empieza a conversar.</h2>
          </div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="flex h-full flex-col" variant="default">
                <Quote aria-hidden="true" className="size-7 text-celeste" />
                <blockquote className="mt-5 text-base font-semibold leading-7 text-marino">“{testimonial.quote}”</blockquote>
                <div className="mt-7 border-t border-marino/10 pt-4">
                  <p className="text-sm font-extrabold text-marino">{testimonial.name}</p>
                  <p className="mt-1 text-xs text-marino/60">{testimonial.company}</p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-wide text-violeta">Testimonio ficticio de demostración</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-2xl bg-violeta px-6 py-12 text-white sm:px-10 sm:py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-sm font-bold text-celeste">
              <CheckCircle2 aria-hidden="true" className="size-5" />
              Empecemos con una conversación clara
            </div>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl">¿Listo para captar más clientes?</h2>
            <p className="mt-4 text-base leading-7 text-white/80">
              Cuéntanos qué quieres construir. Te ayudaremos a encontrar el siguiente paso con mayor impacto.
            </p>
            <Link
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-extrabold text-marino transition hover:bg-fondo-claro focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celeste focus-visible:ring-offset-2 focus-visible:ring-offset-violeta"
              to="/cotizacion"
            >
              Solicitar cotización
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

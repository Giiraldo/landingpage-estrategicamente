import { ArrowRight, BarChart3, CircleCheck, Clock3, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge, Card, EmptyState, Skeleton, Table, type TableColumn } from '../../components/ui'
import { useLeads } from '../../hooks/useLeads'
import { LEAD_STATUS_LABELS } from '../../lib/constants'
import type { Lead, LeadStatus } from '../../types'

const currentWeekStart = (() => {
  const date = new Date()
  const day = date.getDay()
  const daysSinceMonday = day === 0 ? 6 : day - 1

  date.setDate(date.getDate() - daysSinceMonday)
  date.setHours(0, 0, 0, 0)

  return date.toISOString()
})()

const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' })

const recentLeadColumns: TableColumn<Lead>[] = [
  {
    key: 'full_name',
    label: 'Prospecto',
    render: (_value, lead) => (
      <div>
        <p className="font-semibold text-marino">{lead.full_name}</p>
        <p className="mt-0.5 text-xs text-marino/60">{lead.email}</p>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Estado',
    render: (_value, lead) => <Badge variant={lead.status}>{LEAD_STATUS_LABELS[lead.status]}</Badge>,
  },
  {
    key: 'created_at',
    label: 'Fecha',
    render: (_value, lead) => <span className="whitespace-nowrap text-marino/70">{dateFormatter.format(new Date(lead.created_at))}</span>,
  },
]

function DashboardSkeleton() {
  return (
    <section aria-busy="true" aria-label="Cargando panel" className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-9 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-32 w-full" variant="rectangular" />
        <Skeleton className="h-32 w-full" variant="rectangular" />
        <Skeleton className="h-32 w-full" variant="rectangular" />
        <Skeleton className="h-32 w-full" variant="rectangular" />
      </div>
      <Skeleton className="h-80 w-full" variant="rectangular" />
    </section>
  )
}

export default function Dashboard() {
  const newQuery = useLeads({ status: 'new', page: 1, pageSize: 1 })
  const newThisWeekQuery = useLeads({ status: 'new', created_after: currentWeekStart, page: 1, pageSize: 1 })
  const contactedQuery = useLeads({ status: 'contacted', page: 1, pageSize: 1 })
  const quotedQuery = useLeads({ status: 'quoted', page: 1, pageSize: 1 })
  const closedQuery = useLeads({ status: 'closed', page: 1, pageSize: 1 })
  const lostQuery = useLeads({ status: 'lost', page: 1, pageSize: 1 })
  const recentLeadsQuery = useLeads({ page: 1, pageSize: 5 })

  const allQueries = [
    newQuery,
    newThisWeekQuery,
    contactedQuery,
    quotedQuery,
    closedQuery,
    lostQuery,
    recentLeadsQuery,
  ]
  const isLoading = allQueries.some((query) => query.isLoading)
  const isError = allQueries.some((query) => query.isError)

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (isError) {
    return (
      <EmptyState
        description="No pudimos cargar los indicadores. Revisa la conexión y los permisos de Supabase."
        title="El panel no está disponible"
      />
    )
  }

  const statusCounts: Record<LeadStatus, number> = {
    new: newQuery.data?.count ?? 0,
    contacted: contactedQuery.data?.count ?? 0,
    quoted: quotedQuery.data?.count ?? 0,
    closed: closedQuery.data?.count ?? 0,
    lost: lostQuery.data?.count ?? 0,
  }
  const inProgressCount = statusCounts.contacted + statusCounts.quoted
  const maxStatusCount = Math.max(...Object.values(statusCounts), 1)
  const metrics = [
    { label: 'Total prospectos', value: recentLeadsQuery.data?.count ?? 0, icon: Users, tone: 'text-azul' },
    { label: 'Nuevos esta semana', value: newThisWeekQuery.data?.count ?? 0, icon: BarChart3, tone: 'text-violeta' },
    { label: 'En proceso', value: inProgressCount, icon: Clock3, tone: 'text-celeste' },
    { label: 'Cerrados', value: statusCounts.closed, icon: CircleCheck, tone: 'text-lavanda' },
  ]
  const chartItems: Array<{ status: LeadStatus; className: string }> = [
    { status: 'new', className: 'bg-azul' },
    { status: 'contacted', className: 'bg-violeta' },
    { status: 'quoted', className: 'bg-celeste' },
    { status: 'closed', className: 'bg-lavanda' },
    { status: 'lost', className: 'bg-marino/45' },
  ]
  const recentLeads = recentLeadsQuery.data?.data ?? []

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violeta">Dashboard</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-marino">Pulso comercial</h1>
        </div>
        <p className="text-sm text-marino/60">Indicadores actualizados desde tu base de prospectos.</p>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon

          return (
            <Card key={metric.label} className="p-5" variant="default">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-marino/65">{metric.label}</p>
                <Icon aria-hidden="true" className={`size-5 ${metric.tone}`} />
              </div>
              <p className="mt-5 text-3xl font-extrabold text-marino">{metric.value}</p>
            </Card>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card variant="outlined">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violeta/10 p-2 text-violeta">
              <BarChart3 aria-hidden="true" className="size-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-marino">Prospectos por estado</h2>
              <p className="mt-1 text-sm text-marino/60">Distribución actual del embudo.</p>
            </div>
          </div>
          <div aria-label="Gráfico de prospectos por estado" className="mt-7 space-y-5" role="img">
            {chartItems.map((item) => {
              const count = statusCounts[item.status]
              const width = `${(count / maxStatusCount) * 100}%`

              return (
                <div key={item.status}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-marino">{LEAD_STATUS_LABELS[item.status]}</span>
                    <span className="text-marino/60">{count}</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-marino/10">
                    <div className={`h-full rounded-full ${item.className}`} style={{ width }} />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card padding="none" variant="outlined">
          <div className="flex flex-col gap-3 border-b border-marino/10 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-extrabold text-marino">Últimos prospectos</h2>
              <p className="mt-1 text-sm text-marino/60">Las cinco oportunidades más recientes.</p>
            </div>
            <Link
              className="inline-flex items-center gap-2 self-start text-sm font-extrabold text-violeta transition hover:text-marino focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violeta sm:self-auto"
              to="/admin/leads"
            >
              Ver todos
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
          <div className="p-5">
            <Table columns={recentLeadColumns} data={recentLeads} emptyMessage="Aún no hay prospectos registrados." />
          </div>
        </Card>
      </div>
    </section>
  )
}

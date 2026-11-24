import { ChevronLeft, ChevronRight, FileText, MessageSquarePlus } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'

import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Modal,
  Select,
  Skeleton,
  Table,
  Textarea,
  Toast,
  type TableColumn,
  type ToastVariant,
} from '../../components/ui'
import { useAddLeadActivity, useLead, useLeads, useUpdateLeadStatus } from '../../hooks/useLeads'
import { useAuth } from '../../hooks/useAuth'
import { LEAD_STATUS_LABELS, LEAD_STATUSES } from '../../lib/constants'
import { isSupabaseConfigured } from '../../services/supabase'
import type { Lead, LeadActivityType, LeadStatus } from '../../types'

const PAGE_SIZE = 20
const dateFormatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeStyle: 'short' })

const statusOptions = LEAD_STATUSES.map((status) => ({
  value: status,
  label: LEAD_STATUS_LABELS[status],
}))

const filterStatusOptions = [{ value: 'all', label: 'Todos los estados' }, ...statusOptions]

const activityTypeLabels: Record<LeadActivityType, string> = {
  status_change: 'Cambio de estado',
  note: 'Nota interna',
  email_sent: 'Email enviado',
  call: 'Llamada',
  meeting: 'Reunión',
}

interface ToastMessage {
  message: string
  variant: ToastVariant
}

interface LeadDetailModalProps {
  leadId: string | null
  onClose: () => void
  userId: string | null
}

function LeadsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando prospectos" className="space-y-3" role="status">
      <Skeleton className="h-16 w-full" variant="rectangular" />
      <Skeleton className="h-16 w-full" variant="rectangular" />
      <Skeleton className="h-16 w-full" variant="rectangular" />
      <Skeleton className="h-16 w-full" variant="rectangular" />
    </div>
  )
}

function LeadDetailModal({ leadId, onClose, userId }: LeadDetailModalProps) {
  const [note, setNote] = useState('')
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const leadQuery = useLead(leadId)
  const addLeadActivityMutation = useAddLeadActivity()
  const lead = leadQuery.data

  const handleAddNote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!leadId || !note.trim() || !userId) {
      return
    }

    try {
      await addLeadActivityMutation.mutateAsync({
        lead_id: leadId,
        user_id: userId,
        activity_type: 'note',
        description: note.trim(),
      })
      setNote('')
      setToast({ variant: 'success', message: 'La nota fue agregada al historial.' })
    } catch {
      setToast({ variant: 'error', message: 'No pudimos agregar la nota. Inténtalo nuevamente.' })
    }
  }

  return (
    <>
      <Modal
        isOpen={leadId !== null}
        size="lg"
        title={lead?.full_name ?? 'Detalle del prospecto'}
        onClose={onClose}
      >
        {leadQuery.isLoading ? (
          <div aria-busy="true" className="space-y-4" role="status">
            <Skeleton className="h-24 w-full" variant="rectangular" />
            <Skeleton className="h-40 w-full" variant="rectangular" />
          </div>
        ) : null}

        {leadQuery.isError || (!leadQuery.isLoading && !lead) ? (
          <EmptyState
            description="No pudimos recuperar el detalle de este prospecto."
            title="Detalle no disponible"
          />
        ) : null}

        {lead ? (
          <div className="space-y-7">
            <div className="rounded-xl bg-fondo-claro p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-extrabold text-marino">{lead.full_name}</p>
                  <p className="mt-1 text-sm text-marino/65">{lead.email}</p>
                </div>
                <Badge variant={lead.status}>{LEAD_STATUS_LABELS[lead.status]}</Badge>
              </div>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-bold text-marino/55">Teléfono</dt>
                  <dd className="mt-1 text-marino">{lead.phone || 'Sin teléfono'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-marino/55">Empresa</dt>
                  <dd className="mt-1 text-marino">{lead.company || 'Sin empresa'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-marino/55">Servicio de interés</dt>
                  <dd className="mt-1 text-marino">{lead.service_interest || 'Sin especificar'}</dd>
                </div>
                <div>
                  <dt className="font-bold text-marino/55">Origen</dt>
                  <dd className="mt-1 capitalize text-marino">{lead.source}</dd>
                </div>
                <div>
                  <dt className="font-bold text-marino/55">Prioridad</dt>
                  <dd className="mt-1 capitalize text-marino">{lead.priority}</dd>
                </div>
                <div>
                  <dt className="font-bold text-marino/55">Fecha de ingreso</dt>
                  <dd className="mt-1 text-marino">{dateFormatter.format(new Date(lead.created_at))}</dd>
                </div>
              </dl>
            </div>

            {lead.message ? (
              <section aria-labelledby="lead-message-title">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-violeta" id="lead-message-title">
                  Mensaje
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-marino/75">{lead.message}</p>
              </section>
            ) : null}

            {lead.notes ? (
              <section aria-labelledby="lead-notes-title">
                <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-violeta" id="lead-notes-title">
                  Notas existentes
                </h3>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-marino/75">{lead.notes}</p>
              </section>
            ) : null}

            <section aria-labelledby="lead-activity-title" className="border-t border-marino/10 pt-6">
              <div className="flex items-center gap-2">
                <FileText aria-hidden="true" className="size-5 text-violeta" />
                <h3 className="font-extrabold text-marino" id="lead-activity-title">
                  Historial de actividades
                </h3>
              </div>
              {lead.activities.length > 0 ? (
                <ol className="mt-5 space-y-4 border-l border-marino/15 pl-5">
                  {lead.activities.map((activity) => (
                    <li key={activity.id} className="relative">
                      <span aria-hidden="true" className="absolute -left-[1.7rem] top-1.5 size-3 rounded-full bg-celeste ring-4 ring-white" />
                      <p className="text-sm font-bold text-marino">{activityTypeLabels[activity.activity_type]}</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-marino/70">{activity.description}</p>
                      <p className="mt-1.5 text-xs text-marino/55">{dateFormatter.format(new Date(activity.created_at))}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-4 text-sm text-marino/60">Todavía no hay actividades registradas.</p>
              )}
            </section>

            <form className="border-t border-marino/10 pt-6" onSubmit={(event) => void handleAddNote(event)}>
              <Textarea
                label="Agregar nota"
                placeholder="Registra información relevante para el seguimiento."
                rows={4}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
              <Button
                className="mt-4"
                disabled={!userId || !note.trim() || addLeadActivityMutation.isPending}
                loading={addLeadActivityMutation.isPending}
                type="submit"
              >
                <MessageSquarePlus aria-hidden="true" className="size-4" />
                Agregar nota
              </Button>
            </form>
          </div>
        ) : null}
      </Modal>

      {toast ? <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} /> : null}
    </>
  )
}

export default function Leads() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const [page, setPage] = useState(1)
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const updateLeadStatusMutation = useUpdateLeadStatus()
  const leadsQuery = useLeads({
    status: statusFilter === 'all' ? undefined : statusFilter,
    search: deferredSearch || undefined,
    page,
    pageSize: PAGE_SIZE,
  })
  const leads = leadsQuery.data?.data ?? []
  const totalResults = leadsQuery.data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))
  const firstResult = totalResults === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const lastResult = Math.min(page * PAGE_SIZE, totalResults)

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = event.target.value

    setStatusFilter(nextStatus === 'all' ? 'all' : (nextStatus as LeadStatus))
    setPage(1)
  }

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    updateLeadStatusMutation.mutate(
      { leadId, status },
      {
        onError: () => {
          setToast({
            variant: 'error',
            message: 'No pudimos actualizar el estado del prospecto.',
          })
        },
      },
    )
  }

  const columns: TableColumn<Lead>[] = [
    {
      key: 'full_name',
      label: 'Prospecto',
      render: (_value, lead) => (
        <div>
          <p className="font-bold text-marino">{lead.full_name}</p>
          <p className="mt-0.5 text-xs text-marino/60">{lead.email}</p>
        </div>
      ),
    },
    {
      key: 'company',
      label: 'Empresa',
      render: (_value, lead) => <span className="text-marino/75">{lead.company || 'Sin empresa'}</span>,
    },
    {
      key: 'service_interest',
      label: 'Servicio',
      render: (_value, lead) => <span className="text-marino/75">{lead.service_interest || 'Sin especificar'}</span>,
    },
    {
      key: 'status',
      label: 'Estado',
      render: (_value, lead) => (
        <div
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <Select
            aria-label={`Cambiar estado de ${lead.full_name}`}
            className="min-h-8 py-1 text-xs"
            disabled={updateLeadStatusMutation.isPending}
            options={statusOptions}
            value={lead.status}
            onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
          />
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      render: (_value, lead) => <span className="whitespace-nowrap text-marino/70">{dateFormatter.format(new Date(lead.created_at))}</span>,
    },
    {
      key: 'id',
      label: 'Acciones',
      render: (_value, lead) => (
        <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelectedLeadId(lead.id)}
          >
            Ver detalle
          </Button>
        </div>
      ),
    },
  ]

  return (
    <section>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-violeta">Gestión comercial</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-marino">Prospectos</h1>
        </div>
        <p className="text-sm text-marino/60">Filtra, actualiza y da seguimiento a cada oportunidad.</p>
      </div>

      {!isSupabaseConfigured ? (
        <EmptyState
          description="Conecta Supabase para consultar y gestionar los prospectos reales."
          title="La base de datos aún no está conectada"
        />
      ) : (
        <>
          <Card className="mt-7" variant="outlined">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
              <Input
                label="Buscar prospectos"
                placeholder="Nombre, email o empresa"
                value={search}
                onChange={handleSearchChange}
              />
              <Select
                label="Estado"
                options={filterStatusOptions}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              />
            </div>
          </Card>

          <div className="mt-6">
            {leadsQuery.isLoading ? <LeadsSkeleton /> : null}
            {leadsQuery.isError ? (
              <EmptyState
                description="No pudimos obtener los prospectos. Revisa la conexión y los permisos de Supabase."
                title="No se pudo cargar la información"
              />
            ) : null}
            {!leadsQuery.isLoading && !leadsQuery.isError && leads.length === 0 ? (
              <EmptyState
                description="Prueba con otro estado o término de búsqueda."
                title="No encontramos prospectos"
              />
            ) : null}
            {!leadsQuery.isLoading && !leadsQuery.isError && leads.length > 0 ? (
              <Table
                ariaLabel="Listado de prospectos"
                columns={columns}
                data={leads}
                getRowId={(lead) => lead.id}
                onRowClick={(lead) => setSelectedLeadId(lead.id)}
              />
            ) : null}
          </div>

          {totalResults > 0 ? (
            <nav aria-label="Paginación de prospectos" className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-marino/65">
                Mostrando {firstResult}-{lastResult} de {totalResults} prospectos
              </p>
              <div className="flex items-center gap-2">
                <Button
                  disabled={page === 1}
                  size="sm"
                  variant="secondary"
                  onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                  Anterior
                </Button>
                <span className="px-2 text-sm font-bold text-marino" aria-current="page">
                  {page} / {totalPages}
                </span>
                <Button
                  disabled={page >= totalPages}
                  size="sm"
                  variant="secondary"
                  onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                >
                  Siguiente
                  <ChevronRight aria-hidden="true" className="size-4" />
                </Button>
              </div>
            </nav>
          ) : null}
        </>
      )}

      <LeadDetailModal
        key={selectedLeadId ?? 'no-selection'}
        leadId={selectedLeadId}
        userId={user?.id ?? null}
        onClose={() => setSelectedLeadId(null)}
      />

      {toast ? <Toast message={toast.message} variant={toast.variant} onDismiss={() => setToast(null)} /> : null}
    </section>
  )
}

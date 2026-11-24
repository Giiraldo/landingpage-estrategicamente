import type { LeadPriority, LeadStatus, UserRole } from '../types'

export const APP_NAME = 'ESTRATEGICAMENTE Leads'

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'quoted',
  'closed',
  'lost',
] as const satisfies readonly LeadStatus[]

export const LEAD_PRIORITIES = ['low', 'medium', 'high'] as const satisfies readonly LeadPriority[]

export const USER_ROLES = ['admin', 'viewer'] as const satisfies readonly UserRole[]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo',
  contacted: 'Contactado',
  quoted: 'Cotizado',
  closed: 'Cerrado',
  lost: 'Perdido',
}

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

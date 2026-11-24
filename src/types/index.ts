export type LeadStatus =
  | 'new'
  | 'contacted'
  | 'quoted'
  | 'closed'
  | 'lost'

export type LeadPriority = 'low' | 'medium' | 'high'

export type UserRole = 'admin' | 'viewer'

export type LeadActivityType = 'status_change' | 'note' | 'email_sent' | 'call' | 'meeting'

export interface Lead {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  service_interest: string | null
  message: string | null
  source: string
  status: LeadStatus
  priority: LeadPriority
  notes: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface LeadActivity {
  id: string
  lead_id: string
  user_id: string | null
  activity_type: LeadActivityType
  description: string
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface LeadFilters {
  status?: LeadStatus
  priority?: LeadPriority
  assigned_to?: string
  search?: string
  page?: number
  pageSize?: number
  created_after?: string
}

export interface PaginatedLeads {
  data: Lead[]
  count: number
  page: number
  pageSize: number
}

export interface LeadWithActivities extends Lead {
  activities: LeadActivity[]
}

export interface CreateLeadInput {
  full_name: string
  email: string
  phone?: string | null
  company?: string | null
  service_interest?: string | null
  message?: string | null
  source?: string
  status?: LeadStatus
  priority?: LeadPriority
  notes?: string | null
  assigned_to?: string | null
}

export type UpdateLeadInput = Partial<
  Pick<
    Lead,
    | 'full_name'
    | 'email'
    | 'phone'
    | 'company'
    | 'service_interest'
    | 'message'
    | 'source'
    | 'status'
    | 'priority'
    | 'notes'
    | 'assigned_to'
  >
>

export interface CreateLeadActivityInput {
  lead_id: string
  user_id?: string | null
  activity_type: LeadActivityType
  description: string
}

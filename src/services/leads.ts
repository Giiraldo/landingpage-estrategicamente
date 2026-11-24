import type {
  CreateLeadActivityInput,
  CreateLeadInput,
  Lead,
  LeadActivity,
  LeadFilters,
  LeadStatus,
  LeadWithActivities,
  PaginatedLeads,
  UpdateLeadInput,
} from '../types'
import { getSupabaseClient } from './supabase'

export async function getLeads(filters: LeadFilters = {}): Promise<PaginatedLeads> {
  const page = Math.max(filters.page ?? 1, 1)
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 100)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1
  let query = getSupabaseClient().from('leads').select('*', { count: 'exact' }).order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }

  if (filters.assigned_to) {
    query = query.eq('assigned_to', filters.assigned_to)
  }

  if (filters.created_after) {
    query = query.gte('created_at', filters.created_after)
  }

  const search = filters.search?.trim().replace(/[,%()]/g, ' ')

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`)
  }

  const { count, data, error } = await query.range(from, to)

  if (error) {
    throw error
  }

  return {
    data: (data ?? []) as Lead[],
    count: count ?? 0,
    page,
    pageSize,
  }
}

export async function getLeadById(leadId: string): Promise<LeadWithActivities | null> {
  const { data, error } = await getSupabaseClient().from('leads').select('*').eq('id', leadId).maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  const activities = await getLeadActivities(leadId)

  return {
    ...(data as Lead),
    activities,
  }
}

export async function createLead(input: CreateLeadInput): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('leads')
    .insert({
      full_name: input.full_name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      company: input.company?.trim() || null,
      service_interest: input.service_interest?.trim() || null,
      message: input.message?.trim() || null,
    })

  if (error) {
    throw error
  }
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
  const { data, error } = await getSupabaseClient()
    .from('leads')
    .update({ status })
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Lead
}

export async function updateLead(leadId: string, updates: UpdateLeadInput): Promise<Lead> {
  const { data, error } = await getSupabaseClient()
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as Lead
}

export async function addLeadActivity(input: CreateLeadActivityInput): Promise<LeadActivity> {
  const { data, error } = await getSupabaseClient()
    .from('lead_activities')
    .insert({
      lead_id: input.lead_id,
      user_id: input.user_id ?? null,
      activity_type: input.activity_type,
      description: input.description,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data as LeadActivity
}

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const { data, error } = await getSupabaseClient()
    .from('lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []) as LeadActivity[]
}

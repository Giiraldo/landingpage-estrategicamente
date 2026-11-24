import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { CreateLeadActivityInput, CreateLeadInput, LeadFilters, LeadStatus, UpdateLeadInput } from '../types'
import { addLeadActivity, createLead, getLeadById, getLeads, updateLead, updateLeadStatus } from '../services/leads'

const leadsQueryKey = ['leads'] as const
const leadListsQueryKey = [...leadsQueryKey, 'list'] as const
const leadDetailsQueryKey = [...leadsQueryKey, 'detail'] as const

export const leadKeys = {
  all: leadsQueryKey,
  lists: leadListsQueryKey,
  list: (filters: LeadFilters) => [...leadListsQueryKey, filters] as const,
  details: leadDetailsQueryKey,
  detail: (leadId: string) => [...leadDetailsQueryKey, leadId] as const,
}

export function useLeads(filters: LeadFilters = {}) {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => getLeads(filters),
  })
}

export function useLead(leadId: string | null) {
  return useQuery({
    queryKey: leadKeys.detail(leadId ?? ''),
    queryFn: () => {
      if (!leadId) {
        throw new Error('Se requiere el identificador del lead.')
      }

      return getLeadById(leadId)
    },
    enabled: Boolean(leadId),
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLeadInput) => createLead(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.all }),
  })
}

export interface UpdateLeadVariables {
  leadId: string
  updates: UpdateLeadInput
}

export function useUpdateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, updates }: UpdateLeadVariables) => updateLead(leadId, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.all }),
  })
}

export interface UpdateLeadStatusVariables {
  leadId: string
  status: LeadStatus
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ leadId, status }: UpdateLeadStatusVariables) => updateLeadStatus(leadId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.all }),
  })
}

export function useAddLeadActivity() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateLeadActivityInput) => addLeadActivity(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: leadKeys.all }),
  })
}

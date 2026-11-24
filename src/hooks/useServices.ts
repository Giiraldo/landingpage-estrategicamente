import { useQuery } from '@tanstack/react-query'

import { getActiveServices } from '../services/services'
import { isSupabaseConfigured } from '../services/supabase'

export const serviceKeys = {
  active: ['services', 'active'] as const,
}

export function useServices() {
  return useQuery({
    queryKey: serviceKeys.active,
    queryFn: getActiveServices,
    enabled: isSupabaseConfigured,
  })
}

import type { Service } from '../types'
import { getSupabaseClient } from './supabase'

export async function getActiveServices(): Promise<Service[]> {
  const { data, error } = await getSupabaseClient()
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []) as Service[]
}

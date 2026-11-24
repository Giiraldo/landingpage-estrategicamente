import type { Session } from '@supabase/supabase-js'

import type { LoginFormValues } from '../lib/validators'
import type { Profile } from '../types'
import { getSupabaseClient } from './supabase'

export async function signIn({ email, password }: LoginFormValues) {
  const { data, error } = await getSupabaseClient().auth.signInWithPassword({ email, password })

  if (error) {
    throw error
  }

  return data
}

export async function resetPasswordForEmail(email: string, redirectTo: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, { redirectTo })

  if (error) {
    throw error
  }
}

export async function updatePassword(password: string): Promise<void> {
  const { error } = await getSupabaseClient().auth.updateUser({ password })

  if (error) {
    throw error
  }
}

export async function signOut(): Promise<void> {
  const { error } = await getSupabaseClient().auth.signOut()

  if (error) {
    throw error
  }
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await getSupabaseClient().auth.getSession()

  if (error) {
    throw error
  }

  return data.session
}

export function onAuthStateChange(onSessionChange: (session: Session | null) => void) {
  const {
    data: { subscription },
  } = getSupabaseClient().auth.onAuthStateChange((_event, session) => {
    onSessionChange(session)
  })

  return subscription
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await getSupabaseClient().from('profiles').select('*').eq('id', userId).maybeSingle()

  if (error) {
    throw error
  }

  return data ? (data as Profile) : null
}

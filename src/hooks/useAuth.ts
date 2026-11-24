import type { Session, User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

import { getProfile, getSession, onAuthStateChange } from '../services/auth'
import { isSupabaseConfigured } from '../services/supabase'
import type { Profile } from '../types'

export interface UseAuthResult {
  session: Session | null
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isConfigured: boolean
}

export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      return
    }

    let isMounted = true

    const applySession = async (nextSession: Session | null) => {
      if (!isMounted) {
        return
      }

      setSession(nextSession)

      if (!nextSession) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      try {
        const nextProfile = await getProfile(nextSession.user.id)

        if (isMounted) {
          setProfile(nextProfile)
          setIsLoading(false)
        }
      } catch {
        if (isMounted) {
          setProfile(null)
          setIsLoading(false)
        }
      }
    }

    void getSession()
      .then((currentSession) => applySession(currentSession))
      .catch(() => {
        if (isMounted) {
          setSession(null)
          setProfile(null)
          setIsLoading(false)
        }
      })

    const subscription = onAuthStateChange((nextSession) => {
      void applySession(nextSession)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    profile,
    isLoading,
    isConfigured: isSupabaseConfigured,
  }
}

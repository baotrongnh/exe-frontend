"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { authHelpers } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  getAccessToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Lấy session hiện tại
    const getInitialSession = async () => {
      try {
        const { data } = await authHelpers.getCurrentUser()
        setUser(data.user)

        // Cũng lấy session để có access token
        const { data: sessionData } = await authHelpers.getSession()
        setSession(sessionData.session)
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Lắng nghe thay đổi auth state
    const { data: { subscription } } = authHelpers.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      setSession(session as Session)
      setUser((session as Session)?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await authHelpers.signOut()
    setUser(null)
    setSession(null)
  }

  const getAccessToken = () => {
    return session?.access_token || null
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
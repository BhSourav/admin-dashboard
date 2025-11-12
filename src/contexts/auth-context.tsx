"use client"

/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles user sign-in, sign-out, and session management with Supabase.
 * 
 * TEST MODE: Use test@example.com / password123 to login without Supabase
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

// Enable test mode for development (set to false when using real Supabase)
const TEST_MODE = true

// Test credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
}

// Mock user object for testing
const createMockUser = (): User => ({
  id: 'test-user-id-12345',
  email: TEST_USER.email,
  aud: 'authenticated',
  role: 'authenticated',
  created_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
} as User)

// Mock session for testing
const createMockSession = (): Session => ({
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  expires_at: Date.now() / 1000 + 3600,
  token_type: 'bearer',
  user: createMockUser(),
})

/**
 * User privileges interface
 * Defines what actions a user is allowed to perform
 */
export interface UserPrivileges {
  can_add_expense: boolean
  can_add_income: boolean
  can_view_reports: boolean
  can_upload_bills: boolean
  can_download_reports: boolean
}

/**
 * Authentication context type definition
 */
interface AuthContextType {
  user: User | null
  session: Session | null
  privileges: UserPrivileges | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshPrivileges: () => Promise<void>
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Authentication Provider Component
 * 
 * Wraps the application and provides authentication state to all children.
 * Manages user sessions, privileges, and authentication methods.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [privileges, setPrivileges] = useState<UserPrivileges | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Fetch user privileges from Supabase
   * This function queries the user_privileges table to get the current user's permissions
   */
  const fetchPrivileges = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_privileges')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching privileges:', error)
        // Set default privileges if none exist
        setPrivileges({
          can_add_expense: true,
          can_add_income: true,
          can_view_reports: true,
          can_upload_bills: true,
          can_download_reports: true,
        })
        return
      }

      setPrivileges(data as UserPrivileges)
    } catch (error) {
      console.error('Error in fetchPrivileges:', error)
      setPrivileges(null)
    }
  }

  /**
   * Initialize authentication state
   * Checks for existing session and sets up auth state listener
   * In TEST_MODE, checks localStorage for test auth
   */
  useEffect(() => {
    if (TEST_MODE) {
      // Check localStorage for test auth
      const testAuth = localStorage.getItem('test_auth')
      if (testAuth) {
        try {
          const { user, session } = JSON.parse(testAuth)
          setUser(user)
          setSession(session)
          setPrivileges({
            can_add_expense: true,
            can_add_income: true,
            can_view_reports: true,
            can_upload_bills: true,
            can_download_reports: true,
          })
        } catch (error) {
          console.error('Error loading test auth:', error)
          localStorage.removeItem('test_auth')
        }
      }
      setLoading(false)
      return
    }

    // Real Supabase auth initialization
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchPrivileges(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchPrivileges(session.user.id)
      } else {
        setPrivileges(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  /**
   * Sign in with email and password
   * In TEST_MODE, accepts test@example.com / password123
   */
  const signIn = async (email: string, password: string) => {
    if (TEST_MODE) {
      // Test mode authentication
      if (email === TEST_USER.email && password === TEST_USER.password) {
        const mockUser = createMockUser()
        const mockSession = createMockSession()
        setUser(mockUser)
        setSession(mockSession)
        // Set full privileges for test user
        setPrivileges({
          can_add_expense: true,
          can_add_income: true,
          can_view_reports: true,
          can_upload_bills: true,
          can_download_reports: true,
        })
        // Store in localStorage for persistence
        localStorage.setItem('test_auth', JSON.stringify({ user: mockUser, session: mockSession }))
        return
      } else {
        throw new Error('Invalid test credentials. Use test@example.com / password123')
      }
    }

    // Real Supabase authentication
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * Sign up a new user
   * In TEST_MODE, this just creates a mock user
   */
  const signUp = async (email: string, password: string) => {
    if (TEST_MODE) {
      // In test mode, any signup creates a test user
      const mockUser = createMockUser()
      const mockSession = createMockSession()
      setUser(mockUser)
      setSession(mockSession)
      setPrivileges({
        can_add_expense: true,
        can_add_income: true,
        can_view_reports: true,
        can_upload_bills: true,
        can_download_reports: true,
      })
      localStorage.setItem('test_auth', JSON.stringify({ user: mockUser, session: mockSession }))
      return
    }

    // Real Supabase sign up
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
  }

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    if (TEST_MODE) {
      // Clear test auth from localStorage
      localStorage.removeItem('test_auth')
      setUser(null)
      setSession(null)
      setPrivileges(null)
      return
    }

    // Real Supabase sign out
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  /**
   * Manually refresh user privileges
   * Useful after privilege changes in the database
   */
  const refreshPrivileges = async () => {
    if (user) {
      await fetchPrivileges(user.id)
    }
  }

  const value = {
    user,
    session,
    privileges,
    loading,
    signIn,
    signUp,
    signOut,
    refreshPrivileges,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Custom hook to use authentication context
 * 
 * Usage:
 * const { user, signIn, signOut } = useAuth()
 * 
 * @throws Error if used outside AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

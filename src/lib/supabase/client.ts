/**
 * Supabase Client Configuration
 * 
 * This module initializes and exports the Supabase client for browser-side operations.
 * The client is used for authentication, database queries, and storage operations.
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anonymous/public key
 */

import { createClient } from '@supabase/supabase-js'

// Supabase URL and anonymous key from environment variables
// These will be provided by the user later
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

/**
 * Creates a Supabase client instance
 * This client can be used throughout the application for:
 * - User authentication (sign in, sign up, sign out)
 * - Database operations (CRUD operations)
 * - Real-time subscriptions
 * - File storage operations
 * 
 * Note: Placeholder values are used during build time.
 * Make sure to set proper environment variables before running the app.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Type definitions for the application's database schema
 * These will be expanded as we define the data models
 */
export type Database = {
  public: {
    Tables: {
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string
          date: string
          bill_url?: string
          created_at: string
        }
      }
      income: {
        Row: {
          id: string
          user_id: string
          amount: number
          source: string
          description: string
          date: string
          created_at: string
        }
      }
      user_privileges: {
        Row: {
          user_id: string
          can_add_expense: boolean
          can_add_income: boolean
          can_view_reports: boolean
          can_upload_bills: boolean
          can_download_reports: boolean
        }
      }
    }
  }
}

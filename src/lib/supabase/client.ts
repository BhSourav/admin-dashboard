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
 * Enum definitions from Supabase database
 */
export type AgeGroup = 'ADULT' | 'TEEN' | 'CHILD' | 'STUDENT'
export type ContactPreference = 'EMAIL' | 'MOBILE' | 'WHATSAPP' | 'FACEBOOK' | 'POST' | 'FAX'
export type TransactionType = 'INCOME' | 'EXPENSE'

/**
 * Type definitions for the application's database schema
 * Based on the actual Supabase database structure
 */
export type Database = {
  public: {
    Enums: {
      AgeGroup: AgeGroup
      ContactPreference: ContactPreference
      TransactionType: TransactionType
    }
    Tables: {
      Transaction: {
        Row: {
          TransactionID: string
          created_at: string
          TransID: string
          PersonID: string
          TransactionDate: string
          Amount: number
          BillID?: string
        }
        Insert: {
          TransactionID?: string
          TransID: string
          PersonID: string
          TransactionDate: string
          Amount: number
          BillID?: string
        }
      }
      Type: {
        Row: {
          TypeID: string
          created_at: string
          CategoryID: string
          Name: string
        }
      }
      Category: {
        Row: {
          CategoryID: string
          created_at: string
          Name: string
          Type: TransactionType
        }
      }
      Bill: {
        Row: {
          BillID: string
          created_at: string
          PersonID: string
          FileName: string
          FilePath: string
          FileMime: string
          Extension: string
        }
        Insert: {
          BillID?: string
          PersonID: string
          FileName: string
          FilePath: string
          FileMime: string
          Extension: string
        }
      }
      Person: {
        Row: {
          PersonID: string
          created_at: string
          Name: string
          ContactID?: string
          AgeGroup?: AgeGroup
        }
      }
      Contact: {
        Row: {
          ContactID: string
          created_at: string
          AddressID?: string
          SessionID?: string
          Email?: string
          Telephone?: string
          Mobile?: string
          Fax?: string
        }
      }
      Address: {
        Row: {
          AddressID: string
          created_at: string
          Street?: string
          Number?: string
          PL2?: string
          Place?: string
        }
      }
      Social: {
        Row: {
          SocialID: string
          created_at: string
          Whatsapp?: string
          Facebook?: string
          Instagram?: string
        }
      }
    }
  }
}

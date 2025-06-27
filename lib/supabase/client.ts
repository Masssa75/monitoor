import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Client-side safe values only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (typeof window !== 'undefined') {
  console.log('[Supabase Client] Configuration:', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    url: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
    environment: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === 'production'
  })
  
  // Warn if configuration is missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Supabase Client] WARNING: Missing configuration!', {
      supabaseUrl: supabaseUrl || 'MISSING',
      supabaseAnonKey: supabaseAnonKey ? 'SET' : 'MISSING'
    })
  }
}

// Singleton pattern to prevent multiple instances
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null
let supabaseAdminInstance: ReturnType<typeof createClient<Database>> | null = null

// Create singleton client
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-key',
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: typeof window !== 'undefined' ? window.localStorage : undefined
        }
      }
    )
  }
  return supabaseInstance
})()

// DEPRECATED: Use import from '@/lib/supabase/server-client' instead
// This export is kept temporarily for backward compatibility
export const supabaseAdmin = null as any

// Export createClient function for browser use
export function createBrowserClient() {
  return supabase
}

// Also export as createClient for compatibility
export { createBrowserClient as createClient }
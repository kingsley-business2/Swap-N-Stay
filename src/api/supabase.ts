// ========================== src/api/supabase.ts (HARDCODED VERSION) ==========================
import { createClient } from '@supabase/supabase-js';

// 🛑 WARNING: HARDCODED KEYS FOR SCHOOL PROJECT ONLY! 🛑
const supabaseUrl = 'https://gtamcgrvqouallfwcmtg.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0YW1jZ3J2cW91YWxsZndjbXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTQ4MjYsImV4cCI6MjA3NDI3MDgyNn0.trNxO9UBdMJz5ONW9aSeYz16XJ61d4Emp3QuM7VyE50';

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'swap-n-stay@1.0.0'
    }
  }
});

// Optional: Add error logging for development (Keep this as is)
if (import.meta.env.DEV) {
  supabase
    .channel('schema-changes')
    .on(
      'system',
      { event: '*', schema: 'public' },
      (payload) => console.log('Supabase schema change:', payload)
    )
    .subscribe();
}

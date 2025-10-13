// ========================== src/api/supabase.ts (RESTORE TO ORIGINAL) ==========================
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

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

// Optional: Add error logging for development
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

// ========================== src/api/supabase.ts (TEMPORARY DEBUG) ==========================
import { createClient } from '@supabase/supabase-js';

// **Crucial Change:** Add fallback values to prevent the crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'BLANK_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'BLANK_KEY';

// **Crucial Change:** Comment out the throwing block
/*
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}
*/

// Create Supabase client (will use BLANK keys if Cloudflare failed)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
// ... (rest of the configuration remains the same)

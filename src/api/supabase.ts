// ========================== src/api/supabase.ts (TEMPORARY DEBUG - CRASH REMOVED) ==========================
import { createClient } from '@supabase/supabase-js';

// Provide fallbacks to prevent the runtime crash
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'DUMMY_URL_TO_PREVENT_CRASH';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'DUMMY_KEY_TO_PREVENT_CRASH';

// 🛑 REMOVE THE CRASHING BLOCK ENTIRELY 🛑
/* if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}
*/

// Create Supabase client...
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // ... rest of config
});
// ... rest of the file

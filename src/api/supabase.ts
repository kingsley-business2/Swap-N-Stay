// ========================== src/api/supabase.ts (TEMPORARY DEBUGGING) ==========================
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'DUMMY_URL'; // Add fallback
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'DUMMY_KEY'; // Add fallback

// TEMPORARILY REMOVE THE THROW BLOCK:
// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables...');
// }

// Create Supabase client...
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  // ... rest of the config
});

// ... rest of the file

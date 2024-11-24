import { createClient } from '@supabase/supabase-js';

// Use environment variables provided by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log a warning if env vars are missing
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Please ensure the Supabase integration is properly connected in Lovable.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
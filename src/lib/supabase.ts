import { createClient } from '@supabase/supabase-js';

// Use environment variables provided by Lovable's Supabase integration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning if env vars are missing
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing. Please ensure the Supabase integration is properly connected in Lovable.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = "https://czjpzgmlkrmcwwsmafrh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6anB6Z21sa3JtY3d3c21hZnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NDQ5NjMsImV4cCI6MjA0ODAyMDk2M30.4LqM8VguZDFpd00tpG4D4DW4_tU_aH4LplM6kndsQKA";

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    storageKey: 'app-supabase-auth'
  }
});
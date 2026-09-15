import { createClient } from '@supabase/supabase-js';

const meta = import.meta as any;
const supabaseUrl = meta.env?.VITE_SUPABASE_URL || meta.env?.SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

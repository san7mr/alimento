import { createClient } from '@supabase/supabase-js';

// This is a placeholder for Supabase setup - users will need to click the "Connect to Supabase" button
// and add their own credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
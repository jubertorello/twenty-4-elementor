import { createClient } from '@supabase/supabase-js';

// Server-only client: no session, no cookies — safe for Server Components and ISR
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);

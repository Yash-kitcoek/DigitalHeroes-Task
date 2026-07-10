import { createClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key, which bypasses Row Level
// Security, so this file must never be imported from client components.
// Every caller in this app is a Server Component, Route Handler, or a
// function only invoked from those (lib/db.ts, lib/auth.ts).
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. " +
      "Add them to .env.local (see .env.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false }
});

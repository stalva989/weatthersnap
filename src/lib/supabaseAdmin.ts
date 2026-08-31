import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL;

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log(
  "SUPABASE_URL loaded:",
  Boolean(supabaseUrl)
);

console.log(
  "SUPABASE_SERVICE_ROLE_KEY loaded:",
  Boolean(supabaseServiceRoleKey)
);

if (!supabaseUrl) {
  throw new Error(
    "SUPABASE_URL is missing from the server environment."
  );
}

if (!supabaseServiceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is missing from the server environment."
  );
}

export const supabaseAdmin =
  createClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
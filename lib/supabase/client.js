import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // Fallback values untuk build time, akan diganti dengan env vars di runtime
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createBrowserClient(url, key);
}


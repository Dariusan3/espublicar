import { NextRequest } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Verifies the caller's identity server-side from their own Supabase access
 * token, instead of trusting a userId/customerId the client puts in the
 * request body.
 *
 * The app has no server-side session cookie (auth lives in the browser's
 * localStorage), so the client sends its current access token as
 * `Authorization: Bearer <token>` and this validates it against Supabase Auth
 * — the standard way to authenticate a Supabase user from a server route
 * without cookies. The returned client carries that same token, so any query
 * it makes is subject to RLS as that user (not the anonymous role), which is
 * what lets a route read the caller's *own* profile row safely.
 */
export async function requireUser(
  req: NextRequest,
): Promise<{ userId: string; email: string | null; supabase: SupabaseClient } | null> {
  if (!supabaseUrl || !anonKey) return null;

  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return null;

  const supabase = createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;

  return { userId: data.user.id, email: data.user.email ?? null, supabase };
}

/**
 * A redirect URL is only safe to hand to Stripe (or follow after Stripe) if
 * it points back at this app — otherwise a crafted link could bounce a buyer
 * through our own checkout/portal into an attacker's site.
 */
export function isSameOrigin(url: string | undefined, req: NextRequest): boolean {
  if (!url) return false;
  try {
    return new URL(url).origin === req.nextUrl.origin;
  } catch {
    return false;
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireUser, isSameOrigin } from "@/lib/serverAuth";

const stripeKey = process.env.STRIPE_SECRET_KEY;

export const runtime = "nodejs";

/**
 * Opens Stripe's own Billing Portal for a Pro subscriber to manage or cancel.
 *
 * Deliberately not custom-built: cancellation, payment-method updates and
 * invoice history are handled by Stripe directly, so there is no bespoke
 * "cancel subscription" code here that could get the plan state out of sync
 * with what Stripe actually billed.
 *
 * The Stripe customer id is looked up server-side for the caller's own
 * verified account — never accepted from the request body. A client-supplied
 * customerId would let anyone open the billing portal (and from there,
 * cancel the subscription or see payment details) for any Stripe customer
 * whose id they could guess or obtain, with no payment or ownership check at
 * all.
 */
export async function POST(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe no está configurado." },
      { status: 500 },
    );
  }

  const auth = await requireUser(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Inicia sesión para gestionar tu suscripción" },
      { status: 401 },
    );
  }

  try {
    const { returnUrl } = await req.json();
    if (!isSameOrigin(returnUrl, req)) {
      return NextResponse.json({ error: "URL de retorno no válida" }, { status: 400 });
    }

    // RLS (user_read_own) only lets this read the caller's own row — the
    // token attached to `auth.supabase` is what makes auth.uid() resolve to
    // them, not the anonymous role.
    const { data: profile, error: profileError } = await auth.supabase
      .from("user")
      .select("stripeCustomerId")
      .eq("id", auth.userId)
      .maybeSingle();

    if (profileError || !profile?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No se encontró tu suscripción" },
        { status: 404 },
      );
    }

    const stripe = new (Stripe as any)(stripeKey);
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripeCustomerId,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Billing portal error:", error);
    return NextResponse.json(
      { error: error.message || "No se pudo abrir la gestión de la suscripción" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { requireUser, isSameOrigin } from "@/lib/serverAuth";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const proPriceId = process.env.STRIPE_PRO_PRICE_ID;

export const runtime = "nodejs";

/**
 * Starts a Stripe Checkout session for the "espublicar Pro" subscription.
 *
 * Mirrors app/api/checkout/route.ts (one-time payment) but in
 * mode: "subscription". The buyer id travels on the *subscription*'s own
 * metadata (via subscription_data), not just the checkout session's — that
 * way every later webhook event for this subscription (renewal, cancellation,
 * payment failure) carries userId without a customer lookup.
 *
 * userId comes only from the caller's own verified access token — never from
 * the request body. Accepting a client-supplied userId here would let anyone
 * pay for a subscription and attribute the resulting Pro plan to a stranger's
 * account.
 */
export async function POST(req: NextRequest) {
  if (!stripeKey || !proPriceId) {
    return NextResponse.json(
      { error: "El plan Pro no está configurado en el servidor." },
      { status: 500 },
    );
  }

  const auth = await requireUser(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Inicia sesión para hacerte Pro" },
      { status: 401 },
    );
  }

  try {
    const { successUrl, cancelUrl } = await req.json();
    if (!isSameOrigin(successUrl, req) || !isSameOrigin(cancelUrl, req)) {
      return NextResponse.json({ error: "URL de retorno no válida" }, { status: 400 });
    }

    const stripe = new (Stripe as any)(stripeKey);
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: proPriceId, quantity: 1 }],
      customer_email: auth.email || undefined,
      subscription_data: { metadata: { userId: auth.userId } },
      metadata: { userId: auth.userId },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      locale: "es",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Pro checkout error:", error);
    return NextResponse.json(
      { error: error.message || "No se pudo iniciar la suscripción" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;

/**
 * Ask Stripe whether a Checkout session was actually paid.
 *
 * The browser cannot be trusted to report its own payment, and there is no
 * webhook yet, so the client calls this after being redirected back and then
 * writes the order status itself (RLS only lets the buyer touch their order).
 */
export async function GET(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe no está configurado." },
      { status: 500 },
    );
  }

  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Falta session_id" }, { status: 400 });
  }

  try {
    const stripe = new (Stripe as any)(stripeKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      paid: session.payment_status === "paid",
      paymentStatus: session.payment_status,
      orderId: session.metadata?.orderId || null,
      amountTotal:
        typeof session.amount_total === "number"
          ? session.amount_total / 100
          : null,
    });
  } catch (error: any) {
    console.error("Stripe confirm error:", error);
    return NextResponse.json(
      { error: error.message || "No se pudo verificar el pago" },
      { status: 500 },
    );
  }
}

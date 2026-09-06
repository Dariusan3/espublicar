import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const confirmSecret = process.env.ORDER_CONFIRM_SECRET;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirms a payment with Stripe and settles the order.
 *
 * The browser used to do the write itself, which meant anyone could mark their
 * own order paid from the console. Now the order is only ever settled here,
 * after Stripe says the session was paid, using a secret the client never has.
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
    const paid = session.payment_status === "paid";
    const orderId = session.metadata?.orderId || null;

    let settled = false;
    if (paid && orderId && supabaseUrl && anonKey && confirmSecret) {
      const supabase = createClient(supabaseUrl, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error } = await supabase.rpc("confirm_order_payment", {
        p_order_id: orderId,
        p_secret: confirmSecret,
      });
      if (error) {
        console.error("Could not settle the order:", error.message);
      } else {
        settled = Boolean(data);
      }
    }

    return NextResponse.json({
      paid,
      settled,
      paymentStatus: session.payment_status,
      orderId,
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

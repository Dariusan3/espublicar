import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const confirmSecret = process.env.ORDER_CONFIRM_SECRET;

// Stripe signs the raw body; parsing it first would invalidate the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Marks orders paid from Stripe's own notification.
 *
 * The success page can only confirm a payment when the buyer comes back to it.
 * Closing the tab on Stripe after paying used to leave the order pending
 * forever with the money already taken. Stripe retries this endpoint for days,
 * so the order gets settled either way.
 */
export async function POST(req: NextRequest) {
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Falta STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }
  // Either credential can settle an order: the service role writes directly,
  // and the shared secret goes through confirm_order_payment().
  const canSettle =
    Boolean(supabaseUrl) && (Boolean(serviceRoleKey) || Boolean(anonKey && confirmSecret));
  if (!canSettle) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY u ORDER_CONFIRM_SECRET" },
      { status: 500 },
    );
  }

  const stripe = new (Stripe as any)(stripeKey);
  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error: any) {
    // A bad signature means the call did not come from Stripe.
    console.error("Stripe webhook signature failed:", error.message);
    return NextResponse.json({ error: "Firma no válida" }, { status: 400 });
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error("Stripe session without orderId in metadata:", session.id);
    return NextResponse.json({ received: true, warning: "sin orderId" });
  }
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true, pending: session.payment_status });
  }

  const client = createClient(
    supabaseUrl as string,
    (serviceRoleKey || anonKey) as string,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { error } = serviceRoleKey
    ? await client
        .from("orders")
        .update({
          status: "processing",
          paymentStatus: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
    : await client.rpc("confirm_order_payment", {
        p_order_id: orderId,
        p_secret: confirmSecret,
      });

  if (error) {
    // Returning 500 makes Stripe retry, which is what we want on a DB hiccup.
    console.error("Could not mark the order paid:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true, orderId });
}

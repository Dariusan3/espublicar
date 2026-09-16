import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const orderConfirmSecret = process.env.ORDER_CONFIRM_SECRET;
const planConfirmSecret = process.env.PLAN_CONFIRM_SECRET;

// Stripe signs the raw body; parsing it first would invalidate the signature.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseClient() {
  return createClient(supabaseUrl as string, (serviceRoleKey || anonKey) as string, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Settles a one-time order from checkout.session.completed.
 *
 * The success page can only confirm a payment when the buyer comes back to
 * it. Closing the tab on Stripe after paying used to leave the order pending
 * forever with the money already taken. Stripe retries this endpoint for
 * days, so the order gets settled either way.
 */
async function handleOrderPayment(session: any) {
  const orderId = session.metadata?.orderId;
  if (!orderId) {
    console.error("Stripe session without orderId in metadata:", session.id);
    return { received: true, warning: "sin orderId" };
  }
  if (session.payment_status !== "paid") {
    return { received: true, pending: session.payment_status };
  }

  const client = supabaseClient();
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
        p_secret: orderConfirmSecret,
      });

  if (error) throw new Error(`No se pudo marcar el pedido como pagado: ${error.message}`);
  return { received: true, orderId };
}

/**
 * Flips a buyer's `plan` to "pro" or back to "free" from Stripe's own
 * subscription lifecycle — not from anything the client says. The buyer id
 * rides on subscription_data.metadata set at checkout, so it's on every
 * later event (renewal, cancellation, payment failure) with no customer
 * lookup needed.
 */
async function handleSubscriptionChange(subscription: any) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("Stripe subscription without userId in metadata:", subscription.id);
    return { received: true, warning: "sin userId" };
  }

  const activeStatuses = ["active", "trialing"];
  const isActive = activeStatuses.includes(subscription.status);
  // As of API version 2026-08-26 (billing_mode: "flexible"), the renewal date
  // moved from the subscription's own current_period_end to its first item —
  // a single-price subscription like this one only ever has the one item.
  const periodEnd =
    subscription.current_period_end ??
    subscription.items?.data?.[0]?.current_period_end;
  const renewsAt = periodEnd ? new Date(periodEnd * 1000).toISOString() : null;

  const client = supabaseClient();
  const { error } = serviceRoleKey
    ? await client
        .from("user")
        .update({
          plan: isActive ? "pro" : "free",
          stripeCustomerId: subscription.customer,
          stripeSubscriptionId: isActive ? subscription.id : null,
          planRenewsAt: isActive ? renewsAt : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
    : await client.rpc("set_user_plan", {
        p_user_id: userId,
        p_plan: isActive ? "pro" : "free",
        p_stripe_customer_id: subscription.customer,
        p_stripe_subscription_id: isActive ? subscription.id : null,
        p_renews_at: isActive ? renewsAt : null,
        p_secret: planConfirmSecret,
      });

  if (error) throw new Error(`No se pudo actualizar el plan: ${error.message}`);
  return { received: true, userId, plan: isActive ? "pro" : "free" };
}

export async function POST(req: NextRequest) {
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Falta STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }
  // Either credential can write: the service role writes directly, and the
  // shared secrets go through confirm_order_payment() / set_user_plan().
  const canSettle =
    Boolean(supabaseUrl) &&
    (Boolean(serviceRoleKey) || Boolean(anonKey && orderConfirmSecret && planConfirmSecret));
  if (!canSettle) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY, u ORDER_CONFIRM_SECRET/PLAN_CONFIRM_SECRET" },
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

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object;
        // The Pro checkout session carries no orderId — it's a subscription,
        // settled by the subscription events below instead.
        if (session.mode === "subscription") {
          return NextResponse.json({ received: true, ignored: "subscription checkout" });
        }
        return NextResponse.json(await handleOrderPayment(session));
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        return NextResponse.json(await handleSubscriptionChange(event.data.object));
      default:
        return NextResponse.json({ received: true, ignored: event.type });
    }
  } catch (error: any) {
    // Returning 500 makes Stripe retry, which is what we want on a DB hiccup.
    console.error("Webhook handling error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

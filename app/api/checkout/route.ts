import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const SERVICE_FEE_RATE = 0.03; // 3% comisión

export async function POST(req: NextRequest) {
  if (!stripeKey) {
    return NextResponse.json(
      {
        error:
          "Stripe no está configurado. Añade STRIPE_SECRET_KEY a las variables de entorno.",
      },
      { status: 500 },
    );
  }

  const stripe = new (Stripe as any)(stripeKey);

  try {
    const body = await req.json();
    const {
      items,
      shippingCost = 0,
      delivery,
      payment,
      orderId,
      userId,
      successUrl,
      cancelUrl,
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "No hay artículos en el pedido" },
        { status: 400 },
      );
    }

    const itemsSubtotal = items.reduce(
      (sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1),
      0,
    );
    const serviceFee = Math.round(itemsSubtotal * SERVICE_FEE_RATE * 100) / 100;

    const lineItems: any[] = items.map((it: any) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: it.title || "Artículo",
          images: it.imgSrc ? [it.imgSrc] : undefined,
        },
        unit_amount: Math.round((it.price || 0) * 100),
      },
      quantity: it.quantity || 1,
    }));

    if (serviceFee > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Comisión de servicio (3%)" },
          unit_amount: Math.round(serviceFee * 100),
        },
        quantity: 1,
      });
    }

    if (shippingCost > 0 && delivery === "shipping") {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Envío con seguimiento" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    const paymentMethodTypes: string[] = ["card"];
    if (payment === "bizum") {
      paymentMethodTypes.unshift("bizum");
    } else if (payment === "paypal") {
      paymentMethodTypes.push("paypal");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: paymentMethodTypes,
      line_items: lineItems,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId || ""}`,
      cancel_url: cancelUrl,
      metadata: {
        orderId: orderId || "",
        userId: userId || "",
      },
      locale: "es",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Error al crear la sesión de pago" },
      { status: 500 },
    );
  }
}

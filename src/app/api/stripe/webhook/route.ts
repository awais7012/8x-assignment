import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { fulfillCheckoutSession } from "@/lib/purchases";
import { getStripe, stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";

/*
 * Stripe calls this directly, so it is deliberately not behind Clerk auth - the
 * signature is the authentication. The handler stays fast: verify, fulfil,
 * return 2xx. A non-2xx response makes Stripe retry, which is what we want for a
 * transient database failure, and safe because fulfilment is idempotent.
 */
export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripeEnabled || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  // The raw body is required: parsing it to JSON first would change the bytes
  // the signature was computed over and every production event would fail.
  const body = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Invalid signature: ${error.message}`
            : "Invalid signature.",
      },
      { status: 400 },
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await fulfillCheckoutSession(session.id);
    }
  } catch {
    return NextResponse.json({ error: "Fulfilment failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

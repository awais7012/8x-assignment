import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getViewer } from "@/lib/auth";
import { planById } from "@/lib/plans";
import { getStripe, stripeEnabled } from "@/lib/stripe";

export const runtime = "nodejs";

const bodySchema = z.object({
  planId: z.string().trim().min(1).max(64),
});

export async function POST(request: NextRequest) {
  if (!stripeEnabled) {
    return NextResponse.json(
      { error: "Payments are not configured on this deployment." },
      { status: 503 },
    );
  }

  const viewer = await getViewer();
  if (!viewer) {
    return NextResponse.json(
      { error: "Sign in to buy credits." },
      { status: 401 },
    );
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const plan = planById(parsed.data.planId);
  if (!plan) {
    return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  }

  const origin =
    process.env.NEXT_PUBLIC_APP_URL ??
    request.headers.get("origin") ??
    new URL(request.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: plan.priceCents,
            product_data: {
              name: plan.name,
              description: plan.description,
            },
          },
        },
      ],
      client_reference_id: viewer.id,
      customer_email: viewer.email,
      metadata: {
        userId: viewer.id,
        planId: plan.id,
        credits: String(plan.credits),
      },
      success_url: `${origin}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Could not start checkout: ${error.message}`
            : "Could not start checkout.",
      },
      { status: 502 },
    );
  }
}

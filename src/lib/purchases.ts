import { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { planById } from "./plans";
import { getStripe } from "./stripe";

export interface FulfillResult {
  granted: boolean;
  credits: number;
  reason?: string;
}

/*
 * Grants the credits for a paid Checkout Session. Called from two places - the
 * Stripe webhook (the source of truth) and the success page (so a slow webhook
 * doesn't leave the buyer looking at an unchanged balance). Both paths are safe
 * to run concurrently: the unique index on stripeSessionId is the idempotency
 * boundary, so the second writer loses and no credits are granted twice.
 */
export async function fulfillCheckoutSession(
  sessionId: string,
): Promise<FulfillResult> {
  const session = await getStripe().checkout.sessions.retrieve(sessionId);

  if (session.payment_status !== "paid") {
    return { granted: false, credits: 0, reason: "unpaid" };
  }

  const plan = planById(session.metadata?.planId);
  const userId = session.metadata?.userId ?? session.client_reference_id ?? null;
  if (!plan || !userId) {
    return { granted: false, credits: 0, reason: "unrecognised-session" };
  }

  // Cross-check against our own price table rather than trusting metadata, so a
  // tampered or stale session cannot buy more credits than it paid for.
  if (session.amount_total !== plan.priceCents || session.currency !== "usd") {
    return { granted: false, credits: 0, reason: "amount-mismatch" };
  }

  const existing = await prisma.purchase.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) {
    return { granted: false, credits: existing.credits, reason: "already-granted" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.purchase.create({
        data: {
          userId,
          planId: plan.id,
          credits: plan.credits,
          amountCents: session.amount_total ?? plan.priceCents,
          currency: session.currency ?? "usd",
          stripeSessionId: session.id,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { creditsBalance: { increment: plan.credits } },
      });
    });
  } catch (error) {
    // A concurrent fulfilment won the race; that is the duplicate being blocked.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return { granted: false, credits: plan.credits, reason: "already-granted" };
    }
    throw error;
  }

  return { granted: true, credits: plan.credits };
}

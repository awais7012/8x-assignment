import Stripe from "stripe";

/*
 * Server-only. Mirrors the Clerk approach: the app must build and run with no
 * payments configured, so the client is created lazily and the env var is read
 * inside the factory rather than at module scope - constructing a client at
 * import time fails `next build` while it collects page data.
 *
 * `apiVersion` is intentionally omitted so the SDK's pinned default applies,
 * instead of guessing a version string that may not exist.
 */
export const stripeEnabled = Boolean(process.env.STRIPE_SECRET_KEY);

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }

  if (!client) {
    client = new Stripe(key);
  }

  return client;
}

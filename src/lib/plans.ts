/*
 * One place that defines what can be bought. The pricing page and the checkout
 * route both read from here, so the price and the credits it grants can never
 * drift apart. Prices are in cents, matching Stripe.
 */
export interface CreditPlan {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  credits: number;
}

export const CREDIT_PLANS: CreditPlan[] = [
  {
    id: "credits_2000",
    name: "2,000 credits",
    description: "One-time top-up. Credits never expire.",
    priceCents: 1000,
    credits: 2000,
  },
];

export function planById(id: string | null | undefined): CreditPlan | null {
  if (!id) return null;
  return CREDIT_PLANS.find((plan) => plan.id === id) ?? null;
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`;
}

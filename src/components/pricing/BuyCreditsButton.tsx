"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

/*
 * Starts a hosted Stripe Checkout Session and hands the browser over to Stripe.
 * Nothing payment-related is rendered client-side, so there is no publishable
 * key or Stripe.js bundle in the page.
 */
export function BuyCreditsButton({
  planId,
  signedIn,
  paymentsConfigured,
}: {
  planId: string;
  signedIn: boolean;
  paymentsConfigured: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!paymentsConfigured) {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" disabled>
          Payments not configured
        </Button>
        <p className="text-[12px] text-dim">
          Set <code className="text-muted">STRIPE_SECRET_KEY</code> to enable
          checkout.
        </p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <Link
        href={`/sign-in?redirect_url=${encodeURIComponent("/pricing")}`}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
      >
        Sign in to buy
      </Link>
    );
  }

  async function buy() {
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const body = await response.json().catch(() => ({}));

      if (response.status === 401) {
        window.location.assign(
          `/sign-in?redirect_url=${encodeURIComponent("/pricing")}`,
        );
        return;
      }

      if (!response.ok || typeof body.url !== "string") {
        setError(body.error || "Could not start checkout. Please try again.");
        return;
      }

      window.location.assign(body.url);
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        size="lg"
        className="w-full"
        onClick={buy}
        disabled={busy}
        aria-busy={busy}
      >
        {busy ? "Opening checkout…" : "Buy credits"}
      </Button>
      {error ? (
        <p className="text-[12px] text-red-400" role="alert">
          {error}
        </p>
      ) : (
        <p className="text-[12px] text-dim">
          Secure checkout on Stripe. Card details never touch this app.
        </p>
      )}
    </div>
  );
}

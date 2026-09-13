import { Navbar } from "@/components/layout/Navbar";
import { BuyCreditsButton } from "@/components/pricing/BuyCreditsButton";
import { clerkEnabled, getViewer } from "@/lib/auth";
import { CREDIT_COST } from "@/lib/costs";
import { prisma } from "@/lib/db";
import { CREDIT_PLANS, formatUsd } from "@/lib/plans";
import { fulfillCheckoutSession } from "@/lib/purchases";
import { stripeEnabled } from "@/lib/stripe";

export const metadata = { title: "Pricing" };

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; session_id?: string }>;
}) {
  const params = await searchParams;

  let viewer = clerkEnabled ? await getViewer() : null;

  let notice: { text: string; tone: "success" | "muted" } | null = null;

  if (params.checkout === "success") {
    /*
     * Fulfil here as well as in the webhook. The webhook is the source of truth,
     * but it can land a beat after the browser returns, and the buyer should not
     * be greeted by an unchanged balance. The write is idempotent, so whichever
     * path runs second is a no-op.
     */
    if (stripeEnabled && params.session_id) {
      try {
        const result = await fulfillCheckoutSession(params.session_id);
        if (result.granted || result.reason === "already-granted") {
          notice = { text: "Payment received — your credits are on the account.", tone: "success" };
        } else {
          notice = { text: "Payment received. Credits will appear shortly.", tone: "success" };
        }
        if (viewer) {
          viewer = (await prisma.user.findUnique({ where: { id: viewer.id } })) ?? viewer;
        }
      } catch {
        notice = {
          text: "Payment received, but we could not confirm it yet — refresh in a moment.",
          tone: "muted",
        };
      }
    } else {
      notice = { text: "Payment received.", tone: "success" };
    }
  } else if (params.checkout === "cancelled") {
    notice = { text: "Checkout cancelled — nothing was charged.", tone: "muted" };
  }

  const plan = CREDIT_PLANS[0];
  const images = Math.floor(plan.credits / CREDIT_COST.image);
  const videos = Math.floor(plan.credits / CREDIT_COST.video);

  return (
    <>
      <Navbar variant="marketing" />
      <main id="main" className="mx-auto max-w-[1600px] px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
            Pricing
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Credits, priced plainly
          </h1>
          <p className="mt-4 text-base text-muted text-pretty">
            Credits are what image and video generation spend. One top-up, no
            subscription, and nothing here counts down to a fake deadline.
          </p>
        </div>

        {notice ? (
          <div
            role="status"
            className={`mx-auto mt-8 max-w-xl rounded-card border px-4 py-3 text-sm ${
              notice.tone === "success"
                ? "border-accent/40 bg-accent/[0.07] text-ink"
                : "border-line bg-surface text-muted"
            }`}
          >
            {notice.text}
          </div>
        ) : null}

        <div className="mx-auto mt-10 max-w-md">
          <div className="relative overflow-hidden rounded-panel border border-accent/30 bg-surface/70 p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-accent/10 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-sm font-medium tracking-[0.14em] text-muted uppercase">
                {plan.name}
              </h2>
              <p className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-semibold tracking-tight">
                  {formatUsd(plan.priceCents)}
                </span>
                <span className="text-sm text-dim">one-time</span>
              </p>
              <p className="mt-3 text-sm text-muted">{plan.description}</p>

              <ul className="mt-6 space-y-2 text-sm text-muted">
                <li>About {images.toLocaleString()} images</li>
                <li>or about {videos.toLocaleString()} video generations</li>
                <li>Credits never expire</li>
              </ul>

              <div className="mt-7">
                <BuyCreditsButton
                  planId={plan.id}
                  signedIn={Boolean(viewer)}
                  paymentsConfigured={stripeEnabled}
                />
              </div>

              {viewer ? (
                <p className="mt-4 text-center text-[13px] text-dim">
                  You currently have{" "}
                  <span className="text-ink">{viewer.creditsBalance}</span>{" "}
                  credits.
                </p>
              ) : null}
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-dim">
            Image generation costs {CREDIT_COST.image} credit, video costs{" "}
            {CREDIT_COST.video}. The starting balance is free.
          </p>
        </div>
      </main>
    </>
  );
}

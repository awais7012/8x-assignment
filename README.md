# 8x-assignment

A working slice of an AI creative studio: sign up, answer a two-question
onboarding quiz, then generate images and short video in a workspace that keeps
your history and a credit balance.

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** — all design tokens live as CSS variables in
  `src/app/globals.css`
- **Clerk** for auth (email + Google)
- **Prisma** + Postgres for persistence
- **Vercel Blob** (optional) for storing generated image bytes

## Routes

| Route        | What it is                                                        |
| ------------ | ----------------------------------------------------------------- |
| `/`          | Landing page. Public — renders with no auth configured.           |
| `/sign-up`   | Clerk sign up, then falls back to the quiz                        |
| `/sign-in`   | Clerk sign in                                                     |
| `/quiz`      | 2-screen onboarding; writes `UserProfile` and sets workspace defaults |
| `/ai/image`  | Image generation (text-to-image, optional reference image)        |
| `/ai/video`  | Video generation (see "Video" below)                              |
| `/pricing`   | Credit packs. Public; buying needs a signed-in account.           |
| `/api/*`     | `generate`, `history`, `profile`, `checkout`, `stripe/webhook`    |

## Running it

```bash
cp .env.example .env   # then fill it in
npm install
npx prisma migrate dev # or: npm run db:migrate against a hosted DB
npm run dev
```

The landing page runs with an empty `.env`. The authenticated workspace needs
Clerk keys; without them those routes render an explicit "auth not configured"
state rather than pretending to be signed in.

## Generation providers

Images go through a fallback chain, because a single rate-limited free tier is
the biggest risk to a live demo:

1. **Gemini** (`GEMINI_API_KEY`) — primary, if a key is set
2. **Pollinations** — no key required, automatic fallback

The provider that actually served each result is stored on the row and shown on
the result card (`Pollinations (fallback)` when it stepped in). Every request has
a hard timeout, and quota exhaustion resolves to a `quota_exceeded` state with a
plain explanation — never an endless spinner.

### Video

There is no free, no-signup, reliable text-to-video API. Pollinations' public API
documents image/text/audio only; its `/video` path returns an image, which was
verified rather than assumed. So video resolves to a curated sample, labelled
**"Sample output — live video generation runs on limited free capacity"** on the
result itself. Disclosed simulation, not a silent fake.

### A note on the art

The four reference screenshots in `assets/` are the visual spec. No source photo
assets exist for the hero and feature tiles, so those areas are built as layered
CSS/SVG gradients (`ArtPanel`) at the correct aspect ratios — vector, themeable,
and swappable for real images later.

## Credits and payments

One-time credit packs bought through **Stripe hosted Checkout** — no
subscriptions, no customer portal, no Stripe.js in the browser. A single pack
($10 → 2,000 credits) is defined in `src/lib/plans.ts`, which both the pricing
page and the checkout route read so the price and the granted credits cannot
drift.

- `POST /api/checkout` (Clerk-gated) creates a Checkout Session and returns its
  URL; the browser is handed to Stripe.
- `POST /api/stripe/webhook` verifies the signature against the **raw** body and
  fulfils `checkout.session.completed`.
- Fulfilment is idempotent: `Purchase.stripeSessionId` is unique, so a retried
  webhook or a double-submitted success page can never grant the same credits
  twice. The success page also fulfils, so a slow webhook never leaves the buyer
  looking at a stale balance.
- The amount is cross-checked against the local price table rather than trusting
  session metadata.

Configure `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`. Until `STRIPE_SECRET_KEY`
is set the app still builds and runs — the pricing page renders and checkout
reports itself as unconfigured, exactly like Clerk. Test mode: pay with
`4242 4242 4242 4242`, any future expiry and CVC. Locally,
`stripe listen --forward-to localhost:3113/api/stripe/webhook` gives you a
`whsec_` to develop against.

## Deliberately out of scope

Cinema Studio camera controls, Soul ID, audio/dubbing, Marketing Studio, motion
transfer, subscriptions and recurring billing, team/org workspaces, and the
original product's fake-scarcity discount countdown. The nav keeps those links so
it matches the reference; they land on a styled "not in this build" page rather
than a 404.

## Agent capture

`.agent-logs/` holds the raw prompt/response record for every session, appended
automatically by `.commandcode/hooks/capture-turn.mjs`. See `CAPTURE-TEST.md`.

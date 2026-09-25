import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/home/FeatureCard";
import { HeroCard } from "@/components/home/HeroCard";
import { PromoPanel } from "@/components/home/PromoPanel";
import { ZentryHero } from "@/components/home/ZentryHero";
import { WorksWheel } from "@/components/ui/works-wheel";
import MetroHero from "@/components/ui/scroll-locked-video-hero";
import { SAMPLE_WORKS } from "@/lib/sample-works";
import { featureCards, heroCards, promo } from "@/lib/home";

/*
 * Homepage — pinned scroll layout.
 *
 * Each major section sits inside a tall "scroll track" div.
 * The inner panel is `position: sticky; top: 0; height: 100vh`
 * so it pins in place while the track scrolls past it,
 * then releases naturally as the next section arrives.
 *
 * Visual result: sections don't just stack — they hold on screen
 * while you scroll through them, then slide away as the next one
 * takes over (Vercel / Apple-style).
 *
 * Track heights are tuned per section:
 *   - ZentryHero: no pin needed (it handles its own scroll internally)
 *   - WorksWheel: 60vh pin so the ring animates before you pass it
 *   - MetroHero: 100vh pin — the scrub player needs room to breathe
 *   - Feature cards: flow normally (no pin — too much content)
 */

export default function HomePage() {
  return (
    <>
      <Navbar variant="marketing" />

      {/* ── 1. ZentryHero — full-bleed cinematic video switcher ──────────────────
          No outer pin track: ZentryHero is already 100dvh and manages its own
          clip-path / scroll animation via GSAP ScrollTrigger internally.
      ─────────────────────────────────────────────────────────────────────────── */}
      <ZentryHero />

      {/* ── 2. WorksWheel — pinned 3-D rotating gallery ──────────────────────────
          Pin track: 100vh (natural view) + 250vh (hold time) = 350vh total.
          WorksWheel's own wheel handler captures scroll events while it turns
          through its items, providing a natural "inner lock". The extra track
          height means the section also holds for 250vh after the wheel reaches
          its last item, giving the page a slow, deliberate feel.
          The header is absolutely overlaid so it doesn't shrink the wheel area.
      ─────────────────────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ height: "calc(100vh + 250vh)" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <section
            aria-label="Works Showcase"
            className="relative h-full w-full"
          >
            {/* Text header — floating at top, doesn't eat wheel height */}
            <div className="absolute top-0 inset-x-0 z-30 pt-8 pb-4 text-center pointer-events-none bg-gradient-to-b from-bg via-bg/80 to-transparent">
              <p className="text-[13px] font-medium tracking-[0.16em] text-accent uppercase">
                Curated Generations
              </p>
              <h2 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
                Explore Visual Horizons
              </h2>
              <p className="mt-1 text-sm text-muted">
                Turn the wheel to discover prompts across our image &amp; video engines.
              </p>
            </div>

            {/* WorksWheel — fills the full pinned screen */}
            <WorksWheel
              items={SAMPLE_WORKS}
              label="Create visuals like this"
              action="Create"
              className="h-full w-full bg-surface/30"
            />

          </section>
        </div>
      </div>

      {/* ── 3. MetroHero — scroll-scrubbed cinematic video ───────────────────────
          Pin track: 100vh (view) + 280vh (scrub room) = 380vh total.
          The MetroHero's internal scroll listener captures wheel events while
          it is in view and uses the delta to scrub video.currentTime.
          We give it a wide track so it has plenty of scroll distance to consume
          before the page releases past it.
          Note: MetroHero itself takes `position: relative; height: 100dvh` —
          the sticky wrapper makes it behave like a pinned panel.
      ─────────────────────────────────────────────────────────────────────────── */}
      <div
        className="relative"
        style={{ height: "calc(100vh + 280vh)" }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <section aria-label="Cinematic Engine" className="h-full">
            <MetroHero
              videoSrc="https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
              title="THE NEXT ERA OF AI CINEMA"
              tagline="Turn one prompt into cinematic reality. Generate, recast, and animate in real time."
              scrollHint="SCROLL TO EXPLORE"
              signature={{ name: "Higgsfield Studio", url: "/ai/video" }}
              scrubDistance={2800}
              style={{ height: "100%" }}
            />
          </section>
        </div>
      </div>

      {/* ── 4. Studio Ecosystem — feature cards (flow, no pin) ───────────────────
          These have too much content to pin cleanly, so they scroll normally.
          A subtle fade-up entrance is handled by the `animate-rise` class
          already on HeroCard and `animate-fade` on FeatureCard.
      ─────────────────────────────────────────────────────────────────────────── */}
      <main id="main" className="mx-auto max-w-[1600px] px-4 pb-24 lg:px-6">
        <section aria-labelledby="featured-heading" className="py-14">
          <div className="mb-8">
            <p className="text-[13px] font-medium tracking-[0.16em] text-accent uppercase">
              Core Studio Models
            </p>
            <h2
              id="featured-heading"
              className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-ink"
            >
              Next-generation creative engines
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {heroCards.map((card, index) => (
              <HeroCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>

        <section className="pb-14" aria-label="Promotion">
          <PromoPanel promo={promo} />
        </section>

        <section aria-labelledby="all-tools-heading" className="pb-8">
          <h2
            id="all-tools-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-ink"
          >
            Everything in the Higgsfield studio
          </h2>
          <p className="mt-2 text-sm text-muted mb-8">
            From motion transfer to prompt-to-video diffusion, access the complete suite of creative AI models.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card, index) => (
              <FeatureCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

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

export default function HomePage() {
  return (
    <>
      <Navbar variant="marketing" />

      {/* 1. Interactive Expandable AI Video Hero */}
      <ZentryHero />

      {/* 2. Interactive 3D WorksWheel Showcase */}
      <section aria-label="Works Showcase" className="mx-auto max-w-[1600px] px-4 py-12 lg:px-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <p className="text-[13px] font-medium tracking-[0.16em] text-accent uppercase">
            Curated Generations
          </p>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Explore Visual Horizons
          </h2>
          <p className="mt-2 text-sm text-muted">
            Turn the wheel to discover prompts across our image &amp; video synthesis engines.
          </p>
        </div>

        <WorksWheel
          items={SAMPLE_WORKS}
          label="Create visuals like this"
          action="Create"
          className="h-[540px] sm:h-[720px] rounded-3xl border border-line bg-surface/30 shadow-2xl"
        />
      </section>

      {/* 3. Scroll-Scrubbed Cinematic Metro Hero Feature */}
      <section aria-label="Cinematic Engine" className="my-10 border-y border-line/60">
        <MetroHero
          videoSrc="https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
          title="THE NEXT ERA OF AI CINEMA"
          tagline="Turn one prompt into cinematic reality. Generate, recast, and animate in real time."
          scrollHint="SCROLL TO EXPLORE"
          signature={{ name: "Higgsfield Studio", url: "/ai/video" }}
        />
      </section>

      {/* 4. Studio Ecosystem & Feature Tools */}
      <main id="main" className="mx-auto max-w-[1600px] px-4 pb-24 lg:px-6">
        <section aria-labelledby="featured-heading" className="py-14">
          <div className="mb-8">
            <p className="text-[13px] font-medium tracking-[0.16em] text-accent uppercase">
              Core Studio Models
            </p>
            <h2 id="featured-heading" className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-ink">
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

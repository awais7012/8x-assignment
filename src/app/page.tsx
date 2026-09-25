import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/home/FeatureCard";
import { HeroCard } from "@/components/home/HeroCard";
import { PromoPanel } from "@/components/home/PromoPanel";
import { ZentryHero } from "@/components/home/ZentryHero";
import { WorksWheel } from "@/components/ui/works-wheel";
import { SAMPLE_WORKS } from "@/lib/sample-works";
import { featureCards, heroCards, promo } from "@/lib/home";

export default function HomePage() {
  return (
    <>
      <Navbar variant="marketing" />

      {/* Interactive Zentry Video Hero */}
      <ZentryHero />

      <main id="main" className="mx-auto max-w-[1600px] px-4 pb-24 lg:px-6">
        {/* Explore what's possible - 3D Works Wheel */}
        <section aria-label="Works Wheel" className="py-8 pb-16">
          <WorksWheel items={SAMPLE_WORKS} label="Works '26" action="Create" className="h-[520px] sm:h-[700px] rounded-3xl border border-line bg-surface/30" />
        </section>

        <section aria-labelledby="featured-heading" className="pb-14">
          <h2 id="featured-heading" className="sr-only-focusable sr-only">
            Featured tools
          </h2>
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
            className="text-2xl font-semibold tracking-tight"
          >
            Everything in the studio
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

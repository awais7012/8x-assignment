import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeatureCard } from "@/components/home/FeatureCard";
import { HeroCard } from "@/components/home/HeroCard";
import { PromoPanel } from "@/components/home/PromoPanel";
import { featureCards, heroCards, promo } from "@/lib/home";

export default function HomePage() {
  return (
    <>
      <Navbar variant="marketing" />

      <main id="main" className="mx-auto max-w-[1600px] px-4 pb-24 lg:px-6">
        <section className="pt-14 pb-12 sm:pt-20">
          <p className="animate-fade text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
            AI video &amp; image studio
          </p>
          <h1 className="animate-rise mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
            Every shot you can imagine, in one studio.
          </h1>
          <p className="animate-rise mt-5 max-w-2xl text-base text-muted text-pretty sm:text-lg" style={{ "--i": 1 } as React.CSSProperties}>
            Generate cinematic clips and product-ready stills, recast the motion
            from a single reference video, and keep everything you make in one
            place.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap items-center gap-3" style={{ "--i": 2 } as React.CSSProperties}>
            <Link
              href="/sign-up"
              className="inline-flex h-12 items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
            >
              Start creating
            </Link>
            <Link
              href="/ai/video"
              className="inline-flex h-12 items-center justify-center rounded-full border border-line-strong px-6 text-base font-semibold text-ink transition-colors duration-200 hover:bg-surface-2"
            >
              Open the studio
            </Link>
          </div>
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

"use client";

import { useRef } from "react";
import { WorksWheel } from "@/components/ui/works-wheel";
import MetroHero, { WHEEL_REVEAL_START } from "@/components/ui/scroll-locked-video-hero";
import { SAMPLE_WORKS } from "@/lib/sample-works";

export function SectionHandoff() {
  const wheelPanelRef = useRef<HTMLDivElement>(null);

  const revealWheel = (progress: number, targetProgress: number) => {
    const panel = wheelPanelRef.current;
    if (!panel) return;

    const reveal = Math.min(
      1,
      Math.max(0, (progress - WHEEL_REVEAL_START) / (1 - WHEEL_REVEAL_START)),
    );
    panel.style.opacity = String(reveal);
    panel.style.pointerEvents = targetProgress >= 0.999 ? "auto" : "none";
  };

  return (
    <div style={{ height: "calc(100vh + max(280vh, 2800px))" }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <section aria-label="Cinematic Engine" className="h-full">
            <MetroHero
              videoSrc="https://cdn.21st.dev/assets/mirror/21/21a77eac28eacbb7e142016eefeaa0b4a766619e51113629a3bc6df6af066c0f.mp4"
              title="THE NEXT ERA OF AI CINEMA"
              tagline="Turn one prompt into cinematic reality. Generate, recast, and animate in real time."
              scrollHint="SCROLL TO EXPLORE"
              signature={{ name: "Higgsfield Studio", url: "/ai/video" }}
              scrubDistance={2800}
              onProgress={revealWheel}
              style={{ height: "100%" }}
            />
          </section>
        </div>
        <div
          ref={wheelPanelRef}
          className="absolute inset-0 z-10 opacity-0"
          style={{ pointerEvents: "none" }}
        >
          <section aria-label="Works Showcase" className="relative h-full w-full">
            <div className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-bg via-bg/80 to-transparent px-4 pt-8 pb-4 text-center pointer-events-none">
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
            <WorksWheel
              items={SAMPLE_WORKS}
              label="Create visuals like this"
              action="Create"
              className="h-full w-full bg-background"
            />
          </section>
        </div>
      </div>
    </div>
  );
}
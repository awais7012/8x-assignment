"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ImageOff, Sparkles, Cpu, Layers, Palette, CheckCircle2, ArrowRight } from "lucide-react";
import type { GenerationDTO } from "@/lib/serialize";
import { SAMPLE_DISCLOSURE } from "@/lib/video-samples";
import { VideoSample } from "./VideoSample";

export function providerLabel(
  generation: GenerationDTO,
  geminiConfigured: boolean,
) {
  if (generation.provider === "sample") return "Sample Video";
  if (generation.provider.startsWith("gemini")) return "Gemini AI Engine";
  if (generation.provider === "pollinations") {
    return geminiConfigured ? "Pollinations AI (fallback)" : "Pollinations AI";
  }
  return generation.provider;
}

const AGENT_STEPS = [
  { icon: Sparkles, text: "Thinking... Parsing prompt tokens & semantic style" },
  { icon: Cpu, text: "Allocating neural render cluster & initializing latent seed" },
  { icon: Layers, text: "Synthesizing multi-pass diffusion layers (1024x1024)" },
  { icon: Palette, text: "Color grading, upscaling & finalizing image bytes" },
];

export function GenerationResult({
  generation,
  busy,
  geminiConfigured,
  onRetry,
}: {
  generation: GenerationDTO | null;
  busy: boolean;
  geminiConfigured: boolean;
  onRetry: () => void;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  // Dynamic agent thinking step progression
  useEffect(() => {
    if (!busy) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < AGENT_STEPS.length - 1 ? prev + 1 : prev));
    }, 2800);

    return () => clearInterval(interval);
  }, [busy]);

  if (busy && (!generation || generation.status !== "processing")) {
    const CurrentIcon = AGENT_STEPS[stepIndex].icon;

    return (
      <div className="flex flex-col items-center justify-center rounded-panel border border-accent/40 bg-surface/60 p-8 sm:p-12 text-center aspect-square sm:aspect-video relative overflow-hidden shadow-[0_0_50px_rgba(221,247,82,0.1)]">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-accent/15 blur-3xl animate-pulse" />

        {/* Step indicator box */}
        <div className="relative z-10 flex flex-col items-center max-w-md w-full space-y-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 border border-accent/40 text-accent shadow-lg shadow-accent/20 animate-bounce">
            <CurrentIcon size={26} />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Agent Workflow · Step {stepIndex + 1} of {AGENT_STEPS.length}
            </p>
            <h3 className="text-base sm:text-lg font-semibold text-ink transition-all duration-300">
              {AGENT_STEPS[stepIndex].text}
            </h3>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-surface-2 rounded-full h-2 overflow-hidden border border-line">
            <div
              className="bg-accent h-full transition-all duration-700 ease-out"
              style={{ width: `${((stepIndex + 1) / AGENT_STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step list checklist */}
          <div className="flex flex-col gap-2 w-full text-left pt-2">
            {AGENT_STEPS.map((step, idx) => (
              <div
                key={step.text}
                className={`flex items-center gap-2.5 text-xs transition-opacity duration-300 ${
                  idx <= stepIndex ? "text-ink opacity-100 font-medium" : "text-muted/40 opacity-40"
                }`}
              >
                {idx < stepIndex ? (
                  <CheckCircle2 size={14} className="text-accent shrink-0" />
                ) : idx === stepIndex ? (
                  <div className="h-3 w-3 rounded-full border-2 border-accent border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-line shrink-0" />
                )}
                <span className="truncate">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-line bg-surface/30 p-8 text-center sm:aspect-video">
        <ImageOff aria-hidden size={24} className="text-dim" />
        <p className="max-w-sm text-sm text-muted">
          Describe a shot in the composer and click Generate. Live generations will render here and persist across sessions.
        </p>
      </div>
    );
  }

  if (generation.status === "quota_exceeded") {
    return (
      <div className="rounded-panel border border-danger/40 bg-danger/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle aria-hidden size={20} />
          <p className="text-base font-semibold">Free Neural Tier Capacity Exhausted</p>
        </div>
        <p className="text-sm text-muted">
          {generation.provider === "pollinations"
            ? "Pollinations is rate-limiting anonymous requests (about 1 every 15s). Wait a brief moment and retry, or top up for dedicated throughput."
            : "The free tier capacity is currently busy. You were not charged for this attempt."}
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Try again
          </button>
          <Link
            href="/pricing"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
          >
            Get Credit Pack <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (generation.status === "failed") {
    return (
      <div className="rounded-panel border border-danger/40 bg-danger/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle aria-hidden size={20} />
          <p className="text-base font-semibold">Generation Failed</p>
        </div>
        <p className="text-sm text-muted">
          No neural backend returned visual data. Your credits were not deducted.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-panel border border-line bg-surface/40 shadow-xl">
      {generation.type === "video" ? (
        <VideoSample prompt={generation.prompt} className="rounded-none border-0" />
      ) : generation.resultUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={generation.resultUrl}
          alt={generation.prompt}
          loading="lazy"
          className="aspect-square w-full object-cover sm:aspect-video"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center text-sm text-muted sm:aspect-video">
          No image returned.
        </div>
      )}
      <figcaption className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line px-4 py-3 text-[12px] text-dim bg-surface/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-accent font-medium">
            {providerLabel(generation, geminiConfigured)}
          </span>
          <span className="text-ink font-semibold">{generation.creditsCost} credit used</span>
        </div>
        <span className="min-w-0 flex-1 truncate text-right text-muted">{generation.prompt}</span>
      </figcaption>
      {generation.type === "video" ? (
        <p className="sr-only">{SAMPLE_DISCLOSURE}</p>
      ) : null}
    </figure>
  );
}

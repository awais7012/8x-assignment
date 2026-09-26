"use client";

import { AlertTriangle, ImageOff, LoaderCircle } from "lucide-react";
import type { GenerationDTO } from "@/lib/serialize";
import { VIDEO_SAMPLES } from "@/lib/demo-media";
import { SAMPLE_DISCLOSURE } from "@/lib/video-samples";
import { VideoSample } from "./VideoSample";

export function providerLabel(generation: GenerationDTO) {
  if (generation.provider === "demo-local") return "Local demo";
  if (generation.provider === "sample") return "Sample video";
  if (generation.provider.startsWith("gemini")) return "Gemini AI Engine";
  if (generation.provider === "pollinations") return "Pollinations AI";
  return generation.provider;
}

export function GenerationResult({
  generation,
  busy,
  onRetry,
}: {
  generation: GenerationDTO | null;
  busy: boolean;
  onRetry: () => void;
}) {
  if (busy) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-panel border border-line bg-surface/60 p-8 text-center sm:aspect-video">
        <LoaderCircle aria-hidden size={28} className="animate-spin text-accent" />
        <p className="text-sm font-medium text-ink">Preparing local demo sample…</p>
        <p className="text-xs text-muted">No external image or video service is called.</p>
        </div>
    );
  }

  if (!generation) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-line bg-surface/30 p-8 text-center sm:aspect-video">
        <ImageOff aria-hidden size={24} className="text-dim" />
        <p className="max-w-sm text-sm text-muted">
          Choose a prompt to display one of the bundled demo samples.
        </p>
      </div>
    );
  }

  if (generation.status === "quota_exceeded" || generation.status === "failed") {
    return (
      <div className="rounded-panel border border-danger/40 bg-danger/[0.06] p-6 space-y-4">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle aria-hidden size={20} />
          <p className="text-base font-semibold">Demo Result Failed</p>
        </div>
        <p className="text-sm text-muted">The demo result could not be saved. No credits were used.</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-panel border border-line bg-surface/40 shadow-xl">
      {generation.type === "video" ? (
        <VideoSample
          prompt={generation.prompt}
          src={generation.resultUrl || VIDEO_SAMPLES[0]}
          className="rounded-none border-0"
        />
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
            {providerLabel(generation)}
          </span>
          <span className="text-ink font-semibold">No credits used</span>
        </div>
        <span className="min-w-0 flex-1 truncate text-right text-muted">{generation.prompt}</span>
      </figcaption>
      {generation.type === "video" ? (
        <p className="sr-only">{SAMPLE_DISCLOSURE}</p>
      ) : null}
    </figure>
  );
}

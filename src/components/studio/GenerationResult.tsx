import { AlertTriangle, ImageOff } from "lucide-react";
import type { GenerationDTO } from "@/lib/serialize";
import { SAMPLE_DISCLOSURE } from "@/lib/video-samples";
import { VideoSample } from "./VideoSample";

export function providerLabel(
  generation: GenerationDTO,
  geminiConfigured: boolean,
) {
  if (generation.provider === "sample") return "Sample";
  if (generation.provider.startsWith("gemini")) return "Gemini";
  if (generation.provider === "pollinations") {
    return geminiConfigured ? "Pollinations (fallback)" : "Pollinations";
  }
  return generation.provider;
}

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
  if (busy && (!generation || generation.status !== "processing")) {
    return (
      <div className="flex aspect-square w-full animate-pulse items-center justify-center rounded-panel border border-line bg-surface/40 sm:aspect-video">
        <p className="text-sm text-muted" role="status">
          Generating…
        </p>
      </div>
    );
  }

  if (!generation) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-panel border border-dashed border-line bg-surface/30 p-8 text-center sm:aspect-video">
        <ImageOff aria-hidden size={22} className="text-dim" />
        <p className="max-w-sm text-sm text-muted">
          Describe a shot and generate. Results are saved to your history and
          cost credits from your balance.
        </p>
      </div>
    );
  }

  if (generation.status === "quota_exceeded") {
    return (
      <div className="rounded-panel border border-danger/40 bg-danger/[0.06] p-6">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle aria-hidden size={18} />
          <p className="text-sm font-semibold">Free capacity exhausted</p>
        </div>
        <p className="mt-3 text-sm text-muted">
          {generation.provider === "pollinations"
            ? "Pollinations is rate limiting anonymous requests — about one every 15 seconds. Wait a moment and try again; nothing was charged."
            : "The primary provider's free quota is exhausted. The fallback did not return a result either. Nothing was charged."}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (generation.status === "failed") {
    return (
      <div className="rounded-panel border border-danger/40 bg-danger/[0.06] p-6">
        <div className="flex items-center gap-2 text-danger">
          <AlertTriangle aria-hidden size={18} />
          <p className="text-sm font-semibold">Generation failed</p>
        </div>
        <p className="mt-3 text-sm text-muted">
          No provider returned a result. Nothing was charged.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <figure className="overflow-hidden rounded-panel border border-line bg-surface/40">
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
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line px-4 py-3 text-[12px] text-dim">
        <span className="rounded-full border border-line px-2 py-0.5 text-muted">
          {providerLabel(generation, geminiConfigured)}
        </span>
        <span>{generation.creditsCost} credits</span>
        <span className="min-w-0 flex-1 truncate">{generation.prompt}</span>
      </figcaption>
      {generation.type === "video" ? (
        <p className="sr-only">{SAMPLE_DISCLOSURE}</p>
      ) : null}
    </figure>
  );
}

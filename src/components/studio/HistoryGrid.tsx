import { ArtPanel } from "@/components/ui/ArtPanel";
import type { GenerationDTO } from "@/lib/serialize";
import { SAMPLE_ART, categorizePrompt } from "@/lib/video-samples";
import { providerLabel } from "./GenerationResult";

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "complete"
      ? "text-accent border-accent/40"
      : status === "quota_exceeded" || status === "failed"
        ? "text-danger border-danger/40"
        : "text-muted border-line";

  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-[0.06em] uppercase ${tone}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function HistoryGrid({
  generations,
  geminiConfigured,
}: {
  generations: GenerationDTO[];
  geminiConfigured: boolean;
}) {
  if (!generations.length) {
    return (
      <p className="rounded-card border border-dashed border-line p-6 text-sm text-muted">
        Nothing here yet. Your generations will collect in this list and persist
        across sessions.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-3">
      {generations.map((generation) => (
        <li
          key={generation.id}
          className="overflow-hidden rounded-card border border-line bg-surface/40"
        >
          <div className="relative aspect-square">
            {generation.status === "complete" && generation.type === "image" && generation.resultUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={generation.resultUrl}
                alt={generation.prompt}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <ArtPanel
                variant={
                  generation.type === "video"
                    ? SAMPLE_ART[categorizePrompt(generation.prompt)]
                    : "ambient-cool"
                }
                dim={generation.type === "image"}
              />
            )}
          </div>
          <div className="space-y-1.5 p-2.5">
            <StatusPill status={generation.status} />
            <p className="line-clamp-2 text-[12px] text-muted">
              {generation.prompt}
            </p>
            <p className="text-[10px] tracking-[0.04em] text-dim uppercase">
              {providerLabel(generation, geminiConfigured)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

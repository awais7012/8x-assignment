import { ArtPanel } from "@/components/ui/ArtPanel";
import { cn } from "@/lib/cn";
import {
  SAMPLE_ART,
  SAMPLE_CAPTION,
  SAMPLE_DISCLOSURE,
  categorizePrompt,
} from "@/lib/video-samples";

/*
 * This is not a generated video and never pretends to be one: the disclosure is
 * always rendered with it, and the card is badged. Canned output passed off as
 * real would misrepresent what was built.
 */
export function VideoSample({
  prompt,
  className,
}: {
  prompt: string;
  className?: string;
}) {
  const category = categorizePrompt(prompt);

  return (
    <figure
      className={cn(
        "relative aspect-video overflow-hidden rounded-card border border-line",
        className,
      )}
    >
      <div className="absolute inset-0 animate-drift">
        <ArtPanel variant={SAMPLE_ART[category]} dim={false} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10"
      />
      <span className="absolute top-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-ink uppercase backdrop-blur">
        Sample
      </span>
      <figcaption className="absolute inset-x-4 bottom-4">
        <p className="text-sm font-semibold text-ink">
          {SAMPLE_CAPTION[category]}
        </p>
        <p className="mt-0.5 text-[12px] text-muted">{SAMPLE_DISCLOSURE}</p>
      </figcaption>
    </figure>
  );
}

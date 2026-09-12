import { cn } from "@/lib/cn";

type Tone = "new" | "free" | "top" | "discount" | "neutral";

export type BadgeTone = Tone;

const tones: Record<Tone, string> = {
  new: "bg-accent text-accent-ink",
  free: "bg-surface-2 text-ink border border-line-strong",
  top: "bg-accent text-accent-ink",
  discount: "bg-accent text-accent-ink",
  neutral: "bg-surface-2 text-muted border border-line",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] leading-4 font-bold tracking-[0.08em] uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

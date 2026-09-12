import Link from "next/link";
import type { CSSProperties } from "react";
import { ArtPanel } from "@/components/ui/ArtPanel";
import { Badge } from "@/components/ui/Badge";
import type { FeatureCard as FeatureCardSpec } from "@/lib/types";

export function FeatureCard({
  card,
  index,
}: {
  card: FeatureCardSpec;
  index: number;
}) {
  const Icon = card.icon;

  return (
    <Link
      href={card.href}
      className="animate-fade group relative flex min-h-[190px] flex-col justify-between overflow-hidden rounded-card border border-line p-5 transition-colors duration-300 hover:border-line-strong"
      style={{ "--i": index } as CSSProperties}
    >
      <ArtPanel variant={card.art} dim={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
      <div className="relative z-10 flex items-start justify-between">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line-strong bg-black/30 text-ink">
          <Icon aria-hidden size={18} />
        </span>
        {card.badge ? (
          <Badge tone={card.badge.tone}>{card.badge.text}</Badge>
        ) : null}
      </div>
      <div className="relative z-10">
        <h3 className="text-base font-semibold tracking-tight">{card.title}</h3>
        <p className="mt-1 text-[13px] text-muted">{card.description}</p>
      </div>
    </Link>
  );
}

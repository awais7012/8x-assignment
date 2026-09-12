import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { ArtPanel } from "@/components/ui/ArtPanel";
import { Badge } from "@/components/ui/Badge";
import type { HeroCard as HeroCardSpec } from "@/lib/types";

export function HeroCard({
  card,
  index,
}: {
  card: HeroCardSpec;
  index: number;
}) {
  return (
    <Link
      href={card.href}
      className="animate-rise group relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-panel border border-line p-6 transition-colors duration-300 hover:border-line-strong"
      style={{ "--i": index } as CSSProperties}
    >
      <ArtPanel variant={card.art} />
      <ArrowUpRight
        aria-hidden
        size={20}
        className="absolute top-5 right-5 z-10 -translate-y-1 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      />
      <div className="relative z-10">
        {card.badge ? (
          <Badge tone={card.badge.tone}>{card.badge.text}</Badge>
        ) : null}
        <h3 className="mt-3 text-xl font-semibold tracking-tight">
          {card.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted">{card.description}</p>
      </div>
    </Link>
  );
}

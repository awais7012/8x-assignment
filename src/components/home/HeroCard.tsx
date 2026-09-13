import Image from "next/image";
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
      {card.image ? (
        <>
          <Image
            src={card.image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            priority={index === 0}
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15"
          />
        </>
      ) : (
        <ArtPanel variant={card.art} />
      )}
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

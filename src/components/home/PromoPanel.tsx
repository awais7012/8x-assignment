import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import type { PromoPanel as PromoPanelSpec } from "@/lib/types";

export function PromoPanel({ promo }: { promo: PromoPanelSpec }) {
  return (
    <div className="relative overflow-hidden rounded-panel border border-accent/30 bg-accent/[0.06] p-8 sm:p-10">
      {promo.image ? (
        <>
          <Image
            src={promo.image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40"
          />
        </>
      ) : null}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
      />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {promo.title}
          </h2>
          <ul className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
            {promo.benefits.map((benefit) => (
              <li
                key={benefit}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <Check aria-hidden size={16} className="text-accent" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/sign-up"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-base font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
        >
          {promo.cta}
        </Link>
      </div>
    </div>
  );
}

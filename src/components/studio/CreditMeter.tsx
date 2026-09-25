import Link from "next/link";
import { Coins, AlertCircle, Plus, Zap } from "lucide-react";

export function CreditMeter({
  credits,
  cost,
}: {
  credits: number;
  cost: number;
}) {
  const estimate = cost > 0 ? Math.floor(credits / cost) : 0;
  const isOutOfCredits = credits < cost;
  const isLowCredits = credits < cost * 3 && !isOutOfCredits;

  return (
    <div
      className={`rounded-card border p-4 transition-all duration-300 ${
        isOutOfCredits
          ? "border-danger/50 bg-danger/[0.08] shadow-[0_0_20px_rgba(255,107,107,0.15)]"
          : isLowCredits
          ? "border-amber-400/40 bg-amber-400/[0.06]"
          : "border-line bg-surface/70"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isOutOfCredits
                ? "bg-danger/20 text-danger"
                : isLowCredits
                ? "bg-amber-400/20 text-amber-300"
                : "bg-accent/15 text-accent"
            }`}
          >
            {isOutOfCredits ? <AlertCircle size={16} /> : <Coins size={16} />}
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider font-medium">Balance</p>
            <p className="text-lg font-bold text-ink leading-tight">
              {credits.toLocaleString()}{" "}
              <span className="text-xs font-normal text-muted">credits</span>
            </p>
          </div>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-ink transition-transform hover:scale-105 shadow-md shadow-accent/15"
        >
          <Plus size={13} />
          Top Up
        </Link>
      </div>

      <div className="mt-3.5 pt-3 border-t border-line/60 flex items-center justify-between text-[12px]">
        <span className="text-dim">
          Cost: <strong className="text-ink font-semibold">{cost} cr</strong> / gen
        </span>
        <span
          className={`font-medium ${
            isOutOfCredits ? "text-danger" : isLowCredits ? "text-amber-300" : "text-muted"
          }`}
        >
          {isOutOfCredits
            ? "Zero generations left"
            : `≈ ${estimate} generation${estimate === 1 ? "" : "s"} left`}
        </span>
      </div>

      {isOutOfCredits && (
        <div className="mt-2.5 rounded-lg bg-danger/10 border border-danger/30 p-2 text-center text-xs text-danger font-medium">
          Insufficient credits for generation.
        </div>
      )}
    </div>
  );
}

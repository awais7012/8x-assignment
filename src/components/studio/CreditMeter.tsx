import Link from "next/link";

export function CreditMeter({
  credits,
  cost,
}: {
  credits: number;
  cost: number;
}) {
  const estimate = cost > 0 ? Math.floor(credits / cost) : 0;

  return (
    <div className="rounded-card border border-line bg-surface/60 px-4 py-3">
      <p className="text-[13px] text-muted">
        <span className="text-lg font-semibold text-ink">{credits}</span>{" "}
        credits
      </p>
      <p className="mt-0.5 text-[12px] text-dim">
        {cost} per generation · about {estimate} left
      </p>
      <Link
        href="/pricing"
        className="mt-2 inline-flex text-[12px] font-medium text-accent transition-colors hover:text-accent-hover"
      >
        Get more credits
      </Link>
    </div>
  );
}

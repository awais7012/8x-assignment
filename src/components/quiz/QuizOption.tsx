"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import type { QuizOption as QuizOptionSpec } from "@/lib/types";

export function QuizOption({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: QuizOptionSpec;
  selected: boolean;
  disabled?: boolean;
  onSelect: (value: string) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={() => onSelect(option.value)}
      className={cn(
        "group flex w-full items-center gap-4 rounded-card border px-5 py-4 text-left transition-all duration-200",
        "disabled:pointer-events-none disabled:opacity-60",
        selected
          ? "border-accent bg-accent/[0.08]"
          : "border-line bg-surface/60 hover:border-line-strong hover:bg-surface-2",
      )}
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-ink">
          {option.label}
        </span>
        {option.description ? (
          <span className="mt-0.5 block text-[13px] text-muted">
            {option.description}
          </span>
        ) : null}
      </span>
      <span
        aria-hidden
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-200",
          selected
            ? "border-accent bg-accent text-accent-ink"
            : "border-line-strong text-transparent group-hover:border-muted",
        )}
      >
        <Check size={14} />
      </span>
    </button>
  );
}

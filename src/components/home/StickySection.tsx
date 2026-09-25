"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * StickySection — pins its children at top:0 for `pinHeight` scroll distance,
 * then releases naturally. Used to create Apple/Vercel-style scroll-locked panels.
 *
 * The outer div creates the scroll track (height = 100vh + pinHeight).
 * The inner div is sticky and stays in view until the track is exhausted.
 */
export function StickySection({
  children,
  pinHeight = "100vh",
  className,
  innerClassName,
  id,
}: {
  children: React.ReactNode;
  /** Extra scroll distance to hold the pin. '100vh' = hold for one full screen of scroll. */
  pinHeight?: string;
  className?: string;
  innerClassName?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn("relative", className)}
      style={{ height: `calc(100vh + ${pinHeight})` }}
    >
      <div
        className={cn(
          "sticky top-0 h-screen w-full overflow-hidden",
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * useStickyProgress — returns a [0, 1] progress value driven by scroll
 * within the sticky section's pin track. 0 = just pinned, 1 = about to release.
 * Drives scroll-scrubbed animations inside a StickySection.
 */
export function useStickyProgress(
  containerRef: React.RefObject<HTMLElement | null>,
  pinHeight = "100vh"
): React.MutableRefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    // Resolve pinHeight to pixels
    const getPinPx = () => {
      if (pinHeight.endsWith("vh")) {
        return (parseFloat(pinHeight) / 100) * window.innerHeight;
      }
      if (pinHeight.endsWith("px")) {
        return parseFloat(pinHeight);
      }
      return window.innerHeight;
    };

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const pinPx = getPinPx();
      // rect.top goes from 0 (just pinned) to -pinPx (about to release)
      const raw = -rect.top / pinPx;
      progress.current = Math.min(1, Math.max(0, raw));
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [containerRef, pinHeight]);

  return progress;
}

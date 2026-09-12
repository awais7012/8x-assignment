import Link from "next/link";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/ai/image", label: "Image", hint: "Text to image" },
  { href: "/ai/video", label: "Video", hint: "Text to video" },
];

export function WorkspaceTabs({ active }: { active: "image" | "video" }) {
  return (
    <nav
      aria-label="Workspace mode"
      className="inline-flex items-center gap-1 rounded-full border border-line bg-surface/60 p-1"
    >
      {tabs.map((tab) => {
        const isActive = tab.href.endsWith(active);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-accent text-accent-ink"
                : "text-muted hover:bg-surface-2 hover:text-ink",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "hidden text-[11px] sm:inline",
                isActive ? "text-accent-ink/70" : "text-dim",
              )}
            >
              {tab.hint}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

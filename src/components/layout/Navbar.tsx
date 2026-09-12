"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { primaryNav, studioNavExtra } from "@/lib/nav";
import { cn } from "@/lib/cn";

function Logo() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2"
      aria-label="Higgsfield home"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden
        className="text-accent"
      >
        <path
          d="M11 0.8 21.2 6.7v8.6L11 21.2 0.8 15.3V6.7L11 0.8Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M11 6.4 16.6 9.6v4.8L11 17.6 5.4 14.4V9.6L11 6.4Z" fill="currentColor" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight">
        Higgsfield
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  badge,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  badge?: { text: string; tone: "new" | "free" | "top" | "discount" | "neutral" };
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative inline-flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors duration-200",
        active ? "text-ink" : "text-muted hover:text-ink",
      )}
    >
      {label}
      {badge ? (
        <Badge tone={badge.tone} className="translate-y-[-4px] px-1.5 py-0">
          {badge.text}
        </Badge>
      ) : null}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ease-out",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}

export function Navbar({
  variant = "marketing",
  activeHref,
}: {
  variant?: "marketing" | "studio";
  activeHref?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const items =
    variant === "studio" ? [...primaryNav, studioNavExtra] : primaryNav;

  const isActive = (href: string) => {
    const target = href.split("?")[0];
    const current = activeHref ?? pathname;
    if (target === "/") return current === "/";
    return current === target || current.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-2 px-4 lg:px-6">
        <Logo />

        <nav aria-label="Primary" className="ml-2 hidden flex-1 items-center xl:flex">
          {items.map((item) => (
            <NavLink
              key={item.label}
              href={item.href}
              label={item.label}
              badge={item.badge}
              active={isActive(item.href)}
            />
          ))}
        </nav>
        <div className="flex-1 xl:hidden" />

        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Link
            href="/sign-in"
            className="hidden h-9 items-center justify-center rounded-full px-4 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-ink lg:inline-flex"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-ink transition-colors duration-200 hover:bg-accent-hover"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-2 xl:hidden"
        >
          {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
        </button>
      </div>

      <div
        id={panelId}
        hidden={!open}
        className="border-t border-line bg-bg px-4 pb-4 xl:hidden"
      >
        <nav aria-label="Mobile" className="flex flex-col py-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-surface-2 text-ink"
                  : "text-muted hover:bg-surface-2 hover:text-ink",
              )}
            >
              {item.label}
              {item.badge ? (
                <Badge tone={item.badge.tone}>{item.badge.text}</Badge>
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-line pt-3">
          <Link
            href="/sign-in"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface-2 px-5 text-sm font-semibold text-ink transition-colors hover:bg-elevated"
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

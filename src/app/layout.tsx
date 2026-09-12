import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkEnabled } from "@/lib/auth";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Higgsfield — AI video & image studio",
    template: "%s · Higgsfield",
  },
  description:
    "Turn one video into many, generate cinematic visuals, and ship viral content from a single studio.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const tree = (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-dvh bg-bg text-ink">
        <a
          href="#main"
          className="sr-only-focusable fixed top-4 left-4 z-[100] rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );

  // Clerk is only mounted when configured, so the signed-out landing page never
  // depends on auth being set up.
  return clerkEnabled ? <ClerkProvider>{tree}</ClerkProvider> : tree;
}

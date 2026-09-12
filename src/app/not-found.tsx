import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar variant="marketing" />
      <main
        id="main"
        className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center"
      >
        <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
          Not in this build
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          That surface was cut from the 24-hour scope.
        </h1>
        <p className="mt-4 text-base text-muted text-pretty">
          Image generation, video generation and the onboarding quiz are live.
          Everything else in the nav is a deliberate cut — the links are kept so
          the navigation matches the reference.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/ai/image"
            className="inline-flex h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
          >
            Generate an image
          </Link>
          <Link
            href="/ai/video"
            className="inline-flex h-11 items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
          >
            Generate a video
          </Link>
        </div>
      </main>
    </>
  );
}

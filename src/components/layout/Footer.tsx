import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-4 py-10 text-sm text-dim sm:flex-row sm:items-center sm:justify-between lg:px-6">
        <p>
          A clone built for the 8x assignment — not affiliated with Higgsfield.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/ai/image" className="transition-colors hover:text-ink">
            Image
          </Link>
          <Link href="/ai/video" className="transition-colors hover:text-ink">
            Video
          </Link>
          <Link href="/quiz" className="transition-colors hover:text-ink">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}

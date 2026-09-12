import Link from "next/link";

/*
 * Rendered instead of a gated surface when Clerk keys are absent. The app is
 * deliberately not faked into a signed-in state - it says what is missing.
 */
export function AuthNotConfigured() {
  return (
    <main
      id="main"
      className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16"
    >
      <p className="text-[13px] font-medium tracking-[0.14em] text-accent uppercase">
        Auth not configured
      </p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        This surface needs Clerk keys.
      </h1>
      <p className="mt-4 text-base text-muted text-pretty">
        Add the following to <code className="text-ink">.env</code> and restart,
        then sign in to use the workspace:
      </p>
      <pre className="mt-5 overflow-x-auto rounded-card border border-line bg-surface p-4 text-[13px] text-muted">
{`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...`}
      </pre>
      <p className="mt-5 text-sm text-dim">
        The landing page and all generation code work without it — only the
        authenticated workspace is gated. See{" "}
        <code className="text-muted">.env.example</code> for the full list.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 w-fit items-center justify-center rounded-full border border-line-strong px-5 text-sm font-semibold text-ink transition-colors hover:bg-surface-2"
      >
        Back to the landing page
      </Link>
    </main>
  );
}

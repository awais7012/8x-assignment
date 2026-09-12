import { auth, currentUser } from "@clerk/nextjs/server";
import { clerkEnabled } from "./clerk-config";
import { prisma } from "./db";

/*
 * Clerk is the spec'd auth provider, but the public landing page must render
 * with no configuration at all (a judge opening the URL is not logged in).
 * So the provider is only mounted, and the middleware only enforced, when both
 * keys are present. Gated surfaces call `getViewer()` and render an explicit
 * "auth not configured" state otherwise - never a crash and never a fake user.
 */
export { clerkEnabled };

async function ensureUser(id: string, email: string) {
  return prisma.user.upsert({
    where: { id },
    update: { email },
    create: { id, email },
  });
}

export async function getViewer() {
  if (!clerkEnabled) return null;

  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress;
  if (!email) return null;

  return ensureUser(userId, email);
}

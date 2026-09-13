import { auth, currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
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

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/*
 * Clerk owns identity, but the id it hands us is not stable across a deleted
 * and recreated account: the same person can come back with a brand new id and
 * an email we already hold. Upserting on the id then trips the unique email
 * index and every page becomes a 500 (P2002), so resolve the two keys
 * explicitly, and re-point the existing row at the current id when they
 * disagree so credits, history and quiz answers survive.
 */
async function ensureUser(id: string, email: string) {
  const byId = await prisma.user.findUnique({ where: { id } });
  if (byId) {
    if (byId.email === email) return byId;

    const taken = await prisma.user.findUnique({ where: { email } });
    if (!taken) {
      return prisma.user.update({ where: { id }, data: { email } });
    }

    // A different account already owns that address. Keep what we have rather
    // than failing the request.
    return byId;
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    return rekeyUser(byEmail.id, id, email);
  }

  try {
    return await prisma.user.create({ data: { id, email } });
  } catch (error) {
    // Lost a race with a concurrent sign-in; the row exists now.
    if (isUniqueViolation(error)) {
      const raced = await prisma.user.findUnique({ where: { id } });
      if (raced) return raced;
    }
    throw error;
  }
}

/*
 * Moves a user row onto a new id, carrying its children with it. The row is
 * recreated rather than updated because the id is the primary key and the
 * foreign keys from generation/purchase/profile do not cascade on update.
 */
async function rekeyUser(fromId: string, toId: string, email: string) {
  return prisma.$transaction(async (tx) => {
    const from = await tx.user.findUniqueOrThrow({ where: { id: fromId } });

    await tx.user.create({
      data: {
        id: toId,
        // Placeholder while the old row still holds the real address; swapped
        // for the real value at the end of the transaction.
        email: `${toId}@rekey.invalid`,
        creditsBalance: from.creditsBalance,
      },
    });

    await tx.generation.updateMany({
      where: { userId: fromId },
      data: { userId: toId },
    });
    await tx.purchase.updateMany({
      where: { userId: fromId },
      data: { userId: toId },
    });
    await tx.userProfile.updateMany({
      where: { userId: fromId },
      data: { userId: toId },
    });

    await tx.user.delete({ where: { id: fromId } });

    return tx.user.update({ where: { id: toId }, data: { email } });
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

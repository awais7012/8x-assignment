/*
 * Kept free of Prisma and Clerk server imports so the edge middleware can read
 * it without dragging the database client into the edge bundle.
 */
export const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

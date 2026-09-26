import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import { clerkEnabled } from "@/lib/clerk-config";

/*
 * When Clerk is not configured there is nothing to enforce, so the middleware is
 * a pass-through: the landing page must never depend on auth being set up.
 */
const handler = clerkEnabled
  ? clerkMiddleware()
  : function passthrough(_request: NextRequest) {
      return NextResponse.next();
    };

export default handler;

export const config = {
  matcher: [
    // Skip Next internals and static files unless they are search params.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};

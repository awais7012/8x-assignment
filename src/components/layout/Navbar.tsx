import { clerkEnabled } from "@/lib/clerk-config";
import { NavbarClient } from "./NavbarClient";

/*
 * Server wrapper: ClerkProvider is only mounted when Clerk is configured, so
 * the client shell needs to know at render time whether it may render Clerk's
 * auth components. Keeping the flag on the server avoids threading it through
 * every page that renders the Navbar.
 */
export function Navbar({
  variant = "marketing",
  activeHref,
}: {
  variant?: "marketing" | "studio";
  activeHref?: string;
}) {
  return (
    <NavbarClient
      variant={variant}
      activeHref={activeHref}
      clerkEnabled={clerkEnabled}
    />
  );
}

import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const nextConfig: NextConfig = {
  // There is an unrelated lockfile in the parent directory; without this Next
  // infers the workspace root one level too high and mis-traces output.
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  serverExternalPackages: [
    "@neondatabase/serverless",
    "@prisma/adapter-neon",
    "@prisma/client",
  ],
};

export default nextConfig;

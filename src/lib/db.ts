import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;
  if (!raw) return undefined;

  try {
    const url = new URL(raw);
    // Prisma + Neon often fail with P1001 when channel_binding=require is set
    // on the pooler URL (Vercel/Neon inject it by default).
    url.searchParams.delete("channel_binding");
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "15");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

function createClient(): PrismaClient {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    return new PrismaClient();
  }

  // Neon serverless talks over WebSockets on 443. Direct TCP to :5432 is
  // blocked on some local networks (this machine included).
  if (typeof neonConfig.webSocketConstructor === "undefined") {
    neonConfig.webSocketConstructor = WebSocket;
  }

  const adapter = new PrismaNeon({ connectionString: databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

import { PrismaClient } from "@prisma/client";

/**
 * Database access with graceful degradation.
 *
 * The production build MUST pass with no DATABASE_URL set (Vercel builds the
 * app before env vars for Postgres are guaranteed). So:
 * - Importing this module never throws and never connects.
 * - `db` is a lazy proxy: the real PrismaClient is created on first use.
 * - `isDbConfigured()` lets pages/API routes render honest "not configured"
 *   states instead of crashing the build or the request.
 *
 * Rule for all DB reads during build/ISR: check isDbConfigured() first and
 * return empty data (public pages show honest empty states; admin pages show
 * a "Database not configured" notice).
 */
export class DbNotConfiguredError extends Error {
  constructor() {
    super(
      "DATABASE_URL is not set. Database features are disabled until it is configured — see DEPLOY.md."
    );
    this.name = "DbNotConfiguredError";
  }
}

export function isDbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createClient(): PrismaClient {
  if (!isDbConfigured()) throw new DbNotConfiguredError();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient();
  return globalForPrisma.prisma;
}

export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? value.bind(client) : value;
  },
});

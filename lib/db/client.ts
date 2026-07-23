import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

function isServerlessRuntime() {
  return Boolean(
    process.env.VERCEL ||
      process.env.AWS_LAMBDA_FUNCTION_NAME ||
      process.env.NETLIFY,
  );
}

/**
 * Keep pools tiny on shared hosts (Filess ~30 slots).
 * Override with DATABASE_POOL_MAX when you know the host capacity.
 */
function resolvePoolMax() {
  const raw = process.env.DATABASE_POOL_MAX?.trim();
  if (raw) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1) {
      return Math.min(Math.floor(parsed), 10);
    }
  }

  if (isServerlessRuntime()) {
    return 1;
  }

  // Local `next dev` often shares the same Filess URL as prod — stay at 1–2.
  if (process.env.NODE_ENV !== "production") {
    return 2;
  }

  // Long-lived Node (`next start`): a few connections cover concurrency
  // without eating the shared quota when multiple processes are up.
  return 3;
}

function createClient() {
  const { DATABASE_URL } = getEnv();
  const max = resolvePoolMax();

  return postgres(DATABASE_URL, {
    max,
    // Release idle sockets quickly so other warm instances can connect.
    idle_timeout: 8,
    // Recycle long-lived sockets (avoids stale connections on managed PG).
    max_lifetime: 60 * 15,
    connect_timeout: 10,
    // Filess.io / some managed PG hosts reject forced TLS — let the URL control SSL.
    prepare: false,
    connection: {
      search_path: "cms, public",
      application_name: "cms-system",
    },
  });
}

const client = globalForDb.postgresClient ?? createClient();
globalForDb.postgresClient = client;

/** Shared Drizzle client — use from Server Components / Actions / Route Handlers only. */
export const db = drizzle(client, { schema });

export type Database = typeof db;

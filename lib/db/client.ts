import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";
import { getEnv } from "@/lib/env";

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined;
};

function createClient() {
  const { DATABASE_URL } = getEnv();

  return postgres(DATABASE_URL, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 30,
    // Filess.io / some managed PG hosts reject forced TLS — let the URL control SSL.
    prepare: false,
    connection: {
      search_path: "cms, public",
    },
  });
}

const client = globalForDb.postgresClient ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client;
}

/** Shared Drizzle client — use from Server Components / Actions / Route Handlers only. */
export const db = drizzle(client, { schema });

export type Database = typeof db;

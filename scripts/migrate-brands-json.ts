/**
 * Create cms.brands (if missing) and seed from data/brands.json.
 *
 * Usage:
 *   npx tsx scripts/migrate-brands-json.ts           # dry-run
 *   npx tsx scripts/migrate-brands-json.ts --apply   # write
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { normalizeBrand } from "../lib/brands/normalize";
import { db } from "../lib/db/client";
import { brands } from "../lib/db/schema";
import type { Brand } from "../types/brand";

const DDL = `
CREATE TABLE IF NOT EXISTS "cms"."brands" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "logo" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "features" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx" ON "cms"."brands" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "brands_updated_at_idx" ON "cms"."brands" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "brands_status_idx" ON "cms"."brands" USING btree ("status");
`;

function parseArgs(argv: string[]) {
  return { apply: argv.includes("--apply") };
}

async function ensureTable() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = postgres(url, { max: 1 });
  try {
    await sql.unsafe(DDL);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

async function main() {
  const { apply } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";
  const filePath = path.join(process.cwd(), "data/brands.json");
  const raw = await readFile(filePath, "utf-8");
  const rows = (JSON.parse(raw) as Brand[]).map(normalizeBrand);

  console.log(`[${mode}] source=${filePath} (${rows.length})`);

  if (apply) {
    await ensureTable();
  } else {
    console.log("Would ensure cms.brands table + indexes exist.");
  }

  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

  for (const brand of rows) {
    if (!apply) {
      console.log(`  would upsert: ${brand.id} (${brand.name})`);
      inserted += 1;
      continue;
    }

    const existing = await db
      .select()
      .from(brands)
      .where(eq(brands.id, brand.id))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(brands).values({
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        status: brand.status,
        features: brand.features,
        createdAt: new Date(brand.createdAt),
        updatedAt: new Date(brand.updatedAt),
      });
      console.log(`  + insert ${brand.id}`);
      inserted += 1;
      continue;
    }

    const current = existing[0];
    const same =
      current.name === brand.name &&
      current.slug === brand.slug &&
      current.logo === brand.logo &&
      current.description === brand.description &&
      current.status === brand.status &&
      JSON.stringify(current.features) === JSON.stringify(brand.features);

    if (same) {
      unchanged += 1;
      console.log(`  = same ${brand.id}`);
      continue;
    }

    await db
      .update(brands)
      .set({
        name: brand.name,
        slug: brand.slug,
        logo: brand.logo,
        description: brand.description,
        status: brand.status,
        features: brand.features,
        updatedAt: new Date(brand.updatedAt),
      })
      .where(eq(brands.id, brand.id));
    console.log(`  ~ update ${brand.id}`);
    updated += 1;
  }

  console.log("\n--- result ---");
  console.log(
    `inserted=${inserted} updated=${updated} unchanged=${unchanged}`,
  );
  console.log(apply ? "Done." : "Dry-run only. Re-run with --apply to write.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

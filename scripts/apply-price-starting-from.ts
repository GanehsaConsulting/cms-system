/**
 * Apply show_starting_from column on cms.prices.
 *
 * Usage:
 *   npx tsx scripts/apply-price-starting-from.ts
 */
import "dotenv/config";
import postgres from "postgres";

const DDL = `
ALTER TABLE "cms"."prices"
ADD COLUMN IF NOT EXISTS "show_starting_from" boolean DEFAULT false NOT NULL;
`;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }

  const sql = postgres(url, { max: 1 });
  try {
    await sql.unsafe(DDL);
    console.log("Applied show_starting_from on cms.prices");
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

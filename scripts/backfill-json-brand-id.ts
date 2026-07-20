/**
 * Backfill brandId on legacy JSON content stores (banners, clients, portfolio, prices).
 *
 * Usage:
 *   npx tsx scripts/backfill-json-brand-id.ts gec
 *   npx tsx scripts/backfill-json-brand-id.ts gec --dry-run
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const JSON_STORES = [
  "data/banners.json",
  "data/clients.json",
  "data/portfolio.json",
  "data/prices.json",
  "data/price-categories.json",
] as const;

interface BrandScopedRow {
  brandId?: string | null;
  [key: string]: unknown;
}

async function backfillFile(
  relativePath: string,
  brandId: string,
  dryRun: boolean,
): Promise<number> {
  const filePath = path.join(process.cwd(), relativePath);

  let rows: BrandScopedRow[];

  try {
    const raw = await readFile(filePath, "utf-8");
    rows = JSON.parse(raw) as BrandScopedRow[];
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return 0;
    }
    throw error;
  }

  if (!Array.isArray(rows)) {
    console.warn(`Skipped ${relativePath}: expected a JSON array.`);
    return 0;
  }

  let updated = 0;

  for (const row of rows) {
    const current = String(row.brandId ?? "").trim();
    if (!current) {
      row.brandId = brandId;
      updated += 1;
    }
  }

  if (updated > 0 && !dryRun) {
    await writeFile(filePath, `${JSON.stringify(rows, null, 2)}\n`, "utf-8");
  }

  return updated;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const brandId = args.find((arg) => arg !== "--dry-run")?.trim();

  if (!brandId) {
    console.error(
      "Usage: npx tsx scripts/backfill-json-brand-id.ts <brandId> [--dry-run]",
    );
    process.exit(1);
  }

  let total = 0;

  for (const store of JSON_STORES) {
    const count = await backfillFile(store, brandId, dryRun);
    if (count > 0) {
      console.log(
        `${dryRun ? "[dry-run] Would update" : "Updated"} ${count} row(s) in ${store}`,
      );
    }
    total += count;
  }

  if (total === 0) {
    console.log("No rows needed backfill.");
    return;
  }

  console.log(
    `${dryRun ? "[dry-run] Total rows to backfill" : "Total rows backfilled"}: ${total} → brand "${brandId}"`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

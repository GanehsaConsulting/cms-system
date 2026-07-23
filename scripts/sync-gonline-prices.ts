/**
 * Replace GONLINE price catalog with the canonical packages from config/gonline-prices.ts.
 *
 * Usage:
 *   npx tsx scripts/sync-gonline-prices.ts           # dry-run
 *   npx tsx scripts/sync-gonline-prices.ts --apply   # write
 */
import "dotenv/config";
import { eq } from "drizzle-orm";
import {
  buildGonlinePriceInputs,
  GONLINE_PRICE_CATEGORIES,
} from "../config/gonline-prices";
import { db } from "../lib/db/client";
import { getPriceCategories } from "../lib/db/price-categories";
import { createPrice, getPrices } from "../lib/db/prices";
import { priceCategories, prices } from "../lib/db/schema";

const BRAND_ID = "gonline";

async function main() {
  const apply = process.argv.includes("--apply");
  const mode = apply ? "APPLY" : "DRY-RUN";
  const catalog = buildGonlinePriceInputs();

  console.log(`[${mode}] brand=${BRAND_ID}`);
  console.log(`categories: ${GONLINE_PRICE_CATEGORIES.length}`);
  for (const category of GONLINE_PRICE_CATEGORIES) {
    console.log(`  + ${category.id} (${category.label})`);
  }
  console.log(`packages: ${catalog.length}`);
  for (const pkg of catalog) {
    console.log(
      `  + ${pkg.slug} — ${pkg.packageName.id} · Rp ${pkg.price} / strike ${pkg.strikethroughPrice} · features ${pkg.features.length}`,
    );
  }

  if (!apply) {
    console.log("\nDry-run only. Re-run with --apply to replace GONLINE prices.");
    return;
  }

  await db.delete(prices).where(eq(prices.brandId, BRAND_ID));
  await db
    .delete(priceCategories)
    .where(eq(priceCategories.brandId, BRAND_ID));

  const now = new Date();
  for (const category of GONLINE_PRICE_CATEGORIES) {
    await db.insert(priceCategories).values({
      id: category.id,
      brandId: BRAND_ID,
      label: category.label,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (const pkg of catalog) {
    await createPrice(BRAND_ID, pkg);
  }

  const finalPrices = await getPrices(BRAND_ID);
  const finalCats = await getPriceCategories(BRAND_ID);
  console.log("\n--- result ---");
  console.log(`categories=${finalCats.length} prices=${finalPrices.length}`);
  for (const price of finalPrices) {
    console.log(
      `  ${price.category} / ${price.packageName.id} — Rp ${price.price} (strike ${price.strikethroughPrice}) · ${price.features.length} features`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

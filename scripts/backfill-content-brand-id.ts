/**
 * Backfill brand_id on legacy content that was created before per-brand isolation.
 *
 * Usage:
 *   npx tsx scripts/backfill-content-brand-id.ts gec
 *
 * Pass the brand id to assign orphaned rows to (e.g. gec, gonline).
 */
import { eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { articles, articleCategories } from "@/lib/db/schema";

async function main() {
  const brandId = process.argv[2]?.trim();

  if (!brandId) {
    console.error("Usage: npx tsx scripts/backfill-content-brand-id.ts <brandId>");
    process.exit(1);
  }

  const articleRows = await db
    .update(articles)
    .set({ brandId })
    .where(or(isNull(articles.brandId), eq(articles.brandId, "")))
    .returning({ id: articles.id });

  let categoryRows: { id: string }[] = [];

  try {
    categoryRows = await db
      .update(articleCategories)
      .set({ brandId })
      .where(or(isNull(articleCategories.brandId), eq(articleCategories.brandId, "")))
      .returning({ id: articleCategories.id });
  } catch (error) {
    console.warn(
      "Article categories backfill skipped (column may not exist yet):",
      error instanceof Error ? error.message : error,
    );
  }

  console.log(
    `Backfilled ${articleRows.length} article(s) and ${categoryRows.length} article categor(ies) to brand "${brandId}".`,
  );

  await db.execute(sql`select 1`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

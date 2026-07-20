/**
 * Safe migration: add brand_id without truncating existing articles/categories.
 *
 * Usage:
 *   npx tsx scripts/migrate-brand-isolation.ts gec
 *
 * Default brand for existing rows: gec (change via CLI arg).
 * After this succeeds, run: npm run db:push
 */
import "dotenv/config";
import postgres from "postgres";

async function main() {
  const brandId = process.argv[2]?.trim() || "gec";

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });

  try {
    console.log(`Migrating existing rows to brand "${brandId}"…`);

    // --- articles ---
    await sql`
      ALTER TABLE cms.articles
      ADD COLUMN IF NOT EXISTS brand_id text
    `;

    await sql`
      UPDATE cms.articles
      SET brand_id = ${brandId}
      WHERE brand_id IS NULL OR brand_id = ''
    `;

    await sql`
      ALTER TABLE cms.articles
      ALTER COLUMN brand_id SET NOT NULL
    `;

    await sql`
      ALTER TABLE cms.articles
      DROP CONSTRAINT IF EXISTS articles_slug_unique
    `;

    await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS articles_brand_slug_idx
      ON cms.articles (brand_id, slug)
    `;

    // --- article_categories ---
    await sql`
      ALTER TABLE cms.article_categories
      ADD COLUMN IF NOT EXISTS brand_id text
    `;

    await sql`
      UPDATE cms.article_categories
      SET brand_id = ${brandId}
      WHERE brand_id IS NULL OR brand_id = ''
    `;

    await sql`
      ALTER TABLE cms.article_categories
      ALTER COLUMN brand_id SET NOT NULL
    `;

    await sql`
      ALTER TABLE cms.article_categories
      DROP CONSTRAINT IF EXISTS article_categories_pkey
    `;

    await sql`
      ALTER TABLE cms.article_categories
      ADD CONSTRAINT article_categories_brand_id_id_pk
      PRIMARY KEY (brand_id, id)
    `;

    const [{ count: articleCount }] = await sql<{ count: string }[]>`
      SELECT count(*)::text AS count FROM cms.articles
    `;
    const [{ count: categoryCount }] = await sql<{ count: string }[]>`
      SELECT count(*)::text AS count FROM cms.article_categories
    `;

    console.log(
      `Done. ${articleCount} article(s), ${categoryCount} categor(ies) — all assigned to "${brandId}".`,
    );
    console.log("Run npm run db:push next (should show no truncate warnings).");
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

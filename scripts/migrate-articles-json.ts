/**
 * One-time import of legacy JSON articles into Postgres.
 *
 * Usage:
 *   npx tsx scripts/migrate-articles-json.ts [brandId]
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { normalizeArticle } from "../lib/articles/list";
import { db } from "../lib/db/client";
import { articles } from "../lib/db/schema";
import type { Article } from "../types/article";

async function main() {
  const brandId = process.argv[2]?.trim() || "gec";

  const raw = await readFile(
    path.join(process.cwd(), "data/articles.json"),
    "utf-8",
  );
  const parsed = JSON.parse(raw) as Article[];
  const list = parsed.map(normalizeArticle);

  let inserted = 0;
  let skipped = 0;

  for (const article of list) {
    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(eq(articles.id, article.id))
      .limit(1);

    if (existing.length > 0) {
      skipped += 1;
      continue;
    }

    await db.insert(articles).values({
      id: article.id,
      brandId,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      status: article.status,
      authorName: article.authorName,
      authorId: null,
      category: article.category,
      tags: article.tags,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      highlighted: article.highlighted,
      gallery: article.gallery,
      thumbnail: article.thumbnail,
      publishedAt: article.publishedAt ? new Date(article.publishedAt) : null,
      createdAt: new Date(article.createdAt),
      updatedAt: new Date(article.updatedAt),
    });
    inserted += 1;
  }

  console.log(`Articles migrate done. inserted=${inserted} skipped=${skipped}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

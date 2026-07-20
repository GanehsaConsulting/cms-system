import { and, desc, eq, isNotNull, lte, ne } from "drizzle-orm";
import { normalizeArticle } from "@/lib/articles/list";
import { resolveImageAsset, resolveImageAssets } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import type { Article, ArticleInput, ArticleStatus } from "@/types/article";

function toIso(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString();
}

function rowToArticle(row: typeof articles.$inferSelect): Article {
  return normalizeArticle({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status as ArticleStatus,
    authorName: row.authorName,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    highlighted: row.highlighted,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    thumbnail: row.thumbnail,
    publishedAt: toIso(row.publishedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

/**
 * Flip due scheduled articles to published.
 * Also invoked by GET /api/cron/publish-scheduled (cron-job.org).
 */
export async function promoteDueScheduledArticles(
  now = new Date(),
): Promise<number> {
  const updated = await db
    .update(articles)
    .set({
      status: "published",
      updatedAt: now,
    })
    .where(
      and(
        eq(articles.status, "scheduled"),
        isNotNull(articles.publishedAt),
        lte(articles.publishedAt, now),
      ),
    )
    .returning({ id: articles.id });

  return updated.length;
}

function resolveStatusAndPublishedAt(
  current: Article | null,
  input: ArticleInput,
  now: Date,
): { status: ArticleStatus; publishedAt: Date | null } {
  if (input.status === "published") {
    if (current?.status === "published" && current.publishedAt) {
      return {
        status: "published",
        publishedAt: new Date(current.publishedAt),
      };
    }
    return { status: "published", publishedAt: now };
  }

  if (input.status === "scheduled") {
    if (!input.publishedAt) {
      throw new Error("Schedule date is required");
    }

    const scheduledAt = new Date(input.publishedAt);
    // Past (or equal) schedule goes live immediately.
    if (scheduledAt.getTime() <= now.getTime()) {
      return { status: "published", publishedAt: scheduledAt };
    }

    return { status: "scheduled", publishedAt: scheduledAt };
  }

  if (input.status === "draft") {
    return { status: "draft", publishedAt: null };
  }

  return {
    status: input.status,
    publishedAt: current?.publishedAt ? new Date(current.publishedAt) : null,
  };
}

async function resolveArticleMedia(input: ArticleInput): Promise<{
  thumbnail: string;
  gallery: string[];
}> {
  const [thumbnail, gallery] = await Promise.all([
    resolveImageAsset(input.thumbnail, "cms-system/articles/thumbnails"),
    resolveImageAssets(input.gallery, "cms-system/articles/gallery"),
  ]);

  return { thumbnail, gallery };
}

export async function getArticles(): Promise<Article[]> {
  await promoteDueScheduledArticles();

  const rows = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.updatedAt));

  return rows.map(rowToArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  await promoteDueScheduledArticles();

  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);

  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await promoteDueScheduledArticles();

  const rows = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1);

  return rows[0] ? rowToArticle(rows[0]) : null;
}

export async function createArticle(
  input: ArticleInput,
  options: { authorId?: string | null } = {},
): Promise<Article> {
  const existing = await getArticleBySlug(input.slug);
  if (existing) {
    throw new Error("Slug is already in use");
  }

  const now = new Date();
  const media = await resolveArticleMedia(input);
  const resolved = resolveStatusAndPublishedAt(null, input, now);
  const id = crypto.randomUUID();

  const [row] = await db
    .insert(articles)
    .values({
      id,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      status: resolved.status,
      authorName: input.authorName,
      authorId: options.authorId ?? null,
      category: input.category,
      tags: input.tags,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      highlighted: input.highlighted,
      gallery: media.gallery,
      thumbnail: media.thumbnail,
      publishedAt: resolved.publishedAt,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  return rowToArticle(row);
}

export async function updateArticle(
  id: string,
  input: ArticleInput,
  options: { authorId?: string | null } = {},
): Promise<Article> {
  const current = await getArticleById(id);
  if (!current) {
    throw new Error("Article not found");
  }

  const slugTaken = await db
    .select({ id: articles.id })
    .from(articles)
    .where(and(eq(articles.slug, input.slug), ne(articles.id, id)))
    .limit(1);

  if (slugTaken.length > 0) {
    throw new Error("Slug is already in use");
  }

  const now = new Date();
  const media = await resolveArticleMedia(input);
  const resolved = resolveStatusAndPublishedAt(current, input, now);

  const [row] = await db
    .update(articles)
    .set({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      status: resolved.status,
      authorName: input.authorName,
      authorId: options.authorId ?? null,
      category: input.category,
      tags: input.tags,
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      highlighted: input.highlighted,
      gallery: media.gallery,
      thumbnail: media.thumbnail,
      publishedAt: resolved.publishedAt,
      updatedAt: now,
    })
    .where(eq(articles.id, id))
    .returning();

  return rowToArticle(row);
}

export async function deleteArticle(id: string): Promise<void> {
  const deleted = await db
    .delete(articles)
    .where(eq(articles.id, id))
    .returning({ id: articles.id });

  if (deleted.length === 0) {
    throw new Error("Article not found");
  }
}

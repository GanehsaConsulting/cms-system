import { and, desc, eq, isNotNull, isNull, lte, ne, sql } from "drizzle-orm";
import { normalizeArticle } from "@/lib/articles/list";
import { resolveArticleContentImages } from "@/lib/articles/resolve-content-images";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { resolveImageAsset, resolveImageAssets } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { articles, user } from "@/lib/db/schema";
import {
  fromTrashUniqueValue,
  toTrashUniqueValue,
} from "@/lib/trash/unique-value";
import type {
  Article,
  ArticleInput,
  ArticleStatus,
  ArticleSummary,
} from "@/types/article";

function toIso(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString();
}

function rowToArticle(
  row: typeof articles.$inferSelect,
  authorImage: string | null = null,
): Article {
  return normalizeArticle({
    id: row.id,
    brandId: row.brandId,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    status: row.status as ArticleStatus,
    authorName: row.authorName,
    authorImage,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    metaTitle: row.metaTitle,
    metaDescription: row.metaDescription,
    highlighted: row.highlighted,
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    thumbnail: row.thumbnail,
    clickCount: row.clickCount ?? 0,
    publishedAt: toIso(row.publishedAt),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    deletedAt: row.deletedAt ? toIso(row.deletedAt) : null,
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
        isNull(articles.deletedAt),
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
  content: string;
}> {
  const [thumbnail, gallery, content] = await Promise.all([
    resolveImageAsset(input.thumbnail, "cms-system/articles/thumbnails"),
    resolveImageAssets(input.gallery, "cms-system/articles/gallery"),
    resolveArticleContentImages(input.content),
  ]);

  return { thumbnail, gallery, content };
}

export async function getArticles(brandId: string): Promise<Article[]> {
  const rows = await db
    .select({
      article: articles,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.brandId, brandId), isNull(articles.deletedAt)))
    .orderBy(desc(articles.updatedAt));

  return rows.map(({ article, authorImage }) =>
    rowToArticle(article, authorImage ?? null),
  );
}

export async function getTrashedArticles(brandId: string): Promise<Article[]> {
  const rows = await db
    .select({
      article: articles,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.brandId, brandId), isNotNull(articles.deletedAt)))
    .orderBy(desc(articles.deletedAt));

  return rows.map(({ article, authorImage }) =>
    rowToArticle(article, authorImage ?? null),
  );
}

/**
 * CMS list/dashboard rows — omits `content` (body HTML is the heavy column).
 * Preview/edit fetch full rows via getArticleById.
 */
export async function getArticlesList(brandId: string): Promise<Article[]> {
  const rows = await db
    .select({
      id: articles.id,
      brandId: articles.brandId,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      status: articles.status,
      authorName: articles.authorName,
      category: articles.category,
      tags: articles.tags,
      metaTitle: articles.metaTitle,
      metaDescription: articles.metaDescription,
      highlighted: articles.highlighted,
      gallery: articles.gallery,
      thumbnail: articles.thumbnail,
      clickCount: articles.clickCount,
      publishedAt: articles.publishedAt,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.brandId, brandId), isNull(articles.deletedAt)))
    .orderBy(desc(articles.updatedAt));

  return rows.map((row) =>
    normalizeArticle({
      id: row.id,
      brandId: row.brandId,
      title: row.title,
      slug: row.slug,
      excerpt: row.excerpt,
      content: "",
      status: row.status as ArticleStatus,
      authorName: row.authorName,
      authorImage: row.authorImage ?? null,
      category: row.category,
      tags: Array.isArray(row.tags) ? row.tags : [],
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      highlighted: row.highlighted,
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      thumbnail: row.thumbnail,
      clickCount: row.clickCount ?? 0,
      publishedAt: toIso(row.publishedAt),
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      deletedAt: null,
    }),
  );
}

/** Dashboard-oriented query — omits heavy columns like `content`. */
export async function getArticlesSummary(
  brandId: string,
): Promise<ArticleSummary[]> {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      status: articles.status,
      thumbnail: articles.thumbnail,
      authorName: articles.authorName,
      updatedAt: articles.updatedAt,
      publishedAt: articles.publishedAt,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(and(eq(articles.brandId, brandId), isNull(articles.deletedAt)))
    .orderBy(desc(articles.updatedAt));

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    status: row.status as ArticleStatus,
    thumbnail: row.thumbnail,
    authorName: row.authorName,
    authorImage: row.authorImage ?? null,
    publishedAt: toIso(row.publishedAt),
    updatedAt: row.updatedAt.toISOString(),
  }));
}

export async function getArticleById(
  brandId: string,
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<Article | null> {
  const rows = await db
    .select({
      article: articles,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(
      options?.includeDeleted
        ? and(eq(articles.id, id), eq(articles.brandId, brandId))
        : and(
            eq(articles.id, id),
            eq(articles.brandId, brandId),
            isNull(articles.deletedAt),
          ),
    )
    .limit(1);

  if (!rows[0]) {
    return null;
  }

  return rowToArticle(rows[0].article, rows[0].authorImage ?? null);
}

export async function getArticleBySlug(
  brandId: string,
  slug: string,
): Promise<Article | null> {
  const rows = await db
    .select({
      article: articles,
      authorImage: user.image,
    })
    .from(articles)
    .leftJoin(user, eq(articles.authorId, user.id))
    .where(
      and(
        eq(articles.slug, slug),
        eq(articles.brandId, brandId),
        isNull(articles.deletedAt),
      ),
    )
    .limit(1);

  if (!rows[0]) {
    return null;
  }

  return rowToArticle(rows[0].article, rows[0].authorImage ?? null);
}

export async function createArticle(
  brandId: string,
  input: ArticleInput,
  options: { authorId?: string | null } = {},
): Promise<Article> {
  const existing = await getArticleBySlug(brandId, input.slug);
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
      brandId,
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: media.content,
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
  brandId: string,
  id: string,
  input: ArticleInput,
  options: { authorId?: string | null } = {},
): Promise<Article> {
  const current = await getArticleById(brandId, id);
  if (!current) {
    throw new Error("Article not found");
  }

  const slugTaken = await db
    .select({ id: articles.id })
    .from(articles)
    .where(
      and(
        eq(articles.brandId, brandId),
        eq(articles.slug, input.slug),
        ne(articles.id, id),
        isNull(articles.deletedAt),
      ),
    )
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
      content: media.content,
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
    .where(
      and(
        eq(articles.id, id),
        eq(articles.brandId, brandId),
        isNull(articles.deletedAt),
      ),
    )
    .returning();

  if (!row) {
    throw new Error("Article not found");
  }

  return rowToArticle(row);
}

/** Soft-delete — moves article to Trash and frees the slug. */
export async function softDeleteArticle(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getArticleById(brandId, id);
  if (!current) {
    throw new Error("Article not found");
  }

  const now = new Date();
  await db
    .update(articles)
    .set({
      slug: toTrashUniqueValue(current.slug, id),
      deletedAt: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(articles.id, id),
        eq(articles.brandId, brandId),
        isNull(articles.deletedAt),
      ),
    );
}

export async function restoreArticle(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getArticleById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Article not found in Trash");
  }

  const restoredSlug = fromTrashUniqueValue(current.slug, id);
  const slugTaken = await db
    .select({ id: articles.id })
    .from(articles)
    .where(
      and(
        eq(articles.brandId, brandId),
        eq(articles.slug, restoredSlug),
        ne(articles.id, id),
        isNull(articles.deletedAt),
      ),
    )
    .limit(1);

  if (slugTaken.length > 0) {
    throw new Error(
      "Cannot restore: slug is already in use by another article",
    );
  }

  const now = new Date();
  await db
    .update(articles)
    .set({
      slug: restoredSlug,
      deletedAt: null,
      updatedAt: now,
    })
    .where(
      and(
        eq(articles.id, id),
        eq(articles.brandId, brandId),
        isNotNull(articles.deletedAt),
      ),
    );
}

/** Permanently remove a trashed article. */
export async function purgeArticle(brandId: string, id: string): Promise<void> {
  const current = await getArticleById(brandId, id, { includeDeleted: true });
  if (!current?.deletedAt) {
    throw new Error("Article not found in Trash");
  }

  await db
    .delete(articles)
    .where(and(eq(articles.id, id), eq(articles.brandId, brandId)));
}

export async function purgeAllTrashedArticles(brandId: string): Promise<number> {
  const rows = await db
    .delete(articles)
    .where(and(eq(articles.brandId, brandId), isNotNull(articles.deletedAt)))
    .returning({ id: articles.id });

  return rows.length;
}

/** Hard-delete an article row (any state). Prefer softDeleteArticle for CMS deletes. */
export async function deleteArticle(
  brandId: string,
  id: string,
): Promise<void> {
  const deleted = await db
    .delete(articles)
    .where(and(eq(articles.id, id), eq(articles.brandId, brandId)))
    .returning({ id: articles.id });

  if (deleted.length === 0) {
    throw new Error("Article not found");
  }
}

export async function incrementArticleClick(
  brandId: string,
  slug: string,
): Promise<number> {
  const [row] = await db
    .update(articles)
    .set({
      clickCount: sql`${articles.clickCount} + 1`,
    })
    .where(
      and(
        eq(articles.brandId, brandId),
        eq(articles.slug, slug),
        eq(articles.status, "published"),
        isNull(articles.deletedAt),
      ),
    )
    .returning({ clickCount: articles.clickCount });

  if (!row) {
    throw new Error("Article not found");
  }

  return row.clickCount;
}

/** Ensures a fetched article belongs to the requested brand (public/CMS guards). */
export function ensureArticleBrand(article: Article, brandId: string): Article {
  assertBrandMatch(article, brandId, "Article not found");
  return article;
}

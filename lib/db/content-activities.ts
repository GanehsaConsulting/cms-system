import { and, desc, eq, isNotNull, isNull, sql } from "drizzle-orm";
import { resolveArticleContentImages } from "@/lib/articles/resolve-content-images";
import { assertBrandMatch } from "@/lib/brands/content-scope";
import { resolveImageAssets } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { contentActivities, user } from "@/lib/db/schema";
import type {
  ContentActivity,
  ContentActivityInput,
  ContentActivityKind,
  ContentActivityStatus,
} from "@/types/content-activity";

const IMAGE_FOLDER = "cms-system/content-activities";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToContentActivity(
  row: typeof contentActivities.$inferSelect,
  authorImage: string | null = null,
): ContentActivity {
  return {
    id: row.id,
    brandId: row.brandId,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    displayAt: toIso(row.displayAt),
    showTitle: row.showTitle,
    kind: row.kind as ContentActivityKind,
    linkUrl: row.linkUrl,
    status: row.status as ContentActivityStatus,
    images: Array.isArray(row.images) ? row.images : [],
    authorName: row.authorName,
    authorId: row.authorId,
    authorImage,
    clickCount: row.clickCount,
    createdAt: toIso(row.createdAt),
    updatedAt: toIso(row.updatedAt),
    deletedAt: row.deletedAt ? toIso(row.deletedAt) : null,
  };
}

async function resolveMedia(input: ContentActivityInput): Promise<{
  images: string[];
  content: string;
}> {
  const [images, content] = await Promise.all([
    resolveImageAssets(input.images, IMAGE_FOLDER),
    resolveArticleContentImages(input.content),
  ]);

  return { images, content };
}

function normalizeInput(input: ContentActivityInput): ContentActivityInput {
  return {
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    displayAt: input.displayAt,
    showTitle: input.showTitle,
    kind: input.kind,
    linkUrl: input.linkUrl.trim(),
    status: input.status,
    images: input.images.map((item) => item.trim()).filter(Boolean),
    authorName: input.authorName.trim(),
  };
}

export async function getContentActivities(
  brandId: string,
): Promise<ContentActivity[]> {
  const rows = await db
    .select({
      activity: contentActivities,
      authorImage: user.image,
    })
    .from(contentActivities)
    .leftJoin(user, eq(contentActivities.authorId, user.id))
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        isNull(contentActivities.deletedAt),
      ),
    )
    .orderBy(desc(contentActivities.displayAt));

  return rows.map(({ activity, authorImage }) =>
    rowToContentActivity(activity, authorImage ?? null),
  );
}

export async function getTrashedContentActivities(
  brandId: string,
): Promise<ContentActivity[]> {
  const rows = await db
    .select({
      activity: contentActivities,
      authorImage: user.image,
    })
    .from(contentActivities)
    .leftJoin(user, eq(contentActivities.authorId, user.id))
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        isNotNull(contentActivities.deletedAt),
      ),
    )
    .orderBy(desc(contentActivities.deletedAt));

  return rows.map(({ activity, authorImage }) =>
    rowToContentActivity(activity, authorImage ?? null),
  );
}

export async function getContentActivityById(
  brandId: string,
  id: string,
  options?: { includeDeleted?: boolean },
): Promise<ContentActivity | null> {
  const [row] = await db
    .select({
      activity: contentActivities,
      authorImage: user.image,
    })
    .from(contentActivities)
    .leftJoin(user, eq(contentActivities.authorId, user.id))
    .where(
      options?.includeDeleted
        ? and(
            eq(contentActivities.brandId, brandId),
            eq(contentActivities.id, id),
          )
        : and(
            eq(contentActivities.brandId, brandId),
            eq(contentActivities.id, id),
            isNull(contentActivities.deletedAt),
          ),
    )
    .limit(1);

  if (!row) {
    return null;
  }

  try {
    assertBrandMatch(row.activity, brandId, "Activity not found");
    return rowToContentActivity(row.activity, row.authorImage ?? null);
  } catch {
    return null;
  }
}

export async function createContentActivity(
  brandId: string,
  input: ContentActivityInput,
  options?: { authorId?: string | null },
): Promise<ContentActivity> {
  const normalized = normalizeInput(input);
  const media = await resolveMedia(normalized);
  const id = crypto.randomUUID();
  const displayAt = new Date(normalized.displayAt);

  if (Number.isNaN(displayAt.getTime())) {
    throw new Error("Display date is invalid");
  }

  const [row] = await db
    .insert(contentActivities)
    .values({
      id,
      brandId,
      title: normalized.title,
      excerpt: normalized.excerpt,
      content: media.content,
      displayAt,
      showTitle: normalized.showTitle,
      kind: normalized.kind,
      linkUrl: normalized.linkUrl,
      status: normalized.status,
      images: media.images,
      authorName: normalized.authorName,
      authorId: options?.authorId ?? null,
    })
    .returning();

  return rowToContentActivity(row);
}

export async function updateContentActivity(
  brandId: string,
  id: string,
  input: ContentActivityInput,
  options?: { authorId?: string | null },
): Promise<ContentActivity> {
  const current = await getContentActivityById(brandId, id);
  if (!current) {
    throw new Error("Activity not found");
  }

  const normalized = normalizeInput(input);
  const media = await resolveMedia(normalized);
  const displayAt = new Date(normalized.displayAt);

  if (Number.isNaN(displayAt.getTime())) {
    throw new Error("Display date is invalid");
  }

  const [row] = await db
    .update(contentActivities)
    .set({
      title: normalized.title,
      excerpt: normalized.excerpt,
      content: media.content,
      displayAt,
      showTitle: normalized.showTitle,
      kind: normalized.kind,
      linkUrl: normalized.linkUrl,
      status: normalized.status,
      images: media.images,
      authorName: normalized.authorName,
      authorId: options?.authorId ?? current.authorId,
    })
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        eq(contentActivities.id, id),
        isNull(contentActivities.deletedAt),
      ),
    )
    .returning();

  return rowToContentActivity(row);
}

export async function updateContentActivityStatus(
  brandId: string,
  id: string,
  status: ContentActivityStatus,
): Promise<ContentActivity> {
  const current = await getContentActivityById(brandId, id);
  if (!current) {
    throw new Error("Activity not found");
  }

  const [row] = await db
    .update(contentActivities)
    .set({ status })
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        eq(contentActivities.id, id),
        isNull(contentActivities.deletedAt),
      ),
    )
    .returning();

  return rowToContentActivity(row, current.authorImage ?? null);
}

/** Soft-delete — moves activity to Trash. */
export async function softDeleteContentActivity(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getContentActivityById(brandId, id);
  if (!current) {
    throw new Error("Activity not found");
  }

  const now = new Date();
  await db
    .update(contentActivities)
    .set({ deletedAt: now, updatedAt: now })
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        eq(contentActivities.id, id),
        isNull(contentActivities.deletedAt),
      ),
    );
}

export async function restoreContentActivity(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getContentActivityById(brandId, id, {
    includeDeleted: true,
  });
  if (!current?.deletedAt) {
    throw new Error("Activity not found in Trash");
  }

  const now = new Date();
  await db
    .update(contentActivities)
    .set({ deletedAt: null, updatedAt: now })
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        eq(contentActivities.id, id),
        isNotNull(contentActivities.deletedAt),
      ),
    );
}

/** Permanently remove a trashed activity. */
export async function purgeContentActivity(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getContentActivityById(brandId, id, {
    includeDeleted: true,
  });
  if (!current?.deletedAt) {
    throw new Error("Activity not found in Trash");
  }

  await db
    .delete(contentActivities)
    .where(
      and(eq(contentActivities.brandId, brandId), eq(contentActivities.id, id)),
    );
}

export async function purgeAllTrashedContentActivities(
  brandId: string,
): Promise<number> {
  const rows = await db
    .delete(contentActivities)
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        isNotNull(contentActivities.deletedAt),
      ),
    )
    .returning({ id: contentActivities.id });

  return rows.length;
}

/** Hard-delete an activity row (any state). Prefer softDeleteContentActivity for CMS deletes. */
export async function deleteContentActivity(
  brandId: string,
  id: string,
): Promise<void> {
  const current = await getContentActivityById(brandId, id, {
    includeDeleted: true,
  });
  if (!current) {
    throw new Error("Activity not found");
  }

  await db
    .delete(contentActivities)
    .where(
      and(eq(contentActivities.brandId, brandId), eq(contentActivities.id, id)),
    );
}

export async function incrementContentActivityClick(
  brandId: string,
  id: string,
): Promise<number> {
  const [row] = await db
    .update(contentActivities)
    .set({
      clickCount: sql`${contentActivities.clickCount} + 1`,
    })
    .where(
      and(
        eq(contentActivities.brandId, brandId),
        eq(contentActivities.id, id),
        eq(contentActivities.status, "published"),
        isNull(contentActivities.deletedAt),
      ),
    )
    .returning({ clickCount: contentActivities.clickCount });

  if (!row) {
    throw new Error("Activity not found");
  }

  return row.clickCount;
}

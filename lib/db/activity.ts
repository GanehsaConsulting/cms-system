import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { activityEvents, activityReads, user } from "@/lib/db/schema";
import type { ActivityEvent } from "@/types/activity";

function toIso(value: Date): string {
  return value.toISOString();
}

function rowToActivityEvent(
  row: typeof activityEvents.$inferSelect,
  actorImageUrl: string | null,
  read: boolean,
): ActivityEvent {
  return {
    id: row.id,
    brandId: row.brandId,
    entityType: row.entityType as ActivityEvent["entityType"],
    entityId: row.entityId,
    action: row.action as ActivityEvent["action"],
    actorId: row.actorId,
    actorName: row.actorName,
    actorImageUrl,
    entityTitle: row.entityTitle,
    summary: row.summary,
    href: row.href,
    createdAt: toIso(row.createdAt),
    read,
  };
}

export interface CreateActivityEventInput {
  brandId: string;
  entityType: ActivityEvent["entityType"];
  entityId: string;
  action: ActivityEvent["action"];
  actorId: string | null;
  actorName: string;
  entityTitle: string;
  summary: string;
  href?: string | null;
}

export async function createActivityEvent(
  input: CreateActivityEventInput,
): Promise<ActivityEvent> {
  const id = crypto.randomUUID();
  const [row] = await db
    .insert(activityEvents)
    .values({
      id,
      brandId: input.brandId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actorId: input.actorId,
      actorName: input.actorName,
      entityTitle: input.entityTitle,
      summary: input.summary,
      href: input.href ?? null,
    })
    .returning();

  return rowToActivityEvent(row, null, false);
}

async function attachReadState(
  rows: (typeof activityEvents.$inferSelect)[],
  userId: string,
): Promise<ActivityEvent[]> {
  if (rows.length === 0) {
    return [];
  }

  const activityIds = rows.map((row) => row.id);
  const actorIds = [
    ...new Set(rows.map((row) => row.actorId).filter(Boolean)),
  ] as string[];

  const [reads, actors] = await Promise.all([
    db
      .select({ activityId: activityReads.activityId })
      .from(activityReads)
      .where(
        and(
          eq(activityReads.userId, userId),
          inArray(activityReads.activityId, activityIds),
        ),
      ),
    actorIds.length > 0
      ? db
          .select({ id: user.id, image: user.image })
          .from(user)
          .where(inArray(user.id, actorIds))
      : Promise.resolve([]),
  ]);

  const readSet = new Set(reads.map((item) => item.activityId));
  const actorImages = new Map(
    actors.map((actor) => [actor.id, actor.image ?? null]),
  );

  return rows.map((row) =>
    rowToActivityEvent(
      row,
      row.actorId ? (actorImages.get(row.actorId) ?? null) : null,
      readSet.has(row.id),
    ),
  );
}

export async function listBrandActivityEvents(
  brandId: string,
  userId: string,
  limit = 50,
): Promise<ActivityEvent[]> {
  const rows = await db
    .select()
    .from(activityEvents)
    .where(eq(activityEvents.brandId, brandId))
    .orderBy(desc(activityEvents.createdAt))
    .limit(limit);

  return attachReadState(rows, userId);
}

export async function listEntityActivityEvents(
  brandId: string,
  entityType: ActivityEvent["entityType"],
  entityId: string,
  userId: string,
  limit = 20,
): Promise<ActivityEvent[]> {
  const rows = await db
    .select()
    .from(activityEvents)
    .where(
      and(
        eq(activityEvents.brandId, brandId),
        eq(activityEvents.entityType, entityType),
        eq(activityEvents.entityId, entityId),
      ),
    )
    .orderBy(desc(activityEvents.createdAt))
    .limit(limit);

  return attachReadState(rows, userId);
}

export async function countUnreadBrandActivityEvents(
  brandId: string,
  userId: string,
): Promise<number> {
  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(activityEvents)
    .leftJoin(
      activityReads,
      and(
        eq(activityReads.activityId, activityEvents.id),
        eq(activityReads.userId, userId),
      ),
    )
    .where(
      and(eq(activityEvents.brandId, brandId), sql`${activityReads.userId} IS NULL`),
    );

  return result?.count ?? 0;
}

export async function markActivityEventRead(
  userId: string,
  activityId: string,
): Promise<void> {
  await db
    .insert(activityReads)
    .values({
      userId,
      activityId,
    })
    .onConflictDoNothing();
}

export async function markActivityEventUnread(
  userId: string,
  activityId: string,
): Promise<void> {
  await db
    .delete(activityReads)
    .where(
      and(
        eq(activityReads.userId, userId),
        eq(activityReads.activityId, activityId),
      ),
    );
}

export async function markAllBrandActivityEventsRead(
  brandId: string,
  userId: string,
): Promise<void> {
  const unread = await db
    .select({ id: activityEvents.id })
    .from(activityEvents)
    .leftJoin(
      activityReads,
      and(
        eq(activityReads.activityId, activityEvents.id),
        eq(activityReads.userId, userId),
      ),
    )
    .where(
      and(eq(activityEvents.brandId, brandId), sql`${activityReads.userId} IS NULL`),
    );

  if (unread.length === 0) {
    return;
  }

  await db
    .insert(activityReads)
    .values(unread.map((item) => ({ userId, activityId: item.id })))
    .onConflictDoNothing();
}

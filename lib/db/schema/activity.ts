import { index, primaryKey, text, timestamp } from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const activityEvents = cmsSchema.table(
  "activity_events",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    actorId: text("actor_id"),
    actorName: text("actor_name").notNull(),
    entityTitle: text("entity_title").notNull(),
    summary: text("summary").notNull(),
    href: text("href"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("activity_events_brand_created_idx").on(
      table.brandId,
      table.createdAt,
    ),
    index("activity_events_entity_idx").on(
      table.brandId,
      table.entityType,
      table.entityId,
      table.createdAt,
    ),
  ],
);

export const activityReads = cmsSchema.table(
  "activity_reads",
  {
    userId: text("user_id").notNull(),
    activityId: text("activity_id").notNull(),
    readAt: timestamp("read_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.activityId] }),
    index("activity_reads_user_idx").on(table.userId),
  ],
);

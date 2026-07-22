import {
  boolean,
  index,
  integer,
  jsonb,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const contentActivities = cmsSchema.table(
  "content_activities",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    displayAt: timestamp("display_at", { withTimezone: true }).notNull(),
    showTitle: boolean("show_title").notNull().default(false),
    kind: text("kind").notNull().default("activity"),
    linkUrl: text("link_url").notNull().default(""),
    status: text("status").notNull().default("draft"),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    authorName: text("author_name").notNull(),
    authorId: text("author_id"),
    clickCount: integer("click_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("content_activities_brand_display_idx").on(
      table.brandId,
      table.displayAt,
    ),
    index("content_activities_brand_updated_idx").on(
      table.brandId,
      table.updatedAt,
    ),
    index("content_activities_brand_status_idx").on(
      table.brandId,
      table.status,
    ),
    index("content_activities_brand_kind_idx").on(table.brandId, table.kind),
  ],
);

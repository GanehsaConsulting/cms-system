import {
  boolean,
  index,
  jsonb,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const banners = cmsSchema.table(
  "banners",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    name: text("name").notNull(),
    key: text("key").notNull(),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    redirectUrl: text("redirect_url").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("banners_brand_key_idx").on(table.brandId, table.key),
    index("banners_brand_updated_at_idx").on(table.brandId, table.updatedAt),
    index("banners_brand_active_idx").on(table.brandId, table.isActive),
  ],
);

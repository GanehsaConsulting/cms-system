import {
  index,
  jsonb,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";
import type { BrandFeatureId } from "@/config/brand";
import type { BrandStatus } from "@/types/brand";

export const brands = cmsSchema.table(
  "brands",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    logo: text("logo").notNull().default(""),
    description: text("description").notNull().default(""),
    status: text("status").$type<BrandStatus>().notNull().default("active"),
    features: jsonb("features").$type<BrandFeatureId[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("brands_slug_idx").on(table.slug),
    index("brands_updated_at_idx").on(table.updatedAt),
    index("brands_status_idx").on(table.status),
  ],
);

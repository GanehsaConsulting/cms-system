import {
  boolean,
  index,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const portfolio = cmsSchema.table(
  "portfolio",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    title: text("title").notNull(),
    clientId: text("client_id").notNull(),
    workType: text("work_type").notNull().default("website"),
    coverImage: text("cover_image").notNull().default(""),
    description: text("description").notNull().default(""),
    url: text("url").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("portfolio_brand_updated_at_idx").on(table.brandId, table.updatedAt),
    index("portfolio_brand_client_idx").on(table.brandId, table.clientId),
    index("portfolio_brand_work_type_idx").on(table.brandId, table.workType),
  ],
);

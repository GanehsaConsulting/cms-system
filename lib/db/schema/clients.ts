import {
  boolean,
  index,
  jsonb,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";
import type { ClientPhoto, ClientTestimonial } from "@/types/client";

export const clients = cmsSchema.table(
  "clients",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    name: text("name").notNull(),
    logo: text("logo").notNull().default(""),
    website: text("website").notNull().default(""),
    description: text("description").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    testimonials: jsonb("testimonials")
      .$type<ClientTestimonial[]>()
      .notNull()
      .default([]),
    photos: jsonb("photos").$type<ClientPhoto[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("clients_brand_updated_at_idx").on(table.brandId, table.updatedAt),
    index("clients_brand_featured_idx").on(table.brandId, table.featured),
  ],
);

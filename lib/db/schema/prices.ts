import {
  boolean,
  index,
  integer,
  jsonb,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";
import type { LocalizedText } from "@/types/locale";
import type { PriceFeature } from "@/types/price";

export const priceCategories = cmsSchema.table(
  "price_categories",
  {
    id: text("id").notNull(),
    brandId: text("brand_id").notNull(),
    label: text("label").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.brandId, table.id] }),
    index("price_categories_brand_id_idx").on(table.brandId),
  ],
);

export const prices = cmsSchema.table(
  "prices",
  {
    id: text("id").primaryKey(),
    brandId: text("brand_id").notNull(),
    slug: text("slug").notNull(),
    serviceSlug: text("service_slug").notNull().default(""),
    category: text("category").notNull().default(""),
    highlighted: boolean("highlighted").notNull().default(false),
    description: jsonb("description").$type<LocalizedText>().notNull(),
    service: jsonb("service").$type<LocalizedText>().notNull(),
    packageName: jsonb("package_name").$type<LocalizedText>().notNull(),
    price: integer("price").notNull().default(0),
    strikethroughPrice: integer("strikethrough_price").notNull().default(0),
    whatsappPhone: text("whatsapp_phone").notNull().default(""),
    whatsappMessage: jsonb("whatsapp_message").$type<LocalizedText>().notNull(),
    isActive: boolean("is_active").notNull().default(true),
    features: jsonb("features").$type<PriceFeature[]>().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("prices_brand_slug_idx").on(table.brandId, table.slug),
    index("prices_brand_updated_at_idx").on(table.brandId, table.updatedAt),
    index("prices_brand_service_slug_idx").on(table.brandId, table.serviceSlug),
  ],
);

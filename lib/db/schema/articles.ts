import { boolean, jsonb, text, timestamp } from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const articleCategories = cmsSchema.table("article_categories", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  badgeClassName: text("badge_class_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const articles = cmsSchema.table("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull().default(""),
  content: text("content").notNull().default(""),
  status: text("status").notNull().default("draft"),
  authorName: text("author_name").notNull(),
  authorId: text("author_id"),
  category: text("category").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  metaTitle: text("meta_title").notNull().default(""),
  metaDescription: text("meta_description").notNull().default(""),
  highlighted: boolean("highlighted").notNull().default(false),
  gallery: jsonb("gallery").$type<string[]>().notNull().default([]),
  thumbnail: text("thumbnail").notNull().default(""),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

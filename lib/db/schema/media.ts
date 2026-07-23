import { index, integer, text, timestamp } from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const mediaFolders = cmsSchema.table(
  "media_folders",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    parentId: text("parent_id"),
    depth: integer("depth").notNull().default(0),
    /** shared | brand | personal */
    scope: text("scope").notNull().default("shared"),
    brandId: text("brand_id"),
    ownerUserId: text("owner_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("media_folders_parent_id_idx").on(table.parentId),
    index("media_folders_name_idx").on(table.name),
    index("media_folders_scope_idx").on(table.scope),
    index("media_folders_brand_id_idx").on(table.brandId),
    index("media_folders_owner_user_id_idx").on(table.ownerUserId),
  ],
);

export const mediaFiles = cmsSchema.table(
  "media_files",
  {
    id: text("id").primaryKey(),
    folderId: text("folder_id")
      .notNull()
      .references(() => mediaFolders.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    publicId: text("public_id"),
    filename: text("filename").notNull(),
    mimeType: text("mime_type").notNull(),
    kind: text("kind").notNull(),
    sizeBytes: integer("size_bytes").notNull().default(0),
    /** shared | brand | personal — copied from folder on upload */
    scope: text("scope").notNull().default("shared"),
    brandId: text("brand_id"),
    ownerUserId: text("owner_user_id"),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("media_files_folder_id_idx").on(table.folderId),
    index("media_files_updated_at_idx").on(table.updatedAt),
    index("media_files_kind_idx").on(table.kind),
    index("media_files_scope_idx").on(table.scope),
    index("media_files_brand_id_idx").on(table.brandId),
    index("media_files_owner_user_id_idx").on(table.ownerUserId),
  ],
);

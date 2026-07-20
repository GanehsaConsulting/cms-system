import { index, integer, text, timestamp } from "drizzle-orm/pg-core";
import { cmsSchema } from "@/lib/db/schema/auth";

export const mediaFolders = cmsSchema.table(
  "media_folders",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    parentId: text("parent_id"),
    depth: integer("depth").notNull().default(0),
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
  ],
);

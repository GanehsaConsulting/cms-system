-- Performance indexes only — safe for existing production DBs that already have tables.
-- Prefer: npm run db:push
-- Or run this file via psql against the cms schema.
-- Do NOT use a full CREATE TABLE bootstrap migration on an existing database.

CREATE INDEX IF NOT EXISTS "account_user_provider_idx" ON "cms"."account" USING btree ("user_id","provider_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "article_categories_brand_id_idx" ON "cms"."article_categories" USING btree ("brand_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "articles_brand_slug_idx" ON "cms"."articles" USING btree ("brand_id","slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_brand_updated_at_idx" ON "cms"."articles" USING btree ("brand_id","updated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_brand_status_idx" ON "cms"."articles" USING btree ("brand_id","status");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_status_published_at_idx" ON "cms"."articles" USING btree ("status","published_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "articles_author_id_idx" ON "cms"."articles" USING btree ("author_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_files_folder_id_idx" ON "cms"."media_files" USING btree ("folder_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_files_updated_at_idx" ON "cms"."media_files" USING btree ("updated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_files_kind_idx" ON "cms"."media_files" USING btree ("kind");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_folders_parent_id_idx" ON "cms"."media_folders" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "media_folders_name_idx" ON "cms"."media_folders" USING btree ("name");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "cms"."session" USING btree ("user_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_role_status_idx" ON "cms"."user" USING btree ("role","status");

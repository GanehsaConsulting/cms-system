-- Soft-delete / Trash expansion: articles, prices, activities, banners, media
ALTER TABLE "cms"."articles" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."prices" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."content_activities" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."banners" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."media_folders" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."media_files" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;

CREATE INDEX IF NOT EXISTS "articles_brand_deleted_at_idx" ON "cms"."articles" ("brand_id","deleted_at");
CREATE INDEX IF NOT EXISTS "prices_brand_deleted_at_idx" ON "cms"."prices" ("brand_id","deleted_at");
CREATE INDEX IF NOT EXISTS "content_activities_brand_deleted_at_idx" ON "cms"."content_activities" ("brand_id","deleted_at");
CREATE INDEX IF NOT EXISTS "banners_brand_deleted_at_idx" ON "cms"."banners" ("brand_id","deleted_at");
CREATE INDEX IF NOT EXISTS "media_folders_deleted_at_idx" ON "cms"."media_folders" ("deleted_at");
CREATE INDEX IF NOT EXISTS "media_files_deleted_at_idx" ON "cms"."media_files" ("deleted_at");

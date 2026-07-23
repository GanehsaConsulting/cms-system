ALTER TABLE "cms"."media_folders"
  ADD COLUMN IF NOT EXISTS "scope" text DEFAULT 'shared' NOT NULL;
ALTER TABLE "cms"."media_folders"
  ADD COLUMN IF NOT EXISTS "brand_id" text;
ALTER TABLE "cms"."media_folders"
  ADD COLUMN IF NOT EXISTS "owner_user_id" text;

ALTER TABLE "cms"."media_files"
  ADD COLUMN IF NOT EXISTS "scope" text DEFAULT 'shared' NOT NULL;
ALTER TABLE "cms"."media_files"
  ADD COLUMN IF NOT EXISTS "brand_id" text;
ALTER TABLE "cms"."media_files"
  ADD COLUMN IF NOT EXISTS "owner_user_id" text;

UPDATE "cms"."media_folders" SET "scope" = 'shared' WHERE "scope" IS NULL OR "scope" = '';
UPDATE "cms"."media_files" SET "scope" = 'shared' WHERE "scope" IS NULL OR "scope" = '';

CREATE INDEX IF NOT EXISTS "media_folders_scope_idx" ON "cms"."media_folders" USING btree ("scope");
CREATE INDEX IF NOT EXISTS "media_folders_brand_id_idx" ON "cms"."media_folders" USING btree ("brand_id");
CREATE INDEX IF NOT EXISTS "media_folders_owner_user_id_idx" ON "cms"."media_folders" USING btree ("owner_user_id");
CREATE INDEX IF NOT EXISTS "media_files_scope_idx" ON "cms"."media_files" USING btree ("scope");
CREATE INDEX IF NOT EXISTS "media_files_brand_id_idx" ON "cms"."media_files" USING btree ("brand_id");
CREATE INDEX IF NOT EXISTS "media_files_owner_user_id_idx" ON "cms"."media_files" USING btree ("owner_user_id");

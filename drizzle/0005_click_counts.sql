ALTER TABLE "cms"."articles"
  ADD COLUMN IF NOT EXISTS "click_count" integer DEFAULT 0 NOT NULL;

ALTER TABLE "cms"."portfolio"
  ADD COLUMN IF NOT EXISTS "click_count" integer DEFAULT 0 NOT NULL;

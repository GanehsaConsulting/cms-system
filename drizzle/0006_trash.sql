-- Soft-delete / Trash for clients & portfolio
ALTER TABLE "cms"."clients" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;
ALTER TABLE "cms"."portfolio" ADD COLUMN IF NOT EXISTS "deleted_at" timestamp with time zone;

CREATE INDEX IF NOT EXISTS "clients_brand_deleted_at_idx" ON "cms"."clients" ("brand_id","deleted_at");
CREATE INDEX IF NOT EXISTS "portfolio_brand_deleted_at_idx" ON "cms"."portfolio" ("brand_id","deleted_at");

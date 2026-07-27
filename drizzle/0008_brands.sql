CREATE TABLE IF NOT EXISTS "cms"."brands" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "slug" text NOT NULL,
  "logo" text DEFAULT '' NOT NULL,
  "description" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'active' NOT NULL,
  "features" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "brands_slug_idx" ON "cms"."brands" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "brands_updated_at_idx" ON "cms"."brands" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "brands_status_idx" ON "cms"."brands" USING btree ("status");

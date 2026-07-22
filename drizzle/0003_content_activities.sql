CREATE TABLE IF NOT EXISTS "cms"."content_activities" (
  "id" text PRIMARY KEY NOT NULL,
  "brand_id" text NOT NULL,
  "title" text NOT NULL,
  "excerpt" text DEFAULT '' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "display_at" timestamp with time zone NOT NULL,
  "show_title" boolean DEFAULT false NOT NULL,
  "kind" text DEFAULT 'activity' NOT NULL,
  "link_url" text DEFAULT '' NOT NULL,
  "status" text DEFAULT 'draft' NOT NULL,
  "images" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "author_name" text NOT NULL,
  "author_id" text,
  "click_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "content_activities_brand_display_idx"
  ON "cms"."content_activities" ("brand_id", "display_at");

CREATE INDEX IF NOT EXISTS "content_activities_brand_updated_idx"
  ON "cms"."content_activities" ("brand_id", "updated_at");

CREATE INDEX IF NOT EXISTS "content_activities_brand_status_idx"
  ON "cms"."content_activities" ("brand_id", "status");

CREATE INDEX IF NOT EXISTS "content_activities_brand_kind_idx"
  ON "cms"."content_activities" ("brand_id", "kind");

-- Price management tables — run via `npm run db:push` or apply manually.
-- Prefer: npm run db:push

CREATE TABLE IF NOT EXISTS "cms"."price_categories" (
  "id" text NOT NULL,
  "brand_id" text NOT NULL,
  "label" text NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "price_categories_brand_id_id_pk" PRIMARY KEY("brand_id","id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cms"."prices" (
  "id" text PRIMARY KEY NOT NULL,
  "brand_id" text NOT NULL,
  "slug" text NOT NULL,
  "service_slug" text DEFAULT '' NOT NULL,
  "category" text DEFAULT '' NOT NULL,
  "highlighted" boolean DEFAULT false NOT NULL,
  "description" jsonb NOT NULL,
  "service" jsonb NOT NULL,
  "package_name" jsonb NOT NULL,
  "price" integer DEFAULT 0 NOT NULL,
  "strikethrough_price" integer DEFAULT 0 NOT NULL,
  "whatsapp_phone" text DEFAULT '' NOT NULL,
  "whatsapp_message" jsonb NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "features" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "price_categories_brand_id_idx" ON "cms"."price_categories" USING btree ("brand_id");
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "prices_brand_slug_idx" ON "cms"."prices" USING btree ("brand_id","slug");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prices_brand_updated_at_idx" ON "cms"."prices" USING btree ("brand_id","updated_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "prices_brand_service_slug_idx" ON "cms"."prices" USING btree ("brand_id","service_slug");

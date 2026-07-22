CREATE TABLE IF NOT EXISTS "cms"."activity_events" (
  "id" text PRIMARY KEY NOT NULL,
  "brand_id" text NOT NULL,
  "entity_type" text NOT NULL,
  "entity_id" text NOT NULL,
  "action" text NOT NULL,
  "actor_id" text,
  "actor_name" text NOT NULL,
  "entity_title" text NOT NULL,
  "summary" text NOT NULL,
  "href" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "activity_events_brand_created_idx"
  ON "cms"."activity_events" ("brand_id", "created_at");

CREATE INDEX IF NOT EXISTS "activity_events_entity_idx"
  ON "cms"."activity_events" ("brand_id", "entity_type", "entity_id", "created_at");

CREATE TABLE IF NOT EXISTS "cms"."activity_reads" (
  "user_id" text NOT NULL,
  "activity_id" text NOT NULL,
  "read_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "activity_reads_user_id_activity_id_pk" PRIMARY KEY ("user_id", "activity_id")
);

CREATE INDEX IF NOT EXISTS "activity_reads_user_idx"
  ON "cms"."activity_reads" ("user_id");

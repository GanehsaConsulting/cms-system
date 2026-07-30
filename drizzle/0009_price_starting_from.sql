ALTER TABLE "cms"."prices"
ADD COLUMN IF NOT EXISTS "show_starting_from" boolean DEFAULT false NOT NULL;

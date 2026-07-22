/**
 * Import legacy Ganesha Consulting Activity/Promo rows from pg_dump → cms.content_activities.
 *
 * Usage:
 *   npx tsx scripts/migrate-activities-ganesha-dump.ts           # dry-run
 *   npx tsx scripts/migrate-activities-ganesha-dump.ts --apply   # write
 *
 * Optional:
 *   --dir database-backup/_inspect-ganesha
 *   --brand ganesha-consulting
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { contentActivities } from "../lib/db/schema";
import type {
  ContentActivityKind,
  ContentActivityStatus,
} from "../types/content-activity";

const BRAND_DEFAULT = "ganesha-consulting";

const DUMP_FILES = {
  activities: "3594.dat",
  activityMedia: "3596.dat",
  media: "3609.dat",
  users: "3595.dat",
} as const;

function legacyActivityId(legacyId: string): string {
  return `legacy-gc-activity-${legacyId}`;
}

function parseArgs(argv: string[]) {
  const apply = argv.includes("--apply");
  const brandIdx = argv.indexOf("--brand");
  const dirIdx = argv.indexOf("--dir");
  const brandId =
    brandIdx >= 0 && argv[brandIdx + 1]
      ? argv[brandIdx + 1].trim()
      : BRAND_DEFAULT;
  const dumpDir =
    dirIdx >= 0 && argv[dirIdx + 1]
      ? path.resolve(argv[dirIdx + 1])
      : path.join(process.cwd(), "database-backup/_inspect-ganesha");

  return { apply, brandId, dumpDir };
}

function unescapeCopyField(field: string): string | null {
  if (field === "\\N") {
    return null;
  }

  let out = "";
  for (let i = 0; i < field.length; i += 1) {
    const char = field[i];
    if (char === "\\" && i + 1 < field.length) {
      const next = field[i + 1];
      const mapped: Record<string, string> = {
        n: "\n",
        r: "\r",
        t: "\t",
        b: "\b",
        f: "\f",
        v: "\v",
        "\\": "\\",
      };
      out += mapped[next] ?? next;
      i += 1;
      continue;
    }
    out += char;
  }

  return out;
}

async function parseCopyFile(
  filePath: string,
  expectedCols: number,
): Promise<(string | null)[][]> {
  const text = await readFile(filePath, "utf-8");
  const rows: (string | null)[][] = [];

  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim() === "\\.") {
      continue;
    }

    const fields = line.split("\t").map(unescapeCopyField);
    if (fields.length !== expectedCols) {
      continue;
    }
    rows.push(fields);
  }

  return rows;
}

function parseBool(value: string | null): boolean {
  return value === "t" || value === "true" || value === "1";
}

function parsePgTimestamp(value: string | null): Date | null {
  if (!value?.trim()) {
    return null;
  }

  const trimmed = value.trim();
  const iso = trimmed.includes("T")
    ? trimmed
    : `${trimmed.replace(" ", "T")}${trimmed.endsWith("Z") ? "" : "Z"}`;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Legacy rows were live on the old public site — import as published unless archived.
 */
function mapLegacyActivityStatus(raw: string | null): ContentActivityStatus {
  const status = (raw ?? "").trim().toUpperCase();
  if (status === "ARCHIVE" || status === "ARCHIVED") {
    return "archived";
  }
  return "published";
}

function plainTextExcerpt(value: string, max = 200): string {
  const text = value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= max) {
    return text;
  }
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

async function main() {
  const { apply, brandId, dumpDir } = parseArgs(process.argv.slice(2));
  const mode = apply ? "APPLY" : "DRY-RUN";

  console.log(`[${mode}] brand=${brandId}`);
  console.log(`[${mode}] dumpDir=${dumpDir}`);

  const [activityRows, activityMediaRows, mediaRows, userRows] =
    await Promise.all([
      parseCopyFile(path.join(dumpDir, DUMP_FILES.activities), 12),
      parseCopyFile(path.join(dumpDir, DUMP_FILES.activityMedia), 2),
      parseCopyFile(path.join(dumpDir, DUMP_FILES.media), 10),
      parseCopyFile(path.join(dumpDir, DUMP_FILES.users), 7),
    ]);

  const authors = new Map(
    userRows.map((row) => [row[0]!, (row[2] ?? "Author").trim()]),
  );
  const mediaById = new Map(
    mediaRows.map((row) => [row[0]!, (row[1] ?? "").trim()]),
  );

  const imagesByActivityId = new Map<string, string[]>();
  for (const row of activityMediaRows) {
    const activityId = row[0]!;
    const mediaId = row[1]!;
    const url = mediaById.get(mediaId);
    if (!url) {
      continue;
    }

    const list = imagesByActivityId.get(activityId) ?? [];
    list.push(url);
    imagesByActivityId.set(activityId, list);
  }

  console.log("--- plan ---");
  console.log(`activities: ${activityRows.length}`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let missingImages = 0;

  for (const row of activityRows) {
    const legacyId = row[0]!;
    const id = legacyActivityId(legacyId);
    const title = (row[1] ?? "").trim();
    const shortDesc = (row[2] ?? "").trim();
    const content = (row[3] ?? "").trim();
    const displayAtRaw = (row[4] ?? "").trim();
    const showTitle = parseBool(row[5]);
    const linkUrl = (row[6] ?? "").trim();
    const createdAt = parsePgTimestamp(row[7]) ?? new Date();
    const updatedAt = parsePgTimestamp(row[8]) ?? createdAt;
    const status = mapLegacyActivityStatus(row[9]);
    const authorName =
      authors.get(row[10] ?? "") ?? "Ganesha Consulting";
    const kind: ContentActivityKind = parseBool(row[11]) ? "promo" : "activity";
    const images = imagesByActivityId.get(legacyId) ?? [];

    if (!title) {
      skipped += 1;
      console.log(`  skip legacy#${legacyId} — missing title`);
      continue;
    }

    const displayAt = parsePgTimestamp(displayAtRaw) ?? updatedAt;
    const excerpt = shortDesc || plainTextExcerpt(content);

    if (images.length === 0) {
      missingImages += 1;
    }

    console.log(
      `  + [${kind}] ${title.slice(0, 60)} — ${status}, images=${images.length}`,
    );

    if (!apply) {
      continue;
    }

    const existing = await db
      .select({ id: contentActivities.id, status: contentActivities.status })
      .from(contentActivities)
      .where(eq(contentActivities.id, id))
      .limit(1);

    if (existing.length > 0) {
      if (existing[0].status !== status) {
        await db
          .update(contentActivities)
          .set({ status })
          .where(eq(contentActivities.id, id));
        updated += 1;
      } else {
        skipped += 1;
      }
      continue;
    }

    await db.insert(contentActivities).values({
      id,
      brandId,
      title,
      excerpt,
      content: content || `<p>${excerpt}</p>`,
      displayAt,
      showTitle,
      kind,
      linkUrl,
      status,
      images,
      authorName,
      authorId: null,
      clickCount: 0,
      createdAt,
      updatedAt,
    });
    inserted += 1;
  }

  console.log("\n--- result ---");
  console.log(
    `inserted=${inserted} updated=${updated} skipped=${skipped} missingImages=${missingImages}`,
  );

  if (!apply) {
    console.log("\nDry-run only. Re-run with --apply to write to Postgres.");
  } else {
    console.log("Done.");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

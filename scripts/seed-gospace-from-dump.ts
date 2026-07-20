/**
 * Safe ETL from Filess/pg_dump directory backup → current CMS stores for Go Space.
 *
 * Does NOT run pg_restore. Maps legacy Prisma tables into:
 * - Postgres `cms.article_categories` + `cms.articles`
 * - JSON: prices, price-categories, clients, banners
 *
 * Usage:
 *   npx tsx scripts/seed-gospace-from-dump.ts           # dry-run
 *   npx tsx scripts/seed-gospace-from-dump.ts --apply   # write
 *
 * Optional:
 *   --dir database-backup/_inspect
 *   --brand go-space
 */
import "dotenv/config";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { and, eq } from "drizzle-orm";
import { getCustomCategoryBadgeClass } from "../config/article-category-styles";
import { createBanner, getBanners } from "../lib/db/banners";
import { createClient, getClients } from "../lib/db/clients";
import { db } from "../lib/db/client";
import {
  createPriceCategory,
  getPriceCategories,
} from "../lib/db/price-categories";
import { createPrice, getPrices } from "../lib/db/prices";
import { articleCategories, articles } from "../lib/db/schema";
import { emptyLocalizedText } from "../lib/locale";
import {
  extractWhatsAppMessage,
  extractWhatsAppPhone,
} from "../lib/prices/whatsapp";
import type { LocalizedText } from "../types/locale";
import type { PriceFeature } from "../types/price";

const BRAND_DEFAULT = "go-space";

const DUMP_FILES = {
  categories: "3469.dat",
  authors: "3470.dat",
  articles: "3471.dat",
  clientLogos: "3473.dat",
  prices: "3474.dat",
  priceFeatures: "3475.dat",
  siteAssets: "3476.dat",
} as const;

const PRICE_CATEGORY_LABELS: Record<string, string> = {
  cv: "CV",
  "meeting-room": "Meeting Room",
  pt: "PT",
  "pt-pma": "PT PMA",
  "virtual-office": "Virtual Office",
  website: "Website",
};

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
      : path.join(process.cwd(), "database-backup/_inspect");

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
    if (!line.trim() || line.trim() === ".") {
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

function parseLocalized(raw: string | null): LocalizedText {
  if (!raw?.trim()) {
    return emptyLocalizedText();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LocalizedText>;
    return {
      id: String(parsed.id ?? ""),
      en: String(parsed.en ?? ""),
      zh: String(parsed.zh ?? ""),
    };
  } catch {
    return emptyLocalizedText(raw);
  }
}

function whatsappFromLinks(links: LocalizedText) {
  const phoneSource = links.en || links.id || links.zh;
  return {
    whatsappPhone: extractWhatsAppPhone(phoneSource),
    whatsappMessage: {
      id: extractWhatsAppMessage(links.id),
      en: extractWhatsAppMessage(links.en),
      zh: extractWhatsAppMessage(links.zh),
    } satisfies LocalizedText,
  };
}

function stripHtmlExcerpt(html: string, max = 220): string {
  const text = html
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

  const [
    categoryRows,
    authorRows,
    articleRows,
    logoRows,
    priceRows,
    featureRows,
    assetRows,
  ] = await Promise.all([
    parseCopyFile(path.join(dumpDir, DUMP_FILES.categories), 5),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.authors), 5),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.articles), 16),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.clientLogos), 6),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.prices), 14),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.priceFeatures), 4),
    parseCopyFile(path.join(dumpDir, DUMP_FILES.siteAssets), 5),
  ]);

  const authors = new Map(
    authorRows.map((row) => [row[0]!, { name: row[1] ?? "Author" }]),
  );
  const categories = categoryRows.map((row) => ({
    id: (row[2] ?? "").trim() || (row[1] ?? "").trim().toLowerCase(),
    label: (row[1] ?? "").trim(),
    legacyId: row[0]!,
  }));
  const categoryByLegacyId = new Map(
    categories.map((category) => [category.legacyId, category.id]),
  );

  const featuresByPriceId = new Map<string, PriceFeature[]>();
  const featuresSorted = [...featureRows].sort(
    (a, b) =>
      Number.parseInt(a[3] ?? "0", 10) - Number.parseInt(b[3] ?? "0", 10),
  );
  for (const row of featuresSorted) {
    const priceId = row[1]!;
    const list = featuresByPriceId.get(priceId) ?? [];
    list.push({
      id: row[0]!,
      name: parseLocalized(row[2]),
    });
    featuresByPriceId.set(priceId, list);
  }

  const priceCategoryIds = [
    ...new Set(
      priceRows
        .map((row) => (row[9] ?? "").trim())
        .filter((value) => value.length > 0),
    ),
  ].sort();

  console.log("--- plan ---");
  console.log(`article categories: ${categories.length}`);
  for (const category of categories) {
    console.log(`  + ${category.id} (${category.label})`);
  }
  console.log(`articles: ${articleRows.length}`);
  for (const row of articleRows) {
    console.log(`  + ${row[2]} — ${row[1]}`);
  }
  console.log(`price categories: ${priceCategoryIds.length}`);
  for (const id of priceCategoryIds) {
    console.log(`  + ${id} → ${PRICE_CATEGORY_LABELS[id] ?? id}`);
  }
  console.log(`prices: ${priceRows.length}`);
  console.log(`client logos: ${logoRows.length}`);
  console.log(`site assets → banners: ${assetRows.length}`);

  if (!apply) {
    console.log(
      "\nDry-run only. Re-run with --apply to write Postgres + data/*.json.",
    );
    return;
  }

  let categoriesInserted = 0;
  let categoriesSkipped = 0;
  for (const [index, category] of categories.entries()) {
    if (!category.id || !category.label) {
      categoriesSkipped += 1;
      continue;
    }

    const existing = await db
      .select({ id: articleCategories.id })
      .from(articleCategories)
      .where(
        and(
          eq(articleCategories.brandId, brandId),
          eq(articleCategories.id, category.id),
        ),
      )
      .limit(1);

    if (existing.length > 0) {
      categoriesSkipped += 1;
      continue;
    }

    await db.insert(articleCategories).values({
      id: category.id,
      brandId,
      label: category.label,
      badgeClassName: getCustomCategoryBadgeClass(index),
      createdAt: new Date(),
    });
    categoriesInserted += 1;
  }

  let articlesInserted = 0;
  let articlesSkipped = 0;
  for (const row of articleRows) {
    const slug = (row[2] ?? "").trim();
    if (!slug) {
      articlesSkipped += 1;
      continue;
    }

    const existing = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(eq(articles.brandId, brandId), eq(articles.slug, slug)))
      .limit(1);

    if (existing.length > 0) {
      articlesSkipped += 1;
      continue;
    }

    const legacyCategoryId = row[12] ?? "";
    const category =
      categoryByLegacyId.get(legacyCategoryId) ?? "general";
    const author = authors.get(row[13] ?? "");
    const content = row[4] ?? "";
    const metaDescription = row[9] ?? "";
    const focusKeyword = (row[10] ?? "").trim();
    const now = new Date();
    const publishedAt = parsePgTimestamp(row[6]);
    const createdAt = parsePgTimestamp(row[14]) ?? now;
    const updatedAt = parsePgTimestamp(row[15]) ?? now;

    await db.insert(articles).values({
      id: crypto.randomUUID(),
      brandId,
      title: row[1] ?? slug,
      slug,
      excerpt: metaDescription.trim() || stripHtmlExcerpt(content),
      content,
      status: (row[5] ?? "draft").toLowerCase() === "published"
        ? "published"
        : (row[5] ?? "draft").toLowerCase(),
      authorName: author?.name ?? "Tim GoSpace",
      authorId: null,
      category,
      tags: focusKeyword ? [focusKeyword] : [],
      metaTitle: row[8] ?? "",
      metaDescription,
      highlighted: parseBool(row[7]),
      gallery: [],
      thumbnail: row[3] ?? "",
      publishedAt,
      createdAt,
      updatedAt,
    });
    articlesInserted += 1;
  }

  const existingPriceCategories = await getPriceCategories(brandId);
  const existingPriceCategoryIds = new Set(
    existingPriceCategories.map((item) => item.id),
  );
  let priceCategoriesInserted = 0;
  let priceCategoriesSkipped = 0;
  for (const id of priceCategoryIds) {
    if (existingPriceCategoryIds.has(id)) {
      priceCategoriesSkipped += 1;
      continue;
    }

    const created = await createPriceCategory(brandId, {
      label: PRICE_CATEGORY_LABELS[id] ?? id,
    });
    if (created.id !== id) {
      console.warn(
        `  ! price category id mismatch: dump=${id} created=${created.id}`,
      );
    }
    existingPriceCategoryIds.add(created.id);
    priceCategoriesInserted += 1;
  }

  const existingPrices = await getPrices(brandId);
  const existingPriceSlugs = new Set(existingPrices.map((item) => item.slug));
  let pricesInserted = 0;
  let pricesSkipped = 0;

  // Prefer stable dump order by numeric id
  const sortedPrices = [...priceRows].sort(
    (a, b) =>
      Number.parseInt(a[0] ?? "0", 10) - Number.parseInt(b[0] ?? "0", 10),
  );

  for (const row of sortedPrices) {
    const slug = (row[13] ?? "").trim();
    if (!slug || existingPriceSlugs.has(slug)) {
      pricesSkipped += 1;
      continue;
    }

    const links = parseLocalized(row[5]);
    const wa = whatsappFromLinks(links);
    const features = featuresByPriceId.get(row[0]!) ?? [];

    await createPrice(brandId, {
      slug,
      serviceSlug: (row[12] ?? "").trim(),
      category: (row[9] ?? "").trim(),
      highlighted: parseBool(row[11]),
      description: parseLocalized(row[10]),
      service: parseLocalized(row[1]),
      packageName: parseLocalized(row[2]),
      price: Number.parseInt(row[3] ?? "0", 10) || 0,
      strikethroughPrice: Number.parseInt(row[4] ?? "0", 10) || 0,
      whatsappPhone: wa.whatsappPhone,
      whatsappMessage: wa.whatsappMessage,
      isActive: parseBool(row[6]),
      features,
    });
    existingPriceSlugs.add(slug);
    pricesInserted += 1;
  }

  const existingClients = await getClients(brandId);
  const existingClientNames = new Set(
    existingClients.map((item) => item.name.toLowerCase()),
  );
  let clientsInserted = 0;
  let clientsSkipped = 0;
  for (const row of logoRows) {
    const name = (row[2] ?? "").trim();
    const logo = (row[1] ?? "").trim();
    if (!name || !logo) {
      clientsSkipped += 1;
      continue;
    }
    if (existingClientNames.has(name.toLowerCase())) {
      clientsSkipped += 1;
      continue;
    }

    await createClient(brandId, {
      name,
      logo,
      website: "",
      description: "",
      featured: false,
      testimonials: [],
      photos: [],
    });
    existingClientNames.add(name.toLowerCase());
    clientsInserted += 1;
  }

  const existingBanners = await getBanners(brandId);
  const existingBannerKeys = new Set(existingBanners.map((item) => item.key));
  let bannersInserted = 0;
  let bannersSkipped = 0;
  for (const row of assetRows) {
    const key = (row[0] ?? "").trim();
    const imageUrl = (row[1] ?? "").trim();
    if (!key || !imageUrl) {
      bannersSkipped += 1;
      continue;
    }
    if (existingBannerKeys.has(key)) {
      bannersSkipped += 1;
      continue;
    }

    await createBanner(brandId, {
      name: key
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      key,
      images: [imageUrl],
      redirectUrl: "",
      isActive: true,
    });
    existingBannerKeys.add(key);
    bannersInserted += 1;
  }

  console.log("\n--- result ---");
  console.log(
    `article categories: inserted=${categoriesInserted} skipped=${categoriesSkipped}`,
  );
  console.log(
    `articles: inserted=${articlesInserted} skipped=${articlesSkipped}`,
  );
  console.log(
    `price categories: inserted=${priceCategoriesInserted} skipped=${priceCategoriesSkipped}`,
  );
  console.log(`prices: inserted=${pricesInserted} skipped=${pricesSkipped}`);
  console.log(`clients: inserted=${clientsInserted} skipped=${clientsSkipped}`);
  console.log(`banners: inserted=${bannersInserted} skipped=${bannersSkipped}`);
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

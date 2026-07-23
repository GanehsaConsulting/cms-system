/**
 * Headless CMS → frontend wiring docs.
 * Copyable prompts for another agent to wire the public site FE.
 */

import { CRON_JOB_ORG_PUBLISH_SCHEDULED_MARKDOWN } from "@/config/cron-jobs";
import { CMS_PUBLIC_API_BASE, CMS_PUBLIC_ORIGIN } from "@/config/public-api";

export interface FeWiringDocSection {
  id: string;
  title: string;
  summary: string;
  /** Full markdown prompt — copy this to another agent. */
  markdown: string;
}

export const FE_WIRING_DOCS_INTRO = {
  title: "Frontend wiring",
  description:
    "Copy-ready documentation for wiring this headless CMS into a public frontend. Paste a section (or the full pack) into another agent.",
} as const;

const OVERVIEW_MARKDOWN = `# CMS System — Headless Frontend Wiring Guide (Complete)

## CMS base URL
Production: **\`${CMS_PUBLIC_ORIGIN}\`**
Public API: **\`${CMS_PUBLIC_API_BASE}\`**

All routes below are **live GET APIs** with CORS (\`Access-Control-Allow-Origin: *\`).

## Brands
| Brand ID | Modules |
|----------|---------|
| \`ganesha-consulting\` | ALL |
| \`go-space\` | ALL |
| \`gonline\` | ALL |
| \`gec\` | articles, clients-works, banners (**no prices, no activities**) |

Always pass \`?brandId=\`. Disabled modules return \`{ data: [] }\` (detail → 404).

## Full public API catalog

### Brands
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/brands
GET ${CMS_PUBLIC_API_BASE}/brands/{brandId}
\`\`\`

### Articles
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/articles?brandId=
GET ${CMS_PUBLIC_API_BASE}/articles/{slug}?brandId=
GET ${CMS_PUBLIC_API_BASE}/articles/{slug}/related?brandId=
GET ${CMS_PUBLIC_API_BASE}/article-categories?brandId=
\`\`\`
Query filters: \`highlighted=true|false\`, \`category=\`, \`tag=\`, \`q=\` or \`search=\`, \`sort=\`, \`page=\`, \`limit=\`, \`excludeSlug=\`  
Detail preview (staging): \`preview=\` or \`Authorization: Bearer\` with \`CMS_PREVIEW_SECRET\`

### Prices
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/prices?brandId=
GET ${CMS_PUBLIC_API_BASE}/prices/{slug}?brandId=
GET ${CMS_PUBLIC_API_BASE}/price-categories?brandId=
\`\`\`
Query filters: \`category=\` (alias \`serviceSlug=\`), \`highlighted=true|false\`, \`q=\`/\`search=\`, \`sort=\`, \`page=\`, \`limit=\`

### Clients & portfolio
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/clients?brandId=
GET ${CMS_PUBLIC_API_BASE}/clients/{id}?brandId=
GET ${CMS_PUBLIC_API_BASE}/clients/{id}/portfolio?brandId=
GET ${CMS_PUBLIC_API_BASE}/portfolio?brandId=
GET ${CMS_PUBLIC_API_BASE}/portfolio/{id}?brandId=
\`\`\`
Clients filters: \`featured=true|false\`, \`q=\`/\`search=\`, \`sort=\`, \`page=\`, \`limit=\`  
Portfolio filters: \`featured=true|false\`, \`workType=website|social-media\`, \`clientId=\`, \`excludeId=\`, \`q=\`/\`search=\`, \`sort=\`, \`page=\`, \`limit=\`

### Banners
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/banners?brandId=
GET ${CMS_PUBLIC_API_BASE}/banners/by-key/{key}?brandId=
\`\`\`
List filters: \`key=\`, \`q=\`/\`search=\`, \`sort=\`

### Activities (Activity / Promo cards)
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/activities?brandId=
GET ${CMS_PUBLIC_API_BASE}/activities/{id}?brandId=
GET ${CMS_PUBLIC_API_BASE}/activities/{id}/click?brandId=
\`\`\`
List filters: \`kind=activity|promo\`, \`showTitle=true|false\`, \`q=\`/\`search=\`, \`sort=\`, \`page=\`, \`limit=\`  
Click endpoint increments \`clickCount\` (fire on card CTA click).

### Media
No browse API — use URLs on content entities. Brand logos: \`${CMS_PUBLIC_ORIGIN}/brands/...\`

## Envelope
\`\`\`ts
type ApiOk<T> = { data: T };
type ApiError = { error: string };

type ApiPaginatedList<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};
\`\`\`

Article, client, portfolio, and price **lists** use \`ApiPaginatedList\`. Category and banner lists return \`{ data: T[] }\` (small sets).

## Public visibility rules
| Domain | Returned |
|--------|----------|
| Articles | published only (scheduled posts auto-promote via cron + on read) |
| Prices / banners | active only |
| Activities | published only |
| Clients / portfolio | all (filter with query) |
| Brands | active only |

## Locales
\`\`\`ts
type SiteLocale = "id" | "en" | "zh";
type LocalizedText = Record<SiteLocale, string>;
\`\`\`

## Agent rules
1. Use only \`${CMS_PUBLIC_API_BASE}\`
2. Always send \`brandId\`
3. Gate UI with brand \`features\`
4. Cache keys include brandId + locale + filters
`;

const ARTICLES_MARKDOWN = `# Articles — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/articles?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/articles/{slug}?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/articles/{slug}/related?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/article-categories?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&page=1&limit=12
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&highlighted=true
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&category=finance
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&tag=tax
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&q=investment
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&sort=title-asc
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&excludeSlug=my-slug
${CMS_PUBLIC_API_BASE}/articles/my-slug?brandId=gonline
${CMS_PUBLIC_API_BASE}/articles/my-slug/related?brandId=gonline&limit=3
${CMS_PUBLIC_API_BASE}/articles/draft-slug?brandId=gonline&preview=YOUR_PREVIEW_SECRET
${CMS_PUBLIC_API_BASE}/article-categories?brandId=gonline
\`\`\`

Feature required: \`articles\`

## List response (paginated, no HTML body)
\`\`\`ts
type ApiPaginatedList<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};
\`\`\`

Default: \`page=1\`, \`limit=20\` (max \`100\`). List items are **summaries** — fetch detail for \`content\`.

## List query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`page\` | number | default \`1\` |
| \`limit\` | number | default \`20\`, max \`100\` |
| \`highlighted\` | \`true\` \\| \`false\` | omit = all published |
| \`category\` | category id | exact match |
| \`tag\` | string | exact match (case-insensitive) on \`tags[]\` |
| \`q\` or \`search\` | string | title, slug, excerpt, author, category, tags |
| \`excludeSlug\` | slug | omit current article on detail sidebar |
| \`sort\` | see below | default \`publishedAt-desc\` |

### Sort values
- \`publishedAt-desc\` (default)
- \`publishedAt-asc\`
- \`title-asc\`
- \`title-desc\`
- \`updatedAt-desc\`

## Related articles
\`GET .../articles/{slug}/related?brandId=&limit=3\` (default \`limit=3\`, max \`100\`)

Returns \`ArticleSummary[]\` ranked by shared category, then shared tags, then recency. Source must be **published**.

## Draft / scheduled preview (staging)
Set \`CMS_PREVIEW_SECRET\` on CMS. Then:

\`\`\`
GET .../articles/{slug}?brandId=...&preview=SECRET
Authorization: Bearer SECRET
\`\`\`

Returns draft, scheduled, or archived articles that are hidden from public list. Response is \`Cache-Control: private, no-store\`. **Never expose the secret in production client bundles.**

## Types
\`\`\`ts
interface ArticleSummary {
  id: string;
  brandId: string;
  title: string;
  slug: string;
  excerpt: string;
  status: "draft" | "scheduled" | "published" | "archived";
  authorName: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  highlighted: boolean;
  gallery: string[];
  thumbnail: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Article extends ArticleSummary {
  content: string; // HTML — detail endpoint only
}

interface ArticleCategory {
  id: string;
  label: string;
  source: "built-in" | "custom";
}
\`\`\`

Style category badges on the FE — \`badgeClassName\` is **not** exposed on the public API.

## Scheduled posts
CMS can set \`status: "scheduled"\` with a future \`publishedAt\`. A **cron-job.org** job hits \`GET /api/cron/publish-scheduled\` every minute to promote due posts. Reads (public API / CMS) also promote as a fallback. The FE only consumes \`published\` articles in list/related.

## CMS production checklist (affects data)
1. Run \`npm run db:push\` (articles scoped per \`brandId\`)
2. Backfill legacy rows: \`npx tsx scripts/migrate-brand-isolation.ts gec\`
3. Set \`CRON_SECRET\` + cron-job.org URL for scheduled publish
4. Set \`CMS_PREVIEW_SECRET\` on staging if preview is needed
5. Always pass the correct \`brandId\` per public site (e.g. \`gec\`, \`gonline\`)

## Agent checklist
- [ ] Paginated list (\`ArticleSummary\`) + full detail by slug
- [ ] Related block from \`/articles/{slug}/related\`
- [ ] Category nav from \`/article-categories\` (map labels to your own badge styles)
- [ ] Filters: highlighted, category, tag, search, sort, pagination
- [ ] Hide if brand lacks \`articles\`
- [ ] Preview only on staging with server-side secret (optional)
`;

const PRICES_MARKDOWN = `# Prices — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/prices?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/prices/{slug}?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/price-categories?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&page=1&limit=12
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&category=consulting
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&serviceSlug=consulting
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&highlighted=true
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&q=premium
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&sort=price-asc
${CMS_PUBLIC_API_BASE}/prices/starter-plan?brandId=gonline
${CMS_PUBLIC_API_BASE}/price-categories?brandId=gonline&q=web
\`\`\`

Feature required: \`prices\` — **GEC returns empty / 404**. Do not render pricing UI.

## List response (paginated)
\`\`\`ts
type ApiPaginatedList<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};
\`\`\`

Default: \`page=1\`, \`limit=20\` (max \`100\`). List items are **summaries** — fetch detail for long descriptions, feature lists, and localized WhatsApp copy.

## List query params (prices)
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`page\` | number | default \`1\` |
| \`limit\` | number | default \`20\`, max \`100\` |
| \`category\` | id | matches \`category\` or \`serviceSlug\` |
| \`serviceSlug\` | id | alias of \`category\` |
| \`highlighted\` | \`true\` \\| \`false\` | |
| \`q\` / \`search\` | string | slug, names, descriptions (all locales) |
| \`sort\` | see below | default \`updatedAt-desc\` |

### Sort values
- \`updatedAt-desc\` (default)
- \`price-asc\`
- \`price-desc\`
- \`packageName-asc\`

## Price-categories query params
| Param | Notes |
|-------|-------|
| \`brandId\` | required |
| \`q\` / \`search\` | id + label |
| \`sort\` | \`label-asc\` (default), \`label-desc\` |

## Types
\`\`\`ts
type LocalizedText = Record<"id" | "en" | "zh", string>;

interface PriceSummary {
  id: string;
  brandId: string;
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  service: LocalizedText;
  packageName: LocalizedText;
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Price extends PriceSummary {
  description: LocalizedText;
  whatsappMessage: LocalizedText;
  features: { id: string; name: LocalizedText }[];
}

interface PriceCategory {
  id: string;
  brandId: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## WhatsApp CTA
\`\`\`ts
const wa = \`https://wa.me/\${price.whatsappPhone}?text=\${encodeURIComponent(msg)}\`;
\`\`\`

## CMS production checklist (affects data)
1. Prices live in Postgres (\`cms.prices\`, \`cms.price_categories\`) — not JSON files on disk
2. Seed/import from legacy JSON if needed: \`npm run db:migrate:prices\`
3. GEC does not expose \`prices\` — gate the FE by brand \`features\`

## Agent checklist
- [ ] Paginated list (\`PriceSummary\`) + full detail by slug
- [ ] Categories for tabs/filters
- [ ] Filters: category / serviceSlug, highlighted, search, sort, pagination
- [ ] Hide for brands without \`prices\`
`;

const CLIENTS_MARKDOWN = `# Clients & Works — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/clients?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/clients/{id}?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/clients/{id}/portfolio?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/portfolio?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/portfolio/{id}?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&page=1&limit=12
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&featured=true
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&featured=false
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&q=acme&sort=featured-first
${CMS_PUBLIC_API_BASE}/clients/client-123?brandId=gonline
${CMS_PUBLIC_API_BASE}/clients/client-123/portfolio?brandId=gonline&page=1
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&page=1&limit=12
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&workType=website
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&workType=social-media
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&clientId=client-123
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&featured=true&q=landing
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&excludeId=work-456
${CMS_PUBLIC_API_BASE}/portfolio/work-456?brandId=gonline
\`\`\`

Feature required: \`clients-works\`

## List response (paginated)
\`\`\`ts
type ApiPaginatedList<T> = {
  data: T[];
  meta: {
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
};
\`\`\`

Default: \`page=1\`, \`limit=20\` (max \`100\`). List items are **summaries** — fetch detail for full fields.

## Clients query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`page\` | number | default \`1\` |
| \`limit\` | number | default \`20\`, max \`100\` |
| \`featured\` | \`true\` \\| \`false\` | omit = all |
| \`q\` / \`search\` | string | name, website, description, testimonials |
| \`sort\` | \`name-asc\` (default), \`name-desc\`, \`featured-first\` | |

## Client portfolio (works by client)
\`GET .../clients/{id}/portfolio?brandId=\` — paginated \`PortfolioSummary[]\` for one client.

Supports the same portfolio filters as the global list (\`workType\`, \`featured\`, \`q\`/\`search\`, \`sort\`, \`page\`, \`limit\`, \`excludeId\`) except \`clientId\` (fixed from path).

Prefer this over \`portfolio?clientId=\` on client detail pages.

## Portfolio query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`page\` | number | default \`1\` |
| \`limit\` | number | default \`20\`, max \`100\` |
| \`featured\` | \`true\` \\| \`false\` | |
| \`workType\` | \`website\` \\| \`social-media\` | |
| \`clientId\` | string | filter by client |
| \`excludeId\` | work id | omit current work on detail sidebar |
| \`q\` / \`search\` | string | title, description, url, workType, clientId |
| \`sort\` | \`updatedAt-desc\` (default), \`title-asc\`, \`featured-first\` | |

## Types
\`\`\`ts
interface ClientSummary {
  id: string;
  brandId: string;
  name: string;
  logo: string;
  website: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Client extends ClientSummary {
  description: string;
  testimonials: { id: string; quote: string; authorName: string; authorTitle: string }[];
  photos: { id: string; url: string; caption: string }[];
}

interface ClientRef {
  id: string;
  name: string;
  logo: string;
  website: string;
}

interface PortfolioSummary {
  id: string;
  brandId: string;
  title: string;
  clientId: string;
  workType: "social-media" | "website";
  coverImage: string;
  url: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Portfolio extends PortfolioSummary {
  description: string;
  client: ClientRef; // detail endpoint only — embedded client name/logo
}
\`\`\`

## CMS production checklist (affects data)
1. JSON stores (\`data/clients.json\`, \`data/portfolio.json\`) must include \`brandId\` on each row
2. Backfill legacy rows: \`npx tsx scripts/backfill-json-brand-id.ts gec\` (repeat per brand as needed)
3. Orphan portfolio rows (missing \`clientId\`) return 404 on detail

## Agent checklist
- [ ] Clients list (summaries) + detail
- [ ] Client portfolio via \`/clients/{id}/portfolio\`
- [ ] Portfolio list (summaries) + detail with embedded \`client\`
- [ ] Pagination + featured / workType / clientId / search / sort
- [ ] Hide if brand lacks \`clients-works\`
`;

const BANNERS_MARKDOWN = `# Banners — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/banners?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/banners/by-key/{key}?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/banners?brandId=gonline
${CMS_PUBLIC_API_BASE}/banners?brandId=gonline&key=homepage
${CMS_PUBLIC_API_BASE}/banners?brandId=gonline&q=promo&sort=name-asc
${CMS_PUBLIC_API_BASE}/banners/by-key/homepage?brandId=gonline
${CMS_PUBLIC_API_BASE}/banners/by-key/popup?brandId=gec
${CMS_PUBLIC_API_BASE}/banners/by-key/mega-menu?brandId=gec
${CMS_PUBLIC_API_BASE}/banners/by-key/bottom?brandId=gec
${CMS_PUBLIC_API_BASE}/banners/by-key/cta-primary?brandId=gonline
${CMS_PUBLIC_API_BASE}/banners/by-key/cta-inline?brandId=gonline
\`\`\`

Feature required: \`banners\` · Only \`isActive: true\` banners are returned.

## Website placement keys (CMS-defined, brand-owned)

These keys appear in **Banners → Website**. They are **required** once set up: keep at least 1 image and do not delete the banner row for that key.

### Banners
| Key | Placement |
|-----|-----------|
| \`homepage\` | Homepage hero (top section) |
| \`popup\` | Popup banner |
| \`mega-menu\` | Mega menu banner |
| \`bottom\` | Bottom sticky banner |

### CTA
| Key | Placement |
|-----|-----------|
| \`cta-primary\` | Full-width primary call-to-action block |
| \`cta-inline\` | Compact inline CTA (sidebar / embeds) |

Use **by-key** for each placement — one fetch per slot. Keys are lowercase with hyphens.

In the CMS, each placement card has **Copy FE docs** (and Website has **Copy all docs**) for paste-ready agent prompts.

## List query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`key\` | string | filter list by placement key |
| \`q\` / \`search\` | string | name, key, redirectUrl |
| \`sort\` | \`updatedAt-desc\` (default), \`name-asc\`, \`key-asc\` | |

List returns \`{ data: Banner[] }\` (typically a small set — pagination not required).

## Prefer by-key for placements
\`\`\`ts
const PLACEMENT_KEYS = [
  "homepage",
  "popup",
  "mega-menu",
  "bottom",
  "cta-primary",
  "cta-inline",
] as const;

async function loadPlacementBanner(brandId: string, key: string) {
  const res = await fetch(
    \`${CMS_PUBLIC_API_BASE}/banners/by-key/\${encodeURIComponent(key)}?brandId=\${brandId}\`,
  );

  if (!res.ok) {
    return null; // inactive, missing, or module disabled
  }

  const { data } = await res.json();
  return data as Banner;
}
\`\`\`

Or bootstrap all active banners once and map by key:
\`\`\`ts
const { data: banners } = await fetch(
  \`${CMS_PUBLIC_API_BASE}/banners?brandId=\${brandId}\`,
).then((r) => r.json());

const byKey = Object.fromEntries(banners.map((b: Banner) => [b.key, b]));
const hero = byKey.homepage ?? null;
const primaryCta = byKey["cta-primary"] ?? null;
\`\`\`

## Carousel
When \`images.length > 1\`, render as a carousel. Single image = static banner.

## Redirect
\`redirectUrl\` may be:
- Absolute URL (\`https://...\`)
- Site path (\`/contact\`)
- WhatsApp URL (\`https://wa.me/...\` or \`whatsapp://...\`)

## Type
\`\`\`ts
interface Banner {
  id: string;
  brandId: string;
  name: string;
  key: string;
  images: string[];
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## CMS production checklist (affects data)
1. JSON store \`data/banners.json\` must include \`brandId\` on each row
2. Backfill legacy rows: \`npx tsx scripts/backfill-json-brand-id.ts gec\`
3. Set **Active** in CMS for banners that should appear on the public site
4. Use the CMS placement keys above (\`homepage\`, not \`homepage-hero\`)
5. Do not delete required Website placement rows after setup (min 1 image)

## Agent checklist
- [ ] Load each placement via \`by-key\` (or list + map by key)
- [ ] Wire both **Banners** and **CTA** keys listed above
- [ ] Carousel when \`images.length > 1\`
- [ ] Link \`redirectUrl\` on click
- [ ] Hide placement when 404 / inactive / brand lacks \`banners\`
- [ ] Cache keys include \`brandId\` + placement key
`;

const ACTIVITIES_MARKDOWN = `# Activities — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/activities?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/activities/{id}?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/activities/{id}/click?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/activities?brandId=gonline&page=1&limit=12
${CMS_PUBLIC_API_BASE}/activities?brandId=gonline&kind=promo
${CMS_PUBLIC_API_BASE}/activities?brandId=gonline&showTitle=true
${CMS_PUBLIC_API_BASE}/activities?brandId=gonline&q=summer&sort=displayAt-desc
${CMS_PUBLIC_API_BASE}/activities/abc-123?brandId=gonline
${CMS_PUBLIC_API_BASE}/activities/abc-123/click?brandId=gonline
\`\`\`

Feature required: \`activities\` · Only \`status: "published"\` items are returned.

## List query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`page\` | number | default \`1\` |
| \`limit\` | number | default \`20\`, max \`100\` |
| \`kind\` | \`activity\` \\| \`promo\` | omit = both |
| \`showTitle\` | \`true\` \\| \`false\` | filter cards that show/hide title |
| \`q\` / \`search\` | string | title, excerpt, content, linkUrl |
| \`sort\` | see below | default \`displayAt-desc\` |

### Sort values
- \`displayAt-desc\` (default)
- \`displayAt-asc\`
- \`title-asc\`
- \`clicks-desc\`
- \`updatedAt-desc\`

## Click tracking
Call \`GET .../activities/{id}/click?brandId=\` when the user taps the card CTA (Instagram link, promo URL, etc.). Response:
\`\`\`ts
{ data: { id: string; clickCount: number } }
\`\`\`

## Type
\`\`\`ts
type ContentActivityKind = "activity" | "promo";

interface ContentActivity {
  id: string;
  brandId: string;
  title: string;
  excerpt: string;
  content: string; // HTML
  displayAt: string; // ISO
  showTitle: boolean;
  kind: ContentActivityKind;
  linkUrl: string;
  status: "draft" | "published" | "archived";
  images: string[];
  authorName: string;
  authorId: string | null;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## Card rendering
- \`images[]\` — carousel when length > 1
- \`showTitle\` — when \`true\`, render \`title\` and require \`linkUrl\` for CTA
- \`kind: "promo"\` — promo card; \`kind: "activity"\` — activity card (often Instagram)
- Sort feed by \`displayAt\` descending for timeline UX

## Agent checklist
- [ ] Paginated list + detail fetch
- [ ] Filter by \`kind\` and \`showTitle\` if needed
- [ ] Carousel for multiple images
- [ ] CTA opens \`linkUrl\`; fire click endpoint on interaction
- [ ] Hide section when brand lacks \`activities\` or list is empty
- [ ] Cache keys include \`brandId\` + filters
`;

const MEDIA_MARKDOWN = `# Media / Files — Frontend Wiring

## No public browse API (intentional)
Use asset URLs already on content:

| Source | Fields |
|--------|--------|
| Articles | \`thumbnail\`, \`gallery[]\` |
| Banners | \`images[]\` |
| Activities | \`images[]\` |
| Clients | \`logo\`, \`photos[].url\` |
| Portfolio | \`coverImage\` |
| Brands | \`logo\` |

Static brand logos on CMS origin:
\`\`\`
${CMS_PUBLIC_ORIGIN}/brands/ganesha-consulting.png
${CMS_PUBLIC_ORIGIN}/brands/logo-gospace.png
${CMS_PUBLIC_ORIGIN}/brands/gonline-logo-only.png
${CMS_PUBLIC_ORIGIN}/brands/gec-logo-only.webp
\`\`\`

## Agent checklist
- [ ] \`next/image\` remotePatterns for CDN
- [ ] Empty URL fallback
- [ ] Do not invent a public media library API
`;

const BRANDS_MARKDOWN = `# Brands & Modules — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/brands
GET ${CMS_PUBLIC_API_BASE}/brands/{brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/brands
${CMS_PUBLIC_API_BASE}/brands/gonline
${CMS_PUBLIC_API_BASE}/brands/gec
\`\`\`

## Response
\`\`\`ts
type BrandFeatureId =
  | "dashboard"
  | "articles"
  | "prices"
  | "clients-works"
  | "banners"
  | "activities";

interface PublicBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  features: BrandFeatureId[];
}
\`\`\`

## Bootstrap
1. Resolve \`brandId\`
2. \`GET .../brands/{brandId}\`
3. Gate sections with \`features\`
4. Pass same \`brandId\` to every content call

| Feature | FE section |
|---------|------------|
| \`articles\` | Blog |
| \`prices\` | Pricing |
| \`clients-works\` | Clients + Portfolio |
| \`banners\` | Hero / popup / CTA placements |
| \`activities\` | Activity / promo feed |
| \`dashboard\` | CMS-only |

## Agent checklist
- [ ] Brand bootstrap
- [ ] GEC: no pricing
- [ ] Single brandId source of truth
`;

const FULL_PACK_MARKDOWN = [
  OVERVIEW_MARKDOWN,
  "---",
  ARTICLES_MARKDOWN,
  "---",
  PRICES_MARKDOWN,
  "---",
  CLIENTS_MARKDOWN,
  "---",
  BANNERS_MARKDOWN,
  "---",
  ACTIVITIES_MARKDOWN,
  "---",
  MEDIA_MARKDOWN,
  "---",
  BRANDS_MARKDOWN,
].join("\n\n");

export const FE_WIRING_DOC_SECTIONS: FeWiringDocSection[] = [
  {
    id: "full-pack",
    title: "Full pack (all sections)",
    summary:
      "Complete catalog: every public endpoint, filter, sort, and type for https://cms.gonline.id.",
    markdown: FULL_PACK_MARKDOWN,
  },
  {
    id: "overview",
    title: "Overview",
    summary: "Full API catalog, brands, visibility rules, and agent rules.",
    markdown: OVERVIEW_MARKDOWN,
  },
  {
    id: "brands",
    title: "Brands & modules",
    summary: "Brand list/detail endpoints and feature gating.",
    markdown: BRANDS_MARKDOWN,
  },
  {
    id: "articles",
    title: "Articles",
    summary:
      "Paginated list summaries, detail, related, categories, preview, filters.",
    markdown: ARTICLES_MARKDOWN,
  },
  {
    id: "prices",
    title: "Prices",
    summary:
      "Paginated summaries, detail by slug, categories, filters, and WhatsApp CTA.",
    markdown: PRICES_MARKDOWN,
  },
  {
    id: "clients-works",
    title: "Clients & Works",
    summary:
      "Paginated summaries, detail, client portfolio, embedded client on work detail.",
    markdown: CLIENTS_MARKDOWN,
  },
  {
    id: "banners",
    title: "Banners",
    summary:
      "Website placements by type (Banners + CTA), by-key wiring, copyable FE docs, carousel.",
    markdown: BANNERS_MARKDOWN,
  },
  {
    id: "activities",
    title: "Activities",
    summary:
      "Activity and promo cards with images, display date, click tracking, and filters.",
    markdown: ACTIVITIES_MARKDOWN,
  },
  {
    id: "media",
    title: "Media / Files",
    summary: "No browse API — use embedded asset URLs from content.",
    markdown: MEDIA_MARKDOWN,
  },
  {
    id: "cron-jobs",
    title: "Scheduled publish (cron)",
    summary: "cron-job.org setup for auto-publishing scheduled articles.",
    markdown: CRON_JOB_ORG_PUBLISH_SCHEDULED_MARKDOWN,
  },
];

export function getFeWiringDocSection(id: string): FeWiringDocSection | null {
  return FE_WIRING_DOC_SECTIONS.find((section) => section.id === id) ?? null;
}

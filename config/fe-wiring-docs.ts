/**
 * Headless CMS → frontend wiring docs.
 * Copyable prompts for another agent to wire the public site FE.
 */

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
| \`gec\` | articles, clients-works, banners (**no prices**) |

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
GET ${CMS_PUBLIC_API_BASE}/article-categories?brandId=
\`\`\`
Query filters: \`highlighted=true|false\`, \`category=\`, \`tag=\`, \`q=\` or \`search=\`, \`sort=\`

### Prices
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/prices?brandId=
GET ${CMS_PUBLIC_API_BASE}/prices/{slug}?brandId=
GET ${CMS_PUBLIC_API_BASE}/price-categories?brandId=
\`\`\`
Query filters: \`category=\` (alias \`serviceSlug=\`), \`highlighted=true|false\`, \`q=\`/\`search=\`, \`sort=\`

### Clients & portfolio
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/clients?brandId=
GET ${CMS_PUBLIC_API_BASE}/clients/{id}?brandId=
GET ${CMS_PUBLIC_API_BASE}/portfolio?brandId=
GET ${CMS_PUBLIC_API_BASE}/portfolio/{id}?brandId=
\`\`\`
Clients filters: \`featured=true|false\`, \`q=\`/\`search=\`, \`sort=\`  
Portfolio filters: \`featured=true|false\`, \`workType=website|social-media\`, \`clientId=\`, \`q=\`/\`search=\`, \`sort=\`

### Banners
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/banners?brandId=
GET ${CMS_PUBLIC_API_BASE}/banners/by-key/{key}?brandId=
\`\`\`
List filters: \`key=\`, \`q=\`/\`search=\`, \`sort=\`

### Media
No browse API — use URLs on content entities. Brand logos: \`${CMS_PUBLIC_ORIGIN}/brands/...\`

## Envelope
\`\`\`ts
type ApiOk<T> = { data: T };
type ApiList<T> = { data: T[] };
type ApiError = { error: string };
\`\`\`

## Public visibility rules
| Domain | Returned |
|--------|----------|
| Articles | published only (due scheduled posts auto-promote on read) |
| Prices / banners | active only |
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
GET ${CMS_PUBLIC_API_BASE}/article-categories?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&highlighted=true
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&category=finance
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&tag=tax
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&q=investment
${CMS_PUBLIC_API_BASE}/articles?brandId=gonline&sort=title-asc
${CMS_PUBLIC_API_BASE}/articles/my-slug?brandId=gonline
${CMS_PUBLIC_API_BASE}/article-categories?brandId=gonline
\`\`\`

Feature required: \`articles\`

## List query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
| \`highlighted\` | \`true\` \\| \`false\` | omit = all published |
| \`category\` | category id | exact match |
| \`tag\` | string | exact match (case-insensitive) on \`tags[]\` |
| \`q\` or \`search\` | string | title, slug, excerpt, author, category, tags |
| \`sort\` | see below | default \`publishedAt-desc\` |

### Sort values
- \`publishedAt-desc\` (default)
- \`publishedAt-asc\`
- \`title-asc\`
- \`title-desc\`
- \`updatedAt-desc\`

## Types
\`\`\`ts
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML
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

interface ArticleCategory {
  id: string;
  label: string;
  badgeClassName: string;
  source: "built-in" | "custom";
}
\`\`\`

## Scheduled posts
CMS can set \`status: "scheduled"\` with a future \`publishedAt\`. When that time is reached, the CMS **auto-promotes** the article to \`published\` on the next read (public API or CMS list/detail). The FE only needs to consume published articles — no special scheduled handling on the public site.

## Agent checklist
- [ ] List + detail by slug
- [ ] Category nav from \`/article-categories\`
- [ ] Filters: highlighted, category, tag, search, sort
- [ ] Hide if brand lacks \`articles\`
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
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&category=consulting
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&serviceSlug=consulting
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&highlighted=true
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&q=premium
${CMS_PUBLIC_API_BASE}/prices?brandId=gonline&sort=price-asc
${CMS_PUBLIC_API_BASE}/prices/starter-plan?brandId=gonline
${CMS_PUBLIC_API_BASE}/price-categories?brandId=gonline&q=web
\`\`\`

Feature required: \`prices\` — **GEC returns empty / 404**. Do not render pricing UI.

## List query params (prices)
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | string | **required** |
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

interface Price {
  id: string;
  slug: string;
  serviceSlug: string;
  category: string;
  highlighted: boolean;
  description: LocalizedText;
  service: LocalizedText;
  packageName: LocalizedText;
  price: number;
  strikethroughPrice: number;
  whatsappPhone: string;
  whatsappMessage: LocalizedText;
  isActive: boolean;
  features: { id: string; name: LocalizedText }[];
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## WhatsApp CTA
\`\`\`ts
const wa = \`https://wa.me/\${price.whatsappPhone}?text=\${encodeURIComponent(msg)}\`;
\`\`\`

## Agent checklist
- [ ] List + detail by slug
- [ ] Categories for tabs/filters
- [ ] All query filters above
- [ ] Hide for brands without \`prices\`
`;

const CLIENTS_MARKDOWN = `# Clients & Works — Complete Frontend Wiring

## Endpoints
\`\`\`
GET ${CMS_PUBLIC_API_BASE}/clients?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/clients/{id}?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/portfolio?brandId={brandId}
GET ${CMS_PUBLIC_API_BASE}/portfolio/{id}?brandId={brandId}
\`\`\`

Examples:
\`\`\`
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&featured=true
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&featured=false
${CMS_PUBLIC_API_BASE}/clients?brandId=gonline&q=acme&sort=featured-first
${CMS_PUBLIC_API_BASE}/clients/client-123?brandId=gonline
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&workType=website
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&workType=social-media
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&clientId=client-123
${CMS_PUBLIC_API_BASE}/portfolio?brandId=gonline&featured=true&q=landing
${CMS_PUBLIC_API_BASE}/portfolio/work-456?brandId=gonline
\`\`\`

Feature required: \`clients-works\`

## Clients query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | required | |
| \`featured\` | \`true\` \\| \`false\` | omit = all |
| \`q\` / \`search\` | string | name, website, description, testimonials |
| \`sort\` | \`name-asc\` (default), \`name-desc\`, \`featured-first\` | |

## Portfolio query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | required | |
| \`featured\` | \`true\` \\| \`false\` | |
| \`workType\` | \`website\` \\| \`social-media\` | |
| \`clientId\` | string | join filter |
| \`q\` / \`search\` | string | title, description, url, workType, clientId |
| \`sort\` | \`updatedAt-desc\` (default), \`title-asc\`, \`featured-first\` | |

## Types
\`\`\`ts
interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  featured: boolean;
  testimonials: { id: string; quote: string; authorName: string; authorTitle: string }[];
  photos: { id: string; url: string; caption: string }[];
  createdAt: string;
  updatedAt: string;
}

interface Portfolio {
  id: string;
  title: string;
  clientId: string;
  workType: "social-media" | "website";
  coverImage: string;
  description: string;
  url: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## Agent checklist
- [ ] Clients list + detail
- [ ] Portfolio list + detail
- [ ] featured / workType / clientId / search / sort
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
${CMS_PUBLIC_API_BASE}/banners?brandId=gonline&key=homepage-hero
${CMS_PUBLIC_API_BASE}/banners?brandId=gonline&q=promo&sort=name-asc
${CMS_PUBLIC_API_BASE}/banners/by-key/homepage-hero?brandId=gonline
\`\`\`

Feature required: \`banners\` · Only \`isActive\` banners.

## List query params
| Param | Values | Notes |
|-------|--------|-------|
| \`brandId\` | required | |
| \`key\` | string | filter list by placement key |
| \`q\` / \`search\` | string | name, key, redirectUrl |
| \`sort\` | \`updatedAt-desc\` (default), \`name-asc\`, \`key-asc\` | |

## Prefer by-key for placements
\`\`\`ts
const res = await fetch(
  \`${CMS_PUBLIC_API_BASE}/banners/by-key/homepage-hero?brandId=\${brandId}\`,
);
\`\`\`

## Type
\`\`\`ts
interface Banner {
  id: string;
  name: string;
  key: string;
  images: string[];
  redirectUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
\`\`\`

## Agent checklist
- [ ] List + by-key
- [ ] Filters key/search/sort
- [ ] Carousel when \`images.length > 1\`
- [ ] Hide if brand lacks \`banners\`
`;

const MEDIA_MARKDOWN = `# Media / Files — Frontend Wiring

## No public browse API (intentional)
Use asset URLs already on content:

| Source | Fields |
|--------|--------|
| Articles | \`thumbnail\`, \`gallery[]\` |
| Banners | \`images[]\` |
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
  | "banners";

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
| \`banners\` | Hero / popup |
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
      "List/detail/categories + highlighted, category, tag, search, sort.",
    markdown: ARTICLES_MARKDOWN,
  },
  {
    id: "prices",
    title: "Prices",
    summary:
      "List/detail by slug + categories, category/serviceSlug, search, sort.",
    markdown: PRICES_MARKDOWN,
  },
  {
    id: "clients-works",
    title: "Clients & Works",
    summary:
      "Clients + portfolio list/detail with featured, workType, clientId, search, sort.",
    markdown: CLIENTS_MARKDOWN,
  },
  {
    id: "banners",
    title: "Banners",
    summary: "List + by-key with key/search/sort filters.",
    markdown: BANNERS_MARKDOWN,
  },
  {
    id: "media",
    title: "Media / Files",
    summary: "No browse API — use embedded asset URLs from content.",
    markdown: MEDIA_MARKDOWN,
  },
];

export function getFeWiringDocSection(id: string): FeWiringDocSection | null {
  return FE_WIRING_DOC_SECTIONS.find((section) => section.id === id) ?? null;
}

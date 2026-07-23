import { CMS_PUBLIC_API_BASE } from "@/config/public-api";

export type BannerPlacementCategoryId = "banners" | "cta";

export type BannerPlacementMock =
  | "homepage"
  | "popup"
  | "mega-menu"
  | "bottom"
  | "cta";

export interface BannerPlacementCategory {
  id: BannerPlacementCategoryId;
  title: string;
  description: string;
}

export interface BannerPlacement {
  id: string;
  /** Matches Banner.key for lookup on the public site. */
  key: string;
  title: string;
  description: string;
  category: BannerPlacementCategoryId;
  mock: BannerPlacementMock;
  /**
   * Website placement slots are brand-owned system keys.
   * Once a banner exists for this key, it cannot be deleted (min 1 image required).
   */
  required: boolean;
}

export const BANNER_PLACEMENT_CATEGORIES: BannerPlacementCategory[] = [
  {
    id: "banners",
    title: "Banners",
    description: "Hero, popup, menu, and sticky slots for the public site.",
  },
  {
    id: "cta",
    title: "CTA",
    description: "Call-to-action blocks that drive clicks into WhatsApp or pages.",
  },
];

export const BANNER_PLACEMENTS: BannerPlacement[] = [
  {
    id: "homepage",
    key: "homepage",
    title: "Homepage Hero",
    description: "Shown on the homepage at the top section.",
    category: "banners",
    mock: "homepage",
    required: true,
  },
  {
    id: "popup",
    key: "popup",
    title: "Popup Banner",
    description: "Shown as a popup on the website.",
    category: "banners",
    mock: "popup",
    required: true,
  },
  {
    id: "mega-menu",
    key: "mega-menu",
    title: "Mega Menu Banner",
    description: "Shown inside the mega menu.",
    category: "banners",
    mock: "mega-menu",
    required: true,
  },
  {
    id: "bottom",
    key: "bottom",
    title: "Bottom Banner / Sticky",
    description: "Shown at the bottom of the page (sticky).",
    category: "banners",
    mock: "bottom",
    required: true,
  },
  {
    id: "cta-primary",
    key: "cta-primary",
    title: "Primary CTA",
    description: "Full-width call-to-action block for mid-page or landing sections.",
    category: "cta",
    mock: "cta",
    required: true,
  },
  {
    id: "cta-inline",
    key: "cta-inline",
    title: "Inline CTA",
    description: "Compact CTA card for sidebars, article footers, or content embeds.",
    category: "cta",
    mock: "cta",
    required: true,
  },
];

/** Fixed placement keys used by the CMS and public by-key API. */
export const BANNER_PLACEMENT_KEYS = BANNER_PLACEMENTS.map(
  (placement) => placement.key,
);

export function getBannerPlacementByKey(key: string) {
  return BANNER_PLACEMENTS.find((placement) => placement.key === key) ?? null;
}

export function isRequiredBannerPlacementKey(key: string) {
  return getBannerPlacementByKey(key)?.required === true;
}

export function getBannerPlacementsByCategory(
  categoryId: BannerPlacementCategoryId,
) {
  return BANNER_PLACEMENTS.filter(
    (placement) => placement.category === categoryId,
  );
}

/** Copy-ready FE wiring snippet for one placement key. */
export function buildBannerPlacementWiringMarkdown(
  placement: BannerPlacement,
  brandId = "{brandId}",
) {
  const endpoint = `${CMS_PUBLIC_API_BASE}/banners/by-key/${placement.key}?brandId=${brandId}`;

  return `# ${placement.title} (\`${placement.key}\`)

Category: **${placement.category === "cta" ? "CTA" : "Banners"}**
Required website placement — once set up, keep at least 1 image; do not delete this key.

## Endpoint
\`\`\`
GET ${endpoint}
\`\`\`

## Fetch
\`\`\`ts
async function load${toPascalCase(placement.key)}Banner(brandId: string) {
  const res = await fetch(
    \`${CMS_PUBLIC_API_BASE}/banners/by-key/${placement.key}?brandId=\${brandId}\`,
  );

  if (!res.ok) {
    return null; // inactive, missing, or banners feature disabled
  }

  const { data } = await res.json();
  return data as Banner;
}
\`\`\`

## Render rules
- Hide the slot when the response is 404 / null / brand lacks \`banners\`
- When \`images.length > 1\`, render a carousel; otherwise a single image
- Use \`redirectUrl\` as the click target (URL, site path, or WhatsApp)
- Cache key should include \`brandId\` + \`${placement.key}\`

## Notes
${placement.description}
`;
}

function toPascalCase(key: string) {
  return key
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

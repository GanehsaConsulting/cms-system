import {
  BANNER_PLACEMENTS,
  BANNER_PLACEMENT_KEYS,
  isCustomBannerKey,
} from "@/config/banner-placements";
import { getBannerImages } from "@/lib/banners/images";
import type { Banner } from "@/types/banner";
import type {
  BannerPlacementCatalog,
  BannerPlacementCatalogEntry,
  BannerPlacementFillStatus,
} from "@/types/banner-placement";

function resolveFillStatus(banner: Banner | null): BannerPlacementFillStatus {
  if (!banner) {
    return "missing";
  }
  if (!banner.isActive) {
    return "inactive";
  }
  if (getBannerImages(banner).length === 0) {
    return "empty";
  }
  return "ready";
}

function toCatalogEntry(
  input: {
    key: string;
    title: string;
    description: string;
    required: boolean;
    kind: "website" | "custom";
  },
  banner: Banner | null,
): BannerPlacementCatalogEntry {
  const status = resolveFillStatus(banner);
  return {
    key: input.key,
    title: input.title,
    description: input.description,
    required: input.required,
    kind: input.kind,
    status,
    ready: status === "ready",
    endpointPath: `/banners/by-key/${encodeURIComponent(input.key)}`,
  };
}

/**
 * Explicit placement contract for FE wiring:
 * - Website (required) slots always listed, even when missing in CMS
 * - Custom banners listed from CMS rows (discoverable keys)
 */
export function buildBannerPlacementCatalog(
  banners: Banner[],
): BannerPlacementCatalog {
  const byKey = new Map(banners.map((banner) => [banner.key, banner]));

  const website = BANNER_PLACEMENTS.map((placement) =>
    toCatalogEntry(
      {
        key: placement.key,
        title: placement.title,
        description: placement.description,
        required: placement.required,
        kind: "website",
      },
      byKey.get(placement.key) ?? null,
    ),
  );

  const custom = banners
    .filter((banner) => isCustomBannerKey(banner.key))
    .sort((left, right) => left.key.localeCompare(right.key))
    .map((banner) =>
      toCatalogEntry(
        {
          key: banner.key,
          title: banner.name || banner.key,
          description: "Custom banner — wire only if this FE page needs it.",
          required: false,
          kind: "custom",
        },
        banner,
      ),
    );

  const requiredKeys = [...BANNER_PLACEMENT_KEYS];
  const readyRequired = website.filter(
    (entry) => entry.required && entry.ready,
  ).length;

  return {
    requiredKeys,
    website,
    custom,
    summary: {
      requiredTotal: website.filter((entry) => entry.required).length,
      requiredReady: readyRequired,
      customTotal: custom.length,
      customReady: custom.filter((entry) => entry.ready).length,
    },
  };
}

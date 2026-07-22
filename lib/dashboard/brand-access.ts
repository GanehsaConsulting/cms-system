import type { BrandFeatureId } from "@/config/brand";
import {
  DASHBOARD_QUICK_ACTIONS,
  type DashboardQuickAction,
  type DashboardWidgetId,
} from "@/config/dashboard";
import type { Brand } from "@/types/brand";

const QUICK_ACTION_FEATURE: Record<string, BrandFeatureId> = {
  article: "articles",
  price: "prices",
  client: "clients-works",
  banner: "banners",
  activity: "activities",
};

/**
 * Widget → brand features required (any). Empty = always available.
 * Content health / browse stay available for Files & Media (always in nav);
 * their items are filtered separately.
 */
const WIDGET_FEATURES: Record<DashboardWidgetId, BrandFeatureId[]> = {
  greeting: [],
  "quick-actions": ["articles", "prices", "clients-works", "banners", "activities"],
  "content-health": [],
  "article-stats": ["articles"],
  "recent-articles": ["articles"],
  "drafts-attention": ["articles"],
  "recent-activity": ["articles", "prices", "clients-works", "banners", "activities"],
  "articles-focus": ["articles"],
  browse: [],
};

export function brandSupportsFeature(
  brand: Brand | null,
  feature: BrandFeatureId,
): boolean {
  if (!brand) {
    return false;
  }

  return brand.features.includes(feature);
}

export function brandSupportsAnyFeature(
  brand: Brand | null,
  features: BrandFeatureId[],
): boolean {
  if (features.length === 0) {
    return true;
  }

  return features.some((feature) => brandSupportsFeature(brand, feature));
}

export function isDashboardWidgetAvailableForBrand(
  widgetId: DashboardWidgetId,
  brand: Brand | null,
): boolean {
  return brandSupportsAnyFeature(brand, WIDGET_FEATURES[widgetId]);
}

export function filterDashboardQuickActionsForBrand(
  brand: Brand | null,
  actions: DashboardQuickAction[] = DASHBOARD_QUICK_ACTIONS,
): DashboardQuickAction[] {
  return actions.filter((action) => {
    const feature = QUICK_ACTION_FEATURE[action.id];
    if (!feature) {
      return true;
    }

    return brandSupportsFeature(brand, feature);
  });
}

export function brandSupportsHrefFeature(
  brand: Brand | null,
  href: string,
  fallbackAlways = false,
): boolean {
  const featureByHref: Record<string, BrandFeatureId> = {
    "/articles": "articles",
    "/prices": "prices",
    "/clients": "clients-works",
    "/banners": "banners",
    "/activities": "activities",
  };

  const match = Object.entries(featureByHref).find(
    ([path]) => href === path || href.startsWith(`${path}/`),
  );

  if (!match) {
    return fallbackAlways;
  }

  return brandSupportsFeature(brand, match[1]);
}

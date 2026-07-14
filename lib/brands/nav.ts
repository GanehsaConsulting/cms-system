import { getNavFeatureForHref } from "@/config/brand-nav";
import type { NavLink } from "@/config/nav";
import type { Brand } from "@/types/brand";

export function filterNavLinksByBrand(
  links: NavLink[],
  brand: Brand | null,
): NavLink[] {
  if (!brand) {
    return links;
  }

  return links.filter((link) => {
    const feature = getNavFeatureForHref(link.href);
    if (!feature) {
      return true;
    }

    return brand.features.includes(feature);
  });
}

export function resolveActiveBrand(
  brands: Brand[],
  storedId: string | null,
): Brand | null {
  if (brands.length === 0) {
    return null;
  }

  if (storedId) {
    const stored = brands.find(
      (brand) => brand.id === storedId && brand.status === "active",
    );
    if (stored) {
      return stored;
    }
  }

  return brands.find((brand) => brand.status === "active") ?? brands[0] ?? null;
}

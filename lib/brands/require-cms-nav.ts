import { notFound } from "next/navigation";
import { getNavFeatureForHref } from "@/config/brand-nav";
import { resolveCmsActiveBrand } from "@/lib/brands/active-brand";
import type { Brand } from "@/types/brand";

/** Ensures the active brand exists and supports the route's feature module. */
export async function requireCmsNavHref(href: string): Promise<Brand> {
  const brand = await resolveCmsActiveBrand();

  if (!brand) {
    notFound();
  }

  const feature = getNavFeatureForHref(href);

  if (feature && !brand.features.includes(feature)) {
    notFound();
  }

  return brand;
}

import { cache } from "react";
import { cookies } from "next/headers";
import { ACTIVE_BRAND_COOKIE_KEY } from "@/config/brand-context";
import { filterBrandsByUserAccess } from "@/lib/brands/access";
import { resolveActiveBrand } from "@/lib/brands/nav";
import { getBrands } from "@/lib/db/brands";
import { getCurrentCmsUser } from "@/lib/users/current";
import type { Brand } from "@/types/brand";

const resolveAccessibleActiveBrand = cache(async (): Promise<Brand | null> => {
  const [brands, user] = await Promise.all([getBrands(), getCurrentCmsUser()]);
  const accessibleBrands = filterBrandsByUserAccess(brands, user);

  if (accessibleBrands.length === 0) {
    return null;
  }

  const cookieStore = await cookies();
  const storedId = cookieStore.get(ACTIVE_BRAND_COOKIE_KEY)?.value ?? null;

  return resolveActiveBrand(accessibleBrands, storedId);
});

/** Resolves the active brand record for CMS reads and mutations. */
export async function resolveCmsActiveBrand(): Promise<Brand | null> {
  return resolveAccessibleActiveBrand();
}

/** Resolves the active brand for CMS reads and mutations. */
export async function resolveCmsActiveBrandId(): Promise<string | null> {
  const brand = await resolveAccessibleActiveBrand();
  return brand?.id ?? null;
}

export async function requireCmsActiveBrandId(): Promise<
  { ok: true; brandId: string } | { ok: false; error: string }
> {
  const brandId = await resolveCmsActiveBrandId();

  if (!brandId) {
    return { ok: false, error: "No brand selected." };
  }

  return { ok: true, brandId };
}

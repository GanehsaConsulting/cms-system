import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";

/**
 * Brands the signed-in user may open in the brand switcher.
 * Super admins see every brand; others only see `brandAccess`.
 */
export function filterBrandsByUserAccess(
  brands: Brand[],
  user: Pick<User, "role" | "brandAccess"> | null,
): Brand[] {
  if (!user) {
    return [];
  }

  if (user.role === "super-admin") {
    return brands;
  }

  const allowed = new Set(user.brandAccess);
  return brands.filter((brand) => allowed.has(brand.id));
}

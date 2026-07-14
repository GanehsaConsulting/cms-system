import type {
  UserListSort,
  UserRoleFilter,
  UserStatusFilter,
} from "@/config/user-list";
import type { Brand } from "@/types/brand";
import type { User } from "@/types/user";

export function getUserSearchText(user: User, brands: Brand[]): string {
  const brandNames = getUserBrandAccessLabels(user, brands);

  return [
    user.id,
    user.name,
    user.email,
    user.position,
    user.role,
    ...brandNames,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterUsers(
  users: User[],
  brands: Brand[],
  status: UserStatusFilter,
  role: UserRoleFilter,
  query: string,
): User[] {
  const normalizedQuery = query.trim().toLowerCase();

  return users.filter((user) => {
    if (status !== "all" && user.status !== status) {
      return false;
    }

    if (role !== "all" && user.role !== role) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return getUserSearchText(user, brands).includes(normalizedQuery);
  });
}

export function sortUsers(users: User[], sort: UserListSort): User[] {
  const next = [...users];

  next.sort((left, right) => {
    switch (sort) {
      case "name-asc":
        return left.name.localeCompare(right.name);
      case "name-desc":
        return right.name.localeCompare(left.name);
      case "updated-asc":
        return (
          new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()
        );
      default:
        return (
          new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
        );
    }
  });

  return next;
}

export function getUserBrandAccessLabels(
  user: User,
  brands: Brand[],
): string[] {
  const brandMap = new Map(brands.map((brand) => [brand.id, brand.name]));

  return user.brandAccess
    .map((brandId) => brandMap.get(brandId))
    .filter((name): name is string => Boolean(name));
}

export function formatUserBrandAccessSummary(
  user: User,
  brands: Brand[],
): string {
  const labels = getUserBrandAccessLabels(user, brands);

  if (labels.length === 0) {
    return "No brands";
  }

  if (labels.length === 1) {
    return labels[0];
  }

  return `${labels.length} brands`;
}

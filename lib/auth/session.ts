import { headers } from "next/headers";
import { isUserRoleId } from "@/config/user";
import { auth } from "@/lib/auth/auth";
import type { User } from "@/types/user";

function parseBrandAccess(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.filter((item): item is string => typeof item === "string");
  }

  if (typeof raw !== "string" || !raw.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

/** Map Better Auth session user → CMS User shape. */
export function toCmsUser(sessionUser: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  position?: string | null;
  role?: string | null;
  status?: string | null;
  brandAccess?: string | null;
}): User {
  const role =
    typeof sessionUser.role === "string" && isUserRoleId(sessionUser.role)
      ? sessionUser.role
      : "viewer";
  const status = sessionUser.status === "inactive" ? "inactive" : "active";

  return {
    id: sessionUser.id,
    name: sessionUser.name,
    email: sessionUser.email,
    position: sessionUser.position ?? "",
    role,
    status,
    brandAccess: parseBrandAccess(sessionUser.brandAccess),
    avatarUrl: sessionUser.image ?? "",
    createdAt:
      sessionUser.createdAt instanceof Date
        ? sessionUser.createdAt.toISOString()
        : String(sessionUser.createdAt),
    updatedAt:
      sessionUser.updatedAt instanceof Date
        ? sessionUser.updatedAt.toISOString()
        : String(sessionUser.updatedAt),
  };
}

export async function getServerSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

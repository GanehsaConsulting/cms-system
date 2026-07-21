import { cache } from "react";
import { eq } from "drizzle-orm";
import { getServerSession, toCmsUser } from "@/lib/auth/session";
import { db } from "@/lib/db/client";
import { user as authUserTable } from "@/lib/db/schema";
import { persistResolvedUserAvatar } from "@/lib/users/avatar";
import type { User } from "@/types/user";

/**
 * Signed-in CMS user.
 * Authorization fields (role, status, brandAccess) are read from
 * Postgres — Better Auth session/cookie cache often omits additionalFields,
 * which would incorrectly demote Super Admin to Viewer.
 *
 * Wrapped in React.cache() so layout + page share one lookup per request.
 */
export const getCurrentCmsUser = cache(async (): Promise<User | null> => {
  const session = await getServerSession();
  const sessionUser = session?.user;
  if (!sessionUser?.id) {
    return null;
  }

  const [row] = await db
    .select({
      id: authUserTable.id,
      name: authUserTable.name,
      email: authUserTable.email,
      image: authUserTable.image,
      createdAt: authUserTable.createdAt,
      updatedAt: authUserTable.updatedAt,
      position: authUserTable.position,
      role: authUserTable.role,
      status: authUserTable.status,
      brandAccess: authUserTable.brandAccess,
    })
    .from(authUserTable)
    .where(eq(authUserTable.id, sessionUser.id))
    .limit(1);

  if (!row) {
    return toCmsUser(sessionUser);
  }

  const image = await persistResolvedUserAvatar(row.id, row.image);

  return toCmsUser({
    ...row,
    image,
  });
});

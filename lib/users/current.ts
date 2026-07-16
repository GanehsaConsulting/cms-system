import { getServerSession, toCmsUser } from "@/lib/auth/session";
import type { User } from "@/types/user";

/** Signed-in CMS user from the server session (null when anonymous). */
export async function getCurrentCmsUser(): Promise<User | null> {
  const session = await getServerSession();
  if (!session?.user) {
    return null;
  }

  return toCmsUser(session.user);
}

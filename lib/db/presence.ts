import { eq, max, sql } from "drizzle-orm";
import { PRESENCE_ONLINE_THRESHOLD_MS } from "@/config/presence";
import { getUserRoleLabel, isUserRoleId } from "@/config/user";
import { db } from "@/lib/db/client";
import { session, user } from "@/lib/db/schema";
import type { CmsPresenceSnapshot, CmsPresenceUser } from "@/types/presence";

function toAvatarUrl(image: string | null): string {
  const trimmed = image?.trim() ?? "";
  // Skip empty / in-memory data URLs (too large for list payloads).
  if (!trimmed || trimmed.startsWith("data:")) {
    return "";
  }
  return trimmed;
}

function toRoleLabel(role: string): string {
  return isUserRoleId(role) ? getUserRoleLabel(role) : role;
}

/**
 * Active staff + last session activity.
 * Online = non-expired session touched within `PRESENCE_ONLINE_THRESHOLD_MS`.
 *
 * Two queries (not Promise.all of three) so a small connection pool is not
 * saturated by a single presence tick.
 */
export async function getCmsPresence(
  now: Date = new Date(),
): Promise<CmsPresenceSnapshot> {
  const onlineSince = new Date(now.getTime() - PRESENCE_ONLINE_THRESHOLD_MS);

  const userRows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    })
    .from(user)
    .where(eq(user.status, "active"));

  const sessionRows = await db
    .select({
      userId: session.userId,
      lastSeenAt: max(session.updatedAt),
      online: sql<boolean>`bool_or(${session.expiresAt} > ${now} and ${session.updatedAt} > ${onlineSince})`,
    })
    .from(session)
    .groupBy(session.userId);

  const sessionByUser = new Map(
    sessionRows.map((row) => [
      row.userId,
      {
        lastSeenAt: row.lastSeenAt ? row.lastSeenAt.toISOString() : null,
        online: Boolean(row.online),
      },
    ]),
  );

  const users: CmsPresenceUser[] = userRows
    .map((row) => {
      const presence = sessionByUser.get(row.id);
      return {
        id: row.id,
        name: row.name,
        email: row.email,
        roleLabel: toRoleLabel(row.role),
        avatarUrl: toAvatarUrl(row.image),
        online: presence?.online ?? false,
        lastSeenAt: presence?.lastSeenAt ?? null,
      };
    })
    .sort((left, right) => {
      if (left.online !== right.online) {
        return left.online ? -1 : 1;
      }

      const leftSeen = left.lastSeenAt
        ? new Date(left.lastSeenAt).getTime()
        : 0;
      const rightSeen = right.lastSeenAt
        ? new Date(right.lastSeenAt).getTime()
        : 0;
      if (leftSeen !== rightSeen) {
        return rightSeen - leftSeen;
      }

      return left.name.localeCompare(right.name, "en");
    });

  return {
    onlineCount: users.filter((entry) => entry.online).length,
    users,
    fetchedAt: now.toISOString(),
  };
}

/** Keep the current session marked active while the CMS is open. */
export async function touchSessionActivity(sessionId: string): Promise<void> {
  await db
    .update(session)
    .set({ updatedAt: new Date() })
    .where(eq(session.id, sessionId));
}

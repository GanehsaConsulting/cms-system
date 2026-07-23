import { eq } from "drizzle-orm";
import {
  PRESENCE_LOGIN_HISTORY_LIMIT,
  PRESENCE_ONLINE_THRESHOLD_MS,
} from "@/config/presence";
import { getUserRoleLabel, isUserRoleId } from "@/config/user";
import { db } from "@/lib/db/client";
import { session, user } from "@/lib/db/schema";
import type {
  CmsLoginHistoryEntry,
  CmsPresenceSnapshot,
  CmsPresenceUser,
} from "@/types/presence";

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

function toIso(value: Date | null | undefined): string | null {
  if (!value) {
    return null;
  }
  return value.toISOString();
}

/**
 * Active staff + last session activity.
 * Online = non-expired session touched within `PRESENCE_ONLINE_THRESHOLD_MS`.
 *
 * Aggregation is done in JS — embedding `Date` in drizzle `sql` templates
 * breaks postgres.js parameter binding and made presence always return empty.
 */
export async function getCmsPresence(
  now: Date = new Date(),
): Promise<CmsPresenceSnapshot> {
  const onlineSinceMs = now.getTime() - PRESENCE_ONLINE_THRESHOLD_MS;

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
      id: session.id,
      userId: session.userId,
      updatedAt: session.updatedAt,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      ipAddress: session.ipAddress,
    })
    .from(session);

  const sessionByUser = new Map<
    string,
    { lastSeenAt: string | null; online: boolean }
  >();

  for (const row of sessionRows) {
    const updatedMs = row.updatedAt.getTime();
    const expiresMs = row.expiresAt.getTime();
    const online =
      expiresMs > now.getTime() && updatedMs > onlineSinceMs;
    const lastSeenAt = toIso(row.updatedAt);
    const current = sessionByUser.get(row.userId);

    if (!current) {
      sessionByUser.set(row.userId, { lastSeenAt, online });
      continue;
    }

    const currentSeen = current.lastSeenAt
      ? new Date(current.lastSeenAt).getTime()
      : 0;
    sessionByUser.set(row.userId, {
      lastSeenAt:
        updatedMs >= currentSeen ? lastSeenAt : current.lastSeenAt,
      online: current.online || online,
    });
  }

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

  const userById = new Map(userRows.map((row) => [row.id, row]));

  const loginHistory: CmsLoginHistoryEntry[] = [...sessionRows]
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime())
    .slice(0, PRESENCE_LOGIN_HISTORY_LIMIT)
    .map((row) => {
      const owner = userById.get(row.userId);
      if (!owner) {
        return null;
      }
      return {
        sessionId: row.id,
        userId: owner.id,
        name: owner.name,
        email: owner.email,
        avatarUrl: toAvatarUrl(owner.image),
        roleLabel: toRoleLabel(owner.role),
        loggedInAt: row.createdAt.toISOString(),
        ipAddress: row.ipAddress,
      };
    })
    .filter((entry): entry is CmsLoginHistoryEntry => entry !== null);

  return {
    onlineCount: users.filter((entry) => entry.online).length,
    users,
    loginHistory,
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

import { eq } from "drizzle-orm";
import { resolveImageAsset } from "@/lib/cloudinary/assets";
import { db } from "@/lib/db/client";
import { user as authUserTable } from "@/lib/db/schema";

const AVATAR_FOLDER = "cms-system/avatars";

/**
 * Ensure avatar is a short https URL (not a base64 data URL).
 * Inflated `user.image` values break Better Auth cookieCache and slow every request.
 */
export async function resolveUserAvatarUrl(
  avatarUrl: string | null | undefined,
): Promise<string> {
  const trimmed = avatarUrl?.trim() ?? "";
  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  if (!trimmed.startsWith("data:")) {
    return trimmed;
  }

  return resolveImageAsset(trimmed, AVATAR_FOLDER);
}

/** Upload data-URL avatars once and rewrite the user row. */
export async function persistResolvedUserAvatar(
  userId: string,
  avatarUrl: string | null | undefined,
): Promise<string> {
  const trimmed = avatarUrl?.trim() ?? "";
  if (!trimmed.startsWith("data:")) {
    return trimmed;
  }

  const url = await resolveUserAvatarUrl(trimmed);
  await db
    .update(authUserTable)
    .set({
      image: url || null,
      updatedAt: new Date(),
    })
    .where(eq(authUserTable.id, userId));

  return url;
}

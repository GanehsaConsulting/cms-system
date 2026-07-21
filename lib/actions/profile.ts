"use server";

import { resolveUserAvatarUrl } from "@/lib/users/avatar";
import { getCurrentCmsUser } from "@/lib/users/current";

/**
 * Convert a profile data-URL avatar to Cloudinary before Better Auth stores it
 * on the session user (keeps cookie cache small).
 */
export async function resolveProfileAvatarAction(avatarUrl: string) {
  const user = await getCurrentCmsUser();
  if (!user) {
    return { success: false as const, error: "Unauthorized" };
  }

  const trimmed = avatarUrl.trim();
  if (!trimmed) {
    return { success: true as const, url: "" };
  }

  try {
    const url = await resolveUserAvatarUrl(trimmed);
    return { success: true as const, url };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to upload profile photo",
    };
  }
}

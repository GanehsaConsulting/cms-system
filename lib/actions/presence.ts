"use server";

import { getServerSession } from "@/lib/auth/session";
import { getCmsPresence, touchSessionActivity } from "@/lib/db/presence";
import type { CmsPresenceSnapshot } from "@/types/presence";

export async function getCmsPresenceAction(): Promise<
  | { success: true; data: CmsPresenceSnapshot }
  | { success: false; error: string }
> {
  const authSession = await getServerSession();
  if (!authSession?.user?.id || !authSession.session?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await touchSessionActivity(authSession.session.id);
    const data = await getCmsPresence();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to load presence",
    };
  }
}

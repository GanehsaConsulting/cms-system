"use server";

import { activityEventToNotification } from "@/lib/activity/present";
import {
  listBrandActivityEvents,
  listEntityActivityEvents,
  markActivityEventRead,
  markActivityEventUnread,
  markAllBrandActivityEventsRead,
} from "@/lib/db/activity";
import { requireCmsActiveBrandId } from "@/lib/brands/active-brand";
import { requireCmsContentAccess } from "@/lib/users/require-content-access";
import type { ActivityEntityType, ActivityEvent } from "@/types/activity";
import type { CmsNotification } from "@/types/notification";

export async function getBrandNotificationsAction(): Promise<{
  success: boolean;
  notifications: CmsNotification[];
  error?: string;
}> {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false, notifications: [], error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false, notifications: [], error: brand.error };
  }

  try {
    const events = await listBrandActivityEvents(
      brand.brandId,
      access.user.id,
    );
    return {
      success: true,
      notifications: events.map(activityEventToNotification),
    };
  } catch (error) {
    return {
      success: false,
      notifications: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to load notifications",
    };
  }
}

export async function getEntityActivityAction(
  entityType: ActivityEntityType,
  entityId: string,
): Promise<{
  success: boolean;
  events: ActivityEvent[];
  error?: string;
}> {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false, events: [], error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false, events: [], error: brand.error };
  }

  try {
    const events = await listEntityActivityEvents(
      brand.brandId,
      entityType,
      entityId,
      access.user.id,
    );
    return { success: true, events };
  } catch (error) {
    return {
      success: false,
      events: [],
      error:
        error instanceof Error ? error.message : "Failed to load activity log",
    };
  }
}

export async function markNotificationReadAction(activityId: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    await markActivityEventRead(access.user.id, activityId);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error ? error.message : "Failed to mark notification",
    };
  }
}

export async function markNotificationUnreadAction(activityId: string) {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  try {
    await markActivityEventUnread(access.user.id, activityId);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark notification unread",
    };
  }
}

export async function markAllNotificationsReadAction() {
  const access = await requireCmsContentAccess();
  if (!access.ok) {
    return { success: false as const, error: access.error };
  }

  const brand = await requireCmsActiveBrandId();
  if (!brand.ok) {
    return { success: false as const, error: brand.error };
  }

  try {
    await markAllBrandActivityEventsRead(brand.brandId, access.user.id);
    return { success: true as const };
  } catch (error) {
    return {
      success: false as const,
      error:
        error instanceof Error
          ? error.message
          : "Failed to mark all notifications read",
    };
  }
}

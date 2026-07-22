import {
  buildActivitySummary,
  getEntityActivityHref,
} from "@/lib/activity/present";
import { createActivityEvent } from "@/lib/db/activity";
import type { ActivityAction, ActivityEntityType } from "@/types/activity";

export interface RecordActivityInput {
  brandId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  actor: { id: string; name: string };
  entityTitle: string;
  href?: string;
}

/** Persist CMS activity without blocking the primary mutation. */
export async function recordActivityEvent(
  input: RecordActivityInput,
): Promise<void> {
  try {
    const summary = buildActivitySummary({
      actorName: input.actor.name,
      action: input.action,
      entityType: input.entityType,
      entityTitle: input.entityTitle,
    });

    await createActivityEvent({
      brandId: input.brandId,
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actorId: input.actor.id,
      actorName: input.actor.name,
      entityTitle: input.entityTitle,
      summary,
      href: input.href ?? getEntityActivityHref(input.entityType, input.entityId),
    });
  } catch {
    // Activity logging must not block content saves.
  }
}

export function resolveArticleActivityAction(input: {
  previousStatus?: string;
  nextStatus: string;
  isCreate: boolean;
}): ActivityAction {
  const isPublished = input.nextStatus === "published";
  const wasPublished = input.previousStatus === "published";

  if (isPublished && (!input.isCreate ? !wasPublished : true)) {
    return "published";
  }

  return input.isCreate ? "created" : "updated";
}

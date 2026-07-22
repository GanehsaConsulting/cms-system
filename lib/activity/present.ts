import type { SidebarAppIconTone } from "@/config/sidebar";
import { formatActivityRelativeTime } from "@/lib/activity/format-relative-time";
import type {
  ActivityAction,
  ActivityEntityType,
  ActivityEvent,
} from "@/types/activity";
import type { CmsNotification, NotificationKind } from "@/types/notification";

const ACTION_VERB: Record<ActivityAction, string> = {
  created: "created",
  updated: "updated",
  deleted: "deleted",
  published: "published",
};

const ENTITY_SINGULAR: Record<ActivityEntityType, string> = {
  article: "article",
  price: "price plan",
  client: "client",
  banner: "banner",
  portfolio: "portfolio item",
  media: "media item",
  content_activity: "activity item",
};

const ENTITY_MODULE_LABEL: Record<ActivityEntityType, string> = {
  article: "Articles",
  price: "Prices",
  client: "Clients",
  banner: "Banners",
  portfolio: "Portfolio",
  media: "Media",
  content_activity: "Activities",
};

const ENTITY_TONE: Record<ActivityEntityType, SidebarAppIconTone> = {
  article: "articles",
  price: "prices",
  client: "clients",
  banner: "banners",
  portfolio: "clients",
  media: "media",
  content_activity: "activities",
};

export function entityTypeToNotificationKind(
  entityType: ActivityEntityType,
): NotificationKind {
  if (
    entityType === "article" ||
    entityType === "price" ||
    entityType === "client"
  ) {
    return entityType;
  }

  if (entityType === "banner") {
    return "banner";
  }

  if (entityType === "portfolio") {
    return "portfolio";
  }

  if (entityType === "content_activity") {
    return "activity";
  }

  return "media";
}

export function buildActivitySummary(input: {
  actorName: string;
  action: ActivityAction;
  entityType: ActivityEntityType;
  entityTitle: string;
}): string {
  const entity = ENTITY_SINGULAR[input.entityType];
  const verb = ACTION_VERB[input.action];
  return `${input.actorName} ${verb} ${entity} "${input.entityTitle}"`;
}

export function activityEventToNotification(
  event: ActivityEvent,
): CmsNotification {
  return {
    id: event.id,
    kind: entityTypeToNotificationKind(event.entityType),
    title: ENTITY_MODULE_LABEL[event.entityType],
    body: event.summary,
    timeLabel: formatActivityRelativeTime(event.createdAt),
    href: event.href ?? undefined,
    tone: ENTITY_TONE[event.entityType],
    read: event.read,
  };
}

export function getEntityActivityHref(
  entityType: ActivityEntityType,
  entityId: string,
): string {
  switch (entityType) {
    case "article":
      return `/articles/${entityId}/edit`;
    case "price":
      return `/prices/${entityId}/edit`;
    case "client":
      return `/clients/${entityId}/edit`;
    case "banner":
      return "/banners";
    case "portfolio":
      return `/clients/portfolio/${entityId}/edit`;
    case "media":
      return "/media";
    case "content_activity":
      return `/activities/${entityId}/edit`;
  }
}

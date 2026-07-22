export type ActivityEntityType =
  | "article"
  | "price"
  | "client"
  | "banner"
  | "portfolio"
  | "media"
  | "content_activity";

export type ActivityAction = "created" | "updated" | "deleted" | "published";

export interface ActivityEvent {
  id: string;
  brandId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  actorId: string | null;
  actorName: string;
  actorImageUrl: string | null;
  entityTitle: string;
  summary: string;
  href: string | null;
  createdAt: string;
  read: boolean;
}

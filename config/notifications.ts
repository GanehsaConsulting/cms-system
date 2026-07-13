import type { CmsNotification } from "@/types/notification";

/** Preview stack size — remaining count shown in “more” pill. */
export const NOTIFICATION_CENTER_VISIBLE_COUNT = 5;

/** Mock CMS activity — replace with real feed later. */
export const MOCK_NOTIFICATIONS: CmsNotification[] = [
  {
    id: "n1",
    kind: "article",
    title: "Articles",
    body: "“Company Profile Refresh” was published.",
    timeLabel: "1m ago",
    href: "/articles",
    tone: "articles",
  },
  {
    id: "n2",
    kind: "price",
    title: "Prices",
    body: "Virtual Office — Starter plan price updated.",
    timeLabel: "12m ago",
    href: "/prices",
    tone: "prices",
  },
  {
    id: "n3",
    kind: "client",
    title: "Clients",
    body: "New testimonial added for Acme Studio.",
    timeLabel: "1h ago",
    href: "/clients",
    tone: "clients",
  },
  {
    id: "n4",
    kind: "system",
    title: "System",
    body: "Wallpaper and glass settings synced.",
    timeLabel: "Yesterday",
    tone: "settings",
  },
  {
    id: "n5",
    kind: "article",
    title: "Articles",
    body: "Draft “Q3 Highlights” is ready for review.",
    timeLabel: "Yesterday",
    href: "/articles",
    tone: "articles",
  },
  {
    id: "n6",
    kind: "price",
    title: "Prices",
    body: "Category “Virtual Office” was created.",
    timeLabel: "2d ago",
    href: "/prices",
    tone: "prices",
  },
];

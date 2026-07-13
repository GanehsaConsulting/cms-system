import type { SidebarAppIconTone } from "@/config/sidebar";

export type NotificationKind = "article" | "price" | "client" | "system";

export interface CmsNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  /** Relative time label, e.g. "2m ago". */
  timeLabel: string;
  href?: string;
  tone: SidebarAppIconTone;
}

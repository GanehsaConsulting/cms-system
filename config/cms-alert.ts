import type { Icon } from "@/lib/icons";
import {
  CheckIcon,
  InfoIcon,
  WarningIcon,
} from "@/lib/icons";
import type { SidebarAppIconTone } from "@/config/sidebar";
import { NOTIFICATION_CARD_SURFACE } from "@/config/notification-center";

export type CmsAlertVariant = "error" | "success" | "info" | "warning";

export const CMS_ALERT_SURFACE = [
  NOTIFICATION_CARD_SURFACE,
  "border-0 shadow-none",
].join(" ");

export const CMS_ALERT_VARIANT_CONFIG: Record<
  CmsAlertVariant,
  {
    tone: SidebarAppIconTone;
    icon: Icon;
    title: string;
    descriptionClassName: string;
  }
> = {
  error: {
    tone: "articles",
    icon: WarningIcon,
    title: "Action failed",
    descriptionClassName: "text-destructive",
  },
  success: {
    tone: "prices",
    icon: CheckIcon,
    title: "Success",
    descriptionClassName: "text-foreground",
  },
  info: {
    tone: "overview",
    icon: InfoIcon,
    title: "Notice",
    descriptionClassName: "text-foreground",
  },
  warning: {
    tone: "notifications",
    icon: WarningIcon,
    title: "Warning",
    descriptionClassName: "text-foreground",
  },
};

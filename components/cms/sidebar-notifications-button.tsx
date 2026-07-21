"use client";

import { useNotificationCenter } from "@/components/shared/notification-center-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarCountBadge } from "@/components/shared/sidebar-count-badge";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { notificationsNavItem } from "@/config/nav";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";

export function SidebarNotificationsButton() {
  const { open, openNotificationCenter, unreadCount } = useNotificationCenter();

  return (
    <SidebarMenuButton
      type="button"
      tooltip={
        unreadCount > 0
          ? `${notificationsNavItem.title} (${unreadCount} new)`
          : notificationsNavItem.title
      }
      isActive={open}
      className={SEPARATED_MENU_ITEM}
      onClick={openNotificationCenter}
    >
      <span className="relative shrink-0">
        <SidebarAppIcon
          icon={notificationsNavItem.icon}
          tone={notificationsNavItem.tone}
        />
        <SidebarCountBadge
          count={unreadCount}
          className="absolute -top-1 -right-1"
        />
      </span>
      <span>{notificationsNavItem.title}</span>
    </SidebarMenuButton>
  );
}

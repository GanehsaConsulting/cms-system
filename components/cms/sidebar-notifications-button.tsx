"use client";

import { useNotificationCenter } from "@/components/shared/notification-center-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { notificationsNavItem } from "@/config/nav";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";

export function SidebarNotificationsButton() {
  const { open, openNotificationCenter } = useNotificationCenter();

  return (
    <SidebarMenuButton
      type="button"
      tooltip={notificationsNavItem.title}
      isActive={open}
      className={SEPARATED_MENU_ITEM}
      onClick={openNotificationCenter}
    >
      <SidebarAppIcon
        icon={notificationsNavItem.icon}
        tone={notificationsNavItem.tone}
      />
      <span>{notificationsNavItem.title}</span>
    </SidebarMenuButton>
  );
}

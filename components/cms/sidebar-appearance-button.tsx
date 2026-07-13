"use client";

import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { appearanceNavItem } from "@/config/nav";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";

export function SidebarAppearanceButton() {
  const { open, openAppearance } = useAppearanceDrawer();

  return (
    <SidebarMenuButton
      type="button"
      tooltip={appearanceNavItem.title}
      isActive={open}
      className={SEPARATED_MENU_ITEM}
      onClick={openAppearance}
    >
      <SidebarAppIcon
        icon={appearanceNavItem.icon}
        gradient={appearanceNavItem.gradient}
        isActive={open}
      />
      <span>{appearanceNavItem.title}</span>
    </SidebarMenuButton>
  );
}

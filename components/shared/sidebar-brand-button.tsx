"use client";

import { Building2Icon } from "@/lib/icons";
import Link from "next/link";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CMS_NAME, CMS_TAGLINE } from "@/config/nav";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarBrandButtonProps {
  className?: string;
}

export function SidebarBrandButton({ className }: SidebarBrandButtonProps) {
  return (
    <SidebarMenuButton
      size="lg"
      className={cn(
        SEPARATED_MENU_ITEM,
        "h-auto! py-1.5!",
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        className,
      )}
      render={<Link href="/" />}
      tooltip={CMS_NAME}
    >
      <SidebarAppIcon icon={Building2Icon} tone="brand" size="dock" />
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold">{CMS_NAME}</span>
        <span className="truncate text-muted-foreground text-xs">
          {CMS_TAGLINE}
        </span>
      </div>
    </SidebarMenuButton>
  );
}

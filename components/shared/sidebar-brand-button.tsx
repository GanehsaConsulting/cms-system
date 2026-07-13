"use client";

import { Building2Icon } from "@/lib/icons";
import Link from "next/link";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CMS_NAME, CMS_TAGLINE } from "@/config/nav";
import {
  SEPARATED_MENU_ITEM,
  SIDEBAR_APP_ICON_GLYPH,
  SIDEBAR_APP_ICON_GRADIENTS,
  SIDEBAR_APP_ICON_SHELL,
} from "@/config/sidebar";
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
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        className,
      )}
      render={<Link href="/" />}
      tooltip={CMS_NAME}
    >
      <span
        className={cn(
          SIDEBAR_APP_ICON_SHELL,
          "bg-linear-to-b",
          SIDEBAR_APP_ICON_GRADIENTS.brand,
        )}
      >
        <Building2Icon className={SIDEBAR_APP_ICON_GLYPH} />
      </span>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold">{CMS_NAME}</span>
        <span className="truncate text-muted-foreground text-xs">
          {CMS_TAGLINE}
        </span>
      </div>
    </SidebarMenuButton>
  );
}

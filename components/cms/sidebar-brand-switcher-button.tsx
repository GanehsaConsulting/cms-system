"use client";

import Image from "next/image";
import { useBrand } from "@/components/shared/brand-provider";
import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CMS_NAME } from "@/config/nav";
import { RADIUS_DEEP } from "@/config/shape";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import { Building2Icon, CaretDownIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SidebarBrandSwitcherButtonProps {
  className?: string;
}

export function SidebarBrandSwitcherButton({
  className,
}: SidebarBrandSwitcherButtonProps) {
  const { activeBrand, openSwitcher } = useBrand();
  const displayName = activeBrand?.name ?? CMS_NAME;

  return (
    <SidebarMenuButton
      type="button"
      size="lg"
      onClick={openSwitcher}
      tooltip={`Switch brand · ${displayName}`}
      className={cn(
        SEPARATED_MENU_ITEM,
        "h-auto! py-1.5!",
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        className,
      )}
    >
      {activeBrand?.logo ? (
        <span
          className={cn(
            RADIUS_DEEP,
            "relative flex size-9 shrink-0 items-center justify-center overflow-hidden bg-muted",
          )}
        >
          <Image
            src={activeBrand.logo}
            alt=""
            fill
            unoptimized
            className="object-contain p-1"
          />
        </span>
      ) : (
        <SidebarAppIcon icon={Building2Icon} tone="brand" size="dock" />
      )}

      <span className="inline-flex min-w-0 flex-1 items-center gap-1 group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold text-sm leading-none">
          {displayName}
        </span>
        <CaretDownIcon
          size={5}
          className="shrink-0 text-muted-foreground opacity-70"
        />
      </span>
    </SidebarMenuButton>
  );
}

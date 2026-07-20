"use client";

import { BrandAppLogo } from "@/components/shared/brand-app-logo";
import { useBrand } from "@/components/shared/brand-provider";
import { SystemAppLogo } from "@/components/shared/system-app-logo";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { CMS_NAME } from "@/config/nav";
import { SEPARATED_MENU_ITEM } from "@/config/sidebar";
import { CaretDownIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SidebarBrandSwitcherButtonProps {
  className?: string;
}

export function SidebarBrandSwitcherButton({
  className,
}: SidebarBrandSwitcherButtonProps) {
  const { activeBrand, openSwitcher, isSwitchingBrand } = useBrand();
  const displayName = activeBrand?.name ?? CMS_NAME;

  return (
    <SidebarMenuButton
      type="button"
      size="lg"
      onClick={openSwitcher}
      disabled={isSwitchingBrand}
      aria-busy={isSwitchingBrand}
      tooltip={
        isSwitchingBrand
          ? `Updating ${displayName}…`
          : `Switch brand · ${displayName}`
      }
      className={cn(
        SEPARATED_MENU_ITEM,
        "h-auto! py-1.5!",
        "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:rounded-[0.7rem]! group-data-[collapsible=icon]:bg-transparent! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:hover:bg-transparent!",
        isSwitchingBrand && "opacity-80",
        className,
      )}
    >
      {activeBrand?.logo ? (
        <BrandAppLogo src={activeBrand.logo} size="dock" />
      ) : (
        <SystemAppLogo size="dock" sidebarShell />
      )}

      <span className="inline-flex min-w-0 flex-1 items-center justify-between gap-2 group-data-[collapsible=icon]:hidden">
        <span className="truncate font-semibold text-sm leading-none">
          {displayName}
        </span>
        {isSwitchingBrand ? (
          <span
            className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground"
            aria-hidden
          />
        ) : (
          <CaretDownIcon
            size={5}
            className="shrink-0 text-muted-foreground opacity-70"
          />
        )}
      </span>
    </SidebarMenuButton>
  );
}

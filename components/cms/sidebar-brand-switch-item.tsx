"use client";

import { BrandStatusBadge } from "@/components/cms/settings/brands/brand-status-badge";
import {
  BrandAppLogo,
} from "@/components/shared/brand-app-logo";
import { BrandAppMarkFallback } from "@/components/shared/brand-app-mark-fallback";
import { RADIUS_DEEP } from "@/config/shape";
import { CheckIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types/brand";

interface SidebarBrandSwitchItemProps {
  brand: Brand;
  isActive: boolean;
  onSelect: (id: string) => void;
}

export function SidebarBrandSwitchItem({
  brand,
  isActive,
  onSelect,
}: SidebarBrandSwitchItemProps) {
  const isDisabled = brand.status !== "active";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onSelect(brand.id)}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        RADIUS_DEEP,
        "flex w-full items-center gap-3 px-2.5 py-2 text-left transition-colors",
        isActive ? "bg-primary/10 text-foreground" : "hover:bg-muted/80",
        isDisabled && "cursor-not-allowed opacity-60 hover:bg-transparent",
      )}
    >
      {brand.logo ? (
        <BrandAppLogo src={brand.logo} size="dock" />
      ) : (
        <BrandAppMarkFallback label={brand.name} size="dock" />
      )}

      <span className="min-w-0 flex-1 truncate font-medium text-sm">
        {brand.name}
      </span>

      {isActive ? (
        <CheckIcon className="size-3.5 shrink-0 text-primary" aria-hidden />
      ) : isDisabled ? (
        <BrandStatusBadge status="inactive" className="shrink-0" />
      ) : null}
    </button>
  );
}

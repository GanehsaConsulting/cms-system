"use client";

import type { Icon } from "@/lib/icons";
import { CaretRightIcon } from "@/lib/icons";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SidebarProfileActionProps {
  icon: Icon;
  label: string;
  description?: string;
  destructive?: boolean;
  onClick: () => void;
}

export function SidebarProfileAction({
  icon: IconComponent,
  label,
  description,
  destructive = false,
  onClick,
}: SidebarProfileActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        RADIUS_DEEP,
        "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
        destructive
          ? "text-destructive hover:bg-destructive/10"
          : "hover:bg-muted/80",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          destructive ? "bg-destructive/15" : "bg-muted",
        )}
      >
        <IconComponent
          className={cn(
            "size-3.5",
            destructive ? "text-destructive" : "text-foreground",
          )}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-sm leading-tight">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-muted-foreground text-xs leading-tight">
            {description}
          </span>
        ) : null}
      </span>
      <CaretRightIcon className="size-3 shrink-0 text-muted-foreground opacity-50" />
    </button>
  );
}

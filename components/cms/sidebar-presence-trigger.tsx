"use client";

import type { ReactNode } from "react";
import { SidebarPresenceCountBadge } from "@/components/cms/sidebar-presence-count-badge";
import { cn } from "@/lib/utils";

interface SidebarPresenceTriggerProps {
  count: number;
  onOpen: () => void;
  children: ReactNode;
  className?: string;
  badgeClassName?: string;
}

/** Avatar wrapper — badge opens presence; children stay presentational. */
export function SidebarPresenceTrigger({
  count,
  onOpen,
  children,
  className,
  badgeClassName,
}: SidebarPresenceTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "relative shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      aria-label={`Team presence, ${count} online`}
    >
      {children}
      <SidebarPresenceCountBadge
        count={count}
        className={cn("-top-1 -right-1 absolute", badgeClassName)}
      />
    </button>
  );
}

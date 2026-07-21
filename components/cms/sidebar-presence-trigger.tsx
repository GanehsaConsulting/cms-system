"use client";

import type { ReactNode } from "react";
import { SidebarPresenceCountBadge } from "@/components/cms/sidebar-presence-count-badge";
import { cn } from "@/lib/utils";

interface SidebarPresenceTriggerProps {
  count: number;
  onOpen: () => void;
  children: ReactNode;
  className?: string;
}

/** Avatar stays as-is; online count floats on the corner. */
export function SidebarPresenceTrigger({
  count,
  onOpen,
  children,
  className,
}: SidebarPresenceTriggerProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen();
      }}
      className={cn(
        "relative shrink-0 rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      aria-label={`Team presence, ${count} online`}
    >
      {children}
      <SidebarPresenceCountBadge
        count={count}
        className="absolute top-0 right-0 z-10 translate-x-1/4 -translate-y-1/4"
      />
    </button>
  );
}

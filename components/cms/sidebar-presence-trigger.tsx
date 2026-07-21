"use client";

import type { ReactNode } from "react";
import { SidebarPresenceCountBadge } from "@/components/cms/sidebar-presence-count-badge";
import { cn } from "@/lib/utils";

interface SidebarPresenceTriggerProps {
  count: number;
  onOpen: () => void;
  children: ReactNode;
  className?: string;
  /** Avatar box size — must match the child avatar. */
  size?: "sm" | "dock";
}

const SIZE_CLASS = {
  sm: "size-8",
  dock: "size-9",
} as const;

/** Avatar + online count badge. Badge is an overlay — avatar stays fully visible. */
export function SidebarPresenceTrigger({
  count,
  onOpen,
  children,
  className,
  size = "sm",
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
        "relative isolate shrink-0 overflow-visible rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        SIZE_CLASS[size],
        className,
      )}
      aria-label={`Team presence, ${count} online`}
    >
      <span className="pointer-events-none block size-full overflow-hidden rounded-[inherit]">
        {children}
      </span>
      <SidebarPresenceCountBadge
        count={count}
        className="absolute top-0 right-0 z-10 translate-x-1/3 -translate-y-1/3"
      />
    </button>
  );
}

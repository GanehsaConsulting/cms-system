"use client";

import { SidebarIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { GLASS_HOVER, GLASS_SURFACE } from "@/config/glass";
import { SEPARATED_CONTROL } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SidebarCollapseTriggerProps {
  className?: string;
}

/** Floating control outside the sidebar glass shell (expanded desktop only). */
export function SidebarCollapseTrigger({
  className,
}: SidebarCollapseTriggerProps) {
  const { toggleSidebar, state } = useSidebar();

  if (state === "collapsed") {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Collapse sidebar"
      onClick={toggleSidebar}
      className={cn(
        GLASS_SURFACE,
        GLASS_HOVER,
        SEPARATED_CONTROL,
        "pointer-events-auto fixed z-20 hidden size-8 p-0 md:inline-flex",
        "top-[calc(var(--sidebar-container-gutter)+var(--sidebar-expanded-inner-padding)+1.125rem)]",
        "left-[calc(var(--sidebar-width)-var(--sidebar-container-gutter))]",
        "-translate-x-1/2 -translate-y-1/2",
        "opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 peer-hover:opacity-100",
        className,
      )}
    >
      <SidebarIcon className="size-4" />
    </Button>
  );
}

"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/cms/sidebar-nav";
import { SidebarBrandButton } from "@/components/shared/sidebar-brand-button";
import { SidebarCollapseTrigger } from "@/components/shared/sidebar-collapse-trigger";
import { SidebarCollapsedDock } from "@/components/shared/sidebar-collapsed-dock";
import {
  SEPARATED_SIDEBAR_CLASS,
  SEPARATED_SIDEBAR_GUTTER,
  SIDEBAR_COLLAPSED_DOCK_WRAPPER,
} from "@/config/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CmsSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      className={cn(SEPARATED_SIDEBAR_CLASS, "group/sidebar", SEPARATED_SIDEBAR_GUTTER)}
    >
      {isCollapsed ? (
        <div className={SIDEBAR_COLLAPSED_DOCK_WRAPPER}>
          <SidebarCollapsedDock />
        </div>
      ) : (
        <>
          <SidebarHeader className="gap-2 p-0">
            <div className="flex w-full items-center gap-1.5">
              <SidebarMenu className="min-w-0 flex-1">
                <SidebarMenuItem>
                  <SidebarBrandButton />
                </SidebarMenuItem>
              </SidebarMenu>
              <SidebarCollapseTrigger />
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 p-0">
            <SidebarNav />
          </SidebarContent>

          <SidebarFooter className="gap-0 p-0">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <p className="text-muted-foreground text-xs">
                  MVP — Kelola Artikel
                </p>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarFooter>
        </>
      )}
    </Sidebar>
  );
}

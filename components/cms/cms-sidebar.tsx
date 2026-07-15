"use client";

import { useState } from "react";
import { SidebarBrandSwitchDialog } from "@/components/cms/sidebar-brand-switch-dialog";
import { SidebarBrandSwitcherButton } from "@/components/cms/sidebar-brand-switcher-button";
import { SidebarNav } from "@/components/cms/sidebar-nav";
import { SidebarProfileButton } from "@/components/cms/sidebar-profile-button";
import { SidebarProfileDialog } from "@/components/cms/sidebar-profile-dialog";
import { SidebarSearchDialog } from "@/components/cms/sidebar-search-dialog";
import { SidebarSearchTrigger } from "@/components/cms/sidebar-search-trigger";
import { SidebarCollapseTrigger } from "@/components/shared/sidebar-collapse-trigger";
import { SidebarCollapsedDock } from "@/components/shared/sidebar-collapsed-dock";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { type CmsUser, CURRENT_CMS_USER } from "@/config/cms-user";
import {
  SEPARATED_SIDEBAR_CLASS,
  SEPARATED_SIDEBAR_GUTTER,
  SIDEBAR_COLLAPSED_DOCK_WRAPPER,
} from "@/config/sidebar";
import { cn } from "@/lib/utils";
import type { CmsProfileFormValues } from "@/lib/validations/cms-user";

export function CmsSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<CmsUser>(CURRENT_CMS_USER);

  function handleUserUpdate(values: CmsProfileFormValues) {
    setUser((current) => ({
      ...current,
      name: values.name,
      email: values.email,
      avatarUrl: values.avatarUrl,
    }));
  }

  return (
    <>
      <Sidebar
        variant="floating"
        collapsible="icon"
        className={cn(
          SEPARATED_SIDEBAR_CLASS,
          "group/sidebar",
          SEPARATED_SIDEBAR_GUTTER,
        )}
      >
        {isCollapsed ? (
          <div className={SIDEBAR_COLLAPSED_DOCK_WRAPPER}>
            <SidebarCollapsedDock
              user={user}
              onOpenProfile={() => setProfileOpen(true)}
              isProfileOpen={profileOpen}
              onOpenSearch={() => setSearchOpen(true)}
              isSearchOpen={searchOpen}
            />
          </div>
        ) : (
          <>
            <SidebarHeader className="gap-2 p-0">
              <SidebarMenu className="w-full">
                <SidebarMenuItem>
                  <SidebarBrandSwitcherButton />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>

            <div className="px-0 py-2">
              <SidebarSearchTrigger onOpen={() => setSearchOpen(true)} />
            </div>

            <SidebarContent className="gap-0 p-0">
              <SidebarNav />
            </SidebarContent>

            <SidebarFooter className="gap-0 p-0">
              <SidebarSeparator className="mx-0 mb-2 bg-(--separator)" />
              <SidebarProfileButton
                user={user}
                onOpen={() => setProfileOpen(true)}
              />
            </SidebarFooter>
          </>
        )}
      </Sidebar>

      <SidebarCollapseTrigger />
      <SidebarBrandSwitchDialog />
      <SidebarSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <SidebarProfileDialog
        user={user}
        open={profileOpen}
        onOpenChange={setProfileOpen}
        onUserUpdate={handleUserUpdate}
      />
    </>
  );
}

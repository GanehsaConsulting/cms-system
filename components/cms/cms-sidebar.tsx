"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { SidebarBrandSwitcherButton } from "@/components/cms/sidebar-brand-switcher-button";
import { SidebarNav } from "@/components/cms/sidebar-nav";
import { SidebarProfileButton } from "@/components/cms/sidebar-profile-button";
import { SidebarSearchTrigger } from "@/components/cms/sidebar-search-trigger";
import { useBrand } from "@/components/shared/brand-provider";
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
import { useCmsPresence } from "@/hooks/use-cms-presence";
import { cn } from "@/lib/utils";
import type { CmsProfileFormValues } from "@/lib/validations/cms-user";

const SidebarBrandSwitchDialog = dynamic(
  () =>
    import("@/components/cms/sidebar-brand-switch-dialog").then((mod) => ({
      default: mod.SidebarBrandSwitchDialog,
    })),
  { ssr: false },
);

const SidebarSearchDialog = dynamic(
  () =>
    import("@/components/cms/sidebar-search-dialog").then((mod) => ({
      default: mod.SidebarSearchDialog,
    })),
  { ssr: false },
);

const SidebarProfileDialog = dynamic(
  () =>
    import("@/components/cms/sidebar-profile-dialog").then((mod) => ({
      default: mod.SidebarProfileDialog,
    })),
  { ssr: false },
);

const SidebarPresenceDialog = dynamic(
  () =>
    import("@/components/cms/sidebar-presence-dialog").then((mod) => ({
      default: mod.SidebarPresenceDialog,
    })),
  { ssr: false },
);

interface CmsSidebarProps {
  user?: CmsUser;
}

export function CmsSidebar({
  user: initialUser = CURRENT_CMS_USER,
}: CmsSidebarProps) {
  const { state } = useSidebar();
  const { switcherOpen } = useBrand();
  const isCollapsed = state === "collapsed";
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [presenceOpen, setPresenceOpen] = useState(false);
  const [user, setUser] = useState<CmsUser>(initialUser);
  const {
    onlineCount,
    users: presenceUsers,
    isLoading: presenceLoading,
    refresh: refreshPresence,
  } = useCmsPresence();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  function handleUserUpdate(values: CmsProfileFormValues) {
    setUser((current) => ({
      ...current,
      name: values.name,
      email: values.email,
      avatarUrl: values.avatarUrl,
    }));
  }

  function handleOpenPresence() {
    setPresenceOpen(true);
    void refreshPresence();
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
              onlineCount={onlineCount}
              onOpenProfile={() => setProfileOpen(true)}
              onOpenPresence={handleOpenPresence}
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

            <SidebarFooter className="gap-0 overflow-visible p-0">
              <SidebarSeparator className="mx-0 mb-2 bg-(--separator)" />
              <SidebarProfileButton
                user={user}
                onlineCount={onlineCount}
                onOpen={() => setProfileOpen(true)}
                onOpenPresence={handleOpenPresence}
              />
            </SidebarFooter>
          </>
        )}
      </Sidebar>

      <SidebarCollapseTrigger />
      {switcherOpen ? <SidebarBrandSwitchDialog /> : null}
      {searchOpen ? (
        <SidebarSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      ) : null}
      {profileOpen ? (
        <SidebarProfileDialog
          user={user}
          open={profileOpen}
          onOpenChange={setProfileOpen}
          onUserUpdate={handleUserUpdate}
        />
      ) : null}
      {presenceOpen ? (
        <SidebarPresenceDialog
          open={presenceOpen}
          onOpenChange={setPresenceOpen}
          users={presenceUsers}
          onlineCount={onlineCount}
          isLoading={presenceLoading}
        />
      ) : null}
    </>
  );
}

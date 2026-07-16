"use client";

import { usePathname } from "next/navigation";
import { CmsSidebar } from "@/components/cms/cms-sidebar";
import { AppearanceDrawerProvider } from "@/components/shared/appearance-drawer-provider";
import { BrandProvider } from "@/components/shared/brand-provider";
import { CmsSidebarProvider } from "@/components/shared/cms-sidebar-provider";
import { GlassPanel } from "@/components/shared/glass-panel";
import { NotificationCenterProvider } from "@/components/shared/notification-center-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { SEPARATED_SIDEBAR_ICON_WIDTH } from "@/config/sidebar";
import { DESKTOP_OUTER_GUTTER } from "@/config/spacing";
import type { CmsUser } from "@/config/cms-user";
import { cn } from "@/lib/utils";
import type { Brand } from "@/types/brand";

interface CmsShellProps {
  children: React.ReactNode;
  brands: Brand[];
  user?: CmsUser;
  canAccessSettings?: boolean;
  canAccessAllPages?: boolean;
}

export function CmsShell({
  children,
  brands,
  user,
  canAccessSettings = false,
  canAccessAllPages = false,
}: CmsShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";

  return (
    <AppearanceDrawerProvider>
      <NotificationCenterProvider>
        <BrandProvider
          brands={brands}
          userName={user?.name}
          canAccessSettings={canAccessSettings}
          canAccessAllPages={canAccessAllPages}
        >
          <CmsSidebarProvider
            className="relative z-10 flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-transparent"
            style={
              {
                "--sidebar-width-icon": SEPARATED_SIDEBAR_ICON_WIDTH,
              } as React.CSSProperties
            }
          >
            <CmsSidebar user={user} />
            <SidebarInset
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent",
                !isDashboard && DESKTOP_OUTER_GUTTER,
              )}
            >
              {isDashboard ? children : <GlassPanel>{children}</GlassPanel>}
            </SidebarInset>
          </CmsSidebarProvider>
        </BrandProvider>
      </NotificationCenterProvider>
    </AppearanceDrawerProvider>
  );
}

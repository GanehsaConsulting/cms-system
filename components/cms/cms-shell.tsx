"use client";

import { usePathname } from "next/navigation";
import { CmsSidebar } from "@/components/cms/cms-sidebar";
import { AppearanceDrawerProvider } from "@/components/shared/appearance-drawer-provider";
import { BrandProvider, useBrand } from "@/components/shared/brand-provider";
import { BrandSwitchPendingIndicator } from "@/components/shared/brand-switch-pending-indicator";
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

function CmsShellMain({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: CmsUser;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  const { isSwitchingBrand, activeBrandId } = useBrand();

  return (
    <>
      <CmsSidebar user={user} />
      <SidebarInset
        className={cn(
          "relative flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent",
          !isDashboard && DESKTOP_OUTER_GUTTER,
        )}
      >
        <BrandSwitchPendingIndicator />
        <div
          key={activeBrandId ?? "brand"}
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden transition-opacity duration-200",
            isSwitchingBrand && "pointer-events-none opacity-45",
          )}
          aria-busy={isSwitchingBrand}
        >
          {isDashboard ? children : <GlassPanel>{children}</GlassPanel>}
        </div>
      </SidebarInset>
    </>
  );
}

export function CmsShell({
  children,
  brands,
  user,
  canAccessSettings = false,
  canAccessAllPages = false,
}: CmsShellProps) {
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
            <CmsShellMain user={user}>{children}</CmsShellMain>
          </CmsSidebarProvider>
        </BrandProvider>
      </NotificationCenterProvider>
    </AppearanceDrawerProvider>
  );
}

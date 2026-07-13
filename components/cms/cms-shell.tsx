"use client";

import { CmsSidebar } from "@/components/cms/cms-sidebar";
import { AppearanceDrawerProvider } from "@/components/shared/appearance-drawer-provider";
import { CmsSidebarProvider } from "@/components/shared/cms-sidebar-provider";
import { GlassPanel } from "@/components/shared/glass-panel";
import { NotificationCenterProvider } from "@/components/shared/notification-center-provider";
import { WallpaperBackground } from "@/components/shared/wallpaper-background";
import { WallpaperProvider } from "@/components/shared/wallpaper-provider";
import { SidebarInset } from "@/components/ui/sidebar";
import { SEPARATED_SIDEBAR_ICON_WIDTH } from "@/config/sidebar";
import { DESKTOP_OUTER_GUTTER } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface CmsShellProps {
  children: React.ReactNode;
}

export function CmsShell({ children }: CmsShellProps) {
  return (
    <WallpaperProvider>
      <AppearanceDrawerProvider>
        <NotificationCenterProvider>
          <WallpaperBackground />
          <CmsSidebarProvider
            className="relative z-10 flex h-svh max-h-svh min-h-0 w-full overflow-hidden bg-transparent"
            style={
              {
                "--sidebar-width-icon": SEPARATED_SIDEBAR_ICON_WIDTH,
              } as React.CSSProperties
            }
          >
            <CmsSidebar />
            <SidebarInset
              className={cn(
                "flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent",
                DESKTOP_OUTER_GUTTER,
              )}
            >
              <GlassPanel>{children}</GlassPanel>
            </SidebarInset>
          </CmsSidebarProvider>
        </NotificationCenterProvider>
      </AppearanceDrawerProvider>
    </WallpaperProvider>
  );
}

"use client";

import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { AppearanceView } from "@/components/shared/appearance-view";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { APPEARANCE_DRAWER_SURFACE } from "@/config/settings-layout";
import { SHELL_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

export function AppearanceDrawer() {
  const { open, setOpen } = useAppearanceDrawer();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className={APPEARANCE_DRAWER_SURFACE}>
        <SheetHeader className="border-(--separator) border-b px-5 py-4">
          <SheetTitle>Appearance</SheetTitle>
          <SheetDescription>
            Theme, accent, app icons, glass, and wallpaper.
          </SheetDescription>
        </SheetHeader>
        <div className={cn("min-h-0 flex-1 overflow-y-auto", SHELL_PADDING)}>
          <AppearanceView />
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import { appearanceNavItem } from "@/config/nav";

export function OpenAppearanceButton() {
  const { openAppearance } = useAppearanceDrawer();

  return (
    <Button type="button" variant="outline" onClick={openAppearance}>
      <appearanceNavItem.icon />
      Buka {appearanceNavItem.title}
    </Button>
  );
}

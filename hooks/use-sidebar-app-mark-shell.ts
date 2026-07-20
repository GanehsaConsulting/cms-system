"use client";

import { useAppearance } from "@/components/shared/appearance-provider";
import {
  getSidebarAppMarkShellClasses,
  type SidebarAppIconTone,
} from "@/config/sidebar";

export function useSidebarAppMarkShell(
  size: "sm" | "dock",
  tone: SidebarAppIconTone = "brand",
): string {
  const { appIconStyle } = useAppearance();
  return getSidebarAppMarkShellClasses(size, appIconStyle, tone);
}

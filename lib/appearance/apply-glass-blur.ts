import { getGlassBlurPx } from "@/config/glass-blur";
import { glassFillTransparencyToOpacity } from "@/config/glass-fill";
import type { GlassBlurLevelId } from "@/types/glass-blur";

export function applyGlassAppearance(
  levelId: GlassBlurLevelId,
  fillTransparency: number,
): void {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const blurPx = getGlassBlurPx(levelId);
  const fillOpacity = glassFillTransparencyToOpacity(fillTransparency);

  root.style.setProperty("--glass-backdrop-blur", `${blurPx}px`);
  root.style.setProperty("--glass-fill-opacity", String(fillOpacity));
  root.dataset.glassBlur = levelId;
}

import {
  DEFAULT_GLASS_BLUR_LEVEL,
  GLASS_BLUR_LEVEL_IDS,
} from "@/config/glass-blur";
import {
  clampGlassFillTransparency,
  DEFAULT_GLASS_FILL_TRANSPARENCY,
} from "@/config/glass-fill";
import type { GlassBlurLevelId } from "@/types/glass-blur";

const BLUR_STORAGE_KEY = "cms:glass-blur";
const FILL_TRANSPARENCY_STORAGE_KEY = "cms:glass-fill-transparency";

export function readStoredGlassBlurLevel(): GlassBlurLevelId {
  if (typeof window === "undefined") {
    return DEFAULT_GLASS_BLUR_LEVEL;
  }

  const stored = window.localStorage.getItem(BLUR_STORAGE_KEY);
  if (!stored || !GLASS_BLUR_LEVEL_IDS.has(stored as GlassBlurLevelId)) {
    return DEFAULT_GLASS_BLUR_LEVEL;
  }

  return stored as GlassBlurLevelId;
}

export function writeStoredGlassBlurLevel(levelId: GlassBlurLevelId): void {
  window.localStorage.setItem(BLUR_STORAGE_KEY, levelId);
}

export function readStoredGlassFillTransparency(): number {
  if (typeof window === "undefined") {
    return DEFAULT_GLASS_FILL_TRANSPARENCY;
  }

  const stored = window.localStorage.getItem(FILL_TRANSPARENCY_STORAGE_KEY);
  if (stored) {
    const parsed = Number.parseInt(stored, 10);
    if (!Number.isNaN(parsed)) {
      return clampGlassFillTransparency(parsed);
    }
  }

  return DEFAULT_GLASS_FILL_TRANSPARENCY;
}

export function writeStoredGlassFillTransparency(value: number): void {
  window.localStorage.setItem(
    FILL_TRANSPARENCY_STORAGE_KEY,
    String(clampGlassFillTransparency(value)),
  );
}

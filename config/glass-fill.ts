export const GLASS_FILL_TRANSPARENCY_MIN = 0;
export const GLASS_FILL_TRANSPARENCY_MAX = 85;
export const GLASS_FILL_TRANSPARENCY_STEP = 5;
export const DEFAULT_GLASS_FILL_TRANSPARENCY = 40;

export const GLASS_FILL_OPACITY_SOLID = 0.94;
export const GLASS_FILL_OPACITY_TRANSPARENT = 0.08;

export function clampGlassFillTransparency(value: number): number {
  return Math.min(
    GLASS_FILL_TRANSPARENCY_MAX,
    Math.max(GLASS_FILL_TRANSPARENCY_MIN, value),
  );
}

export function glassFillTransparencyToOpacity(transparency: number): number {
  const t =
    clampGlassFillTransparency(transparency) / GLASS_FILL_TRANSPARENCY_MAX;
  return (
    GLASS_FILL_OPACITY_SOLID -
    t * (GLASS_FILL_OPACITY_SOLID - GLASS_FILL_OPACITY_TRANSPARENT)
  );
}

export function getGlassFillTransparencyTrackPercent(value: number): number {
  const range = GLASS_FILL_TRANSPARENCY_MAX - GLASS_FILL_TRANSPARENCY_MIN;
  if (range <= 0) {
    return 0;
  }

  return (
    ((clampGlassFillTransparency(value) - GLASS_FILL_TRANSPARENCY_MIN) /
      range) *
    100
  );
}

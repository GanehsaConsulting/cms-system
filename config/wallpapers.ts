import type { Wallpaper, WallpaperId } from "@/types/wallpaper";

export const DEFAULT_WALLPAPER_ID: WallpaperId = "default";

export const SYSTEM_WALLPAPER_LIGHT = "/wallpapers/aurora-light.png";
export const SYSTEM_WALLPAPER_DARK = "/wallpapers/aurora-dark.png";

export const MAX_CUSTOM_WALLPAPERS = 3;

export const CUSTOM_WALLPAPER_SLOT_IDS = [
  "custom-1",
  "custom-2",
  "custom-3",
] as const satisfies readonly WallpaperId[];

export const LEGACY_CUSTOM_WALLPAPER_ID = "custom" as const;

export type CustomWallpaperSlotId = (typeof CUSTOM_WALLPAPER_SLOT_IDS)[number];

const AURORA_GLOW =
  "radial-gradient(ellipse 90% 70% at 8% 12%, color-mix(in oklch, #8e5af7 28%, transparent), transparent 58%), radial-gradient(ellipse 80% 60% at 92% 88%, color-mix(in oklch, #34c759 22%, transparent), transparent 55%), var(--background)";

const SUNSET =
  "radial-gradient(ellipse 85% 65% at 88% 8%, color-mix(in oklch, #ff9500 26%, transparent), transparent 55%), radial-gradient(ellipse 75% 55% at 10% 92%, color-mix(in oklch, #ff6b6b 22%, transparent), transparent 52%), var(--background)";

const OCEAN =
  "radial-gradient(ellipse 80% 60% at 12% 18%, color-mix(in oklch, #5ac8fa 26%, transparent), transparent 55%), radial-gradient(ellipse 70% 55% at 90% 85%, color-mix(in oklch, #007aff 20%, transparent), transparent 52%), var(--background)";

const FOREST =
  "radial-gradient(ellipse 75% 60% at 18% 78%, color-mix(in oklch, #34c759 22%, transparent), transparent 55%), radial-gradient(ellipse 65% 50% at 82% 15%, color-mix(in oklch, #a89478 18%, transparent), transparent 50%), var(--background)";

const MIDNIGHT_LIGHT =
  "radial-gradient(ellipse 85% 65% at 75% 12%, color-mix(in oklch, #8e5af7 24%, transparent), transparent 58%), radial-gradient(ellipse 70% 55% at 15% 88%, color-mix(in oklch, #007aff 18%, transparent), transparent 52%), var(--background)";

const MIDNIGHT_DARK =
  "radial-gradient(ellipse 85% 65% at 75% 12%, color-mix(in oklch, #8e5af7 30%, transparent), transparent 58%), radial-gradient(ellipse 70% 55% at 15% 88%, color-mix(in oklch, #007aff 22%, transparent), transparent 52%), var(--background)";

const ROSE =
  "radial-gradient(ellipse 80% 60% at 82% 10%, color-mix(in oklch, #ff70c1 24%, transparent), transparent 55%), radial-gradient(ellipse 70% 55% at 12% 90%, color-mix(in oklch, #ff6b6b 18%, transparent), transparent 52%), var(--background)";

function themedGradient(
  light: string,
  dark: string = light,
): Wallpaper["themeVariants"] {
  return {
    light: { preview: light, background: light },
    dark: { preview: dark, background: dark },
  };
}

export const WALLPAPERS: Wallpaper[] = [
  {
    id: "default",
    label: "Surfaces",
    kind: "image",
    preview: SYSTEM_WALLPAPER_LIGHT,
    background: SYSTEM_WALLPAPER_LIGHT,
    themeVariants: {
      light: {
        preview: SYSTEM_WALLPAPER_LIGHT,
        background: SYSTEM_WALLPAPER_LIGHT,
      },
      dark: {
        preview: SYSTEM_WALLPAPER_DARK,
        background: SYSTEM_WALLPAPER_DARK,
      },
    },
  },
  {
    id: "solid",
    label: "Solid",
    kind: "solid",
    preview: "#F5F5F7",
    background: "#F5F5F7",
    themeVariants: {
      light: {
        preview: "#F5F5F7",
        background: "#F5F5F7",
      },
      dark: {
        preview: "#1C1C1E",
        background: "#1C1C1E",
      },
    },
  },
  {
    id: "aurora",
    label: "Aurora Glow",
    kind: "gradient",
    preview: AURORA_GLOW,
    background: AURORA_GLOW,
    themeVariants: themedGradient(AURORA_GLOW),
  },
  {
    id: "sunset",
    label: "Sunset",
    kind: "gradient",
    preview: SUNSET,
    background: SUNSET,
    themeVariants: themedGradient(SUNSET),
  },
  {
    id: "ocean",
    label: "Ocean",
    kind: "gradient",
    preview: OCEAN,
    background: OCEAN,
    themeVariants: themedGradient(OCEAN),
  },
  {
    id: "forest",
    label: "Forest",
    kind: "gradient",
    preview: FOREST,
    background: FOREST,
    themeVariants: themedGradient(FOREST),
  },
  {
    id: "midnight",
    label: "Midnight",
    kind: "gradient",
    preview: MIDNIGHT_LIGHT,
    background: MIDNIGHT_LIGHT,
    themeVariants: themedGradient(MIDNIGHT_LIGHT, MIDNIGHT_DARK),
  },
  {
    id: "rose",
    label: "Rose",
    kind: "gradient",
    preview: ROSE,
    background: ROSE,
    themeVariants: themedGradient(ROSE),
  },
];

export const PRESET_WALLPAPER_IDS = new Set<WallpaperId>(
  WALLPAPERS.map((wallpaper) => wallpaper.id),
);

export const WALLPAPER_IDS = new Set<WallpaperId>([
  ...PRESET_WALLPAPER_IDS,
  ...CUSTOM_WALLPAPER_SLOT_IDS,
  LEGACY_CUSTOM_WALLPAPER_ID,
]);

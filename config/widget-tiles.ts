const TILE_HIGHLIGHT =
  "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_1px_2px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_3px_rgba(0,0,0,0.35)]";

export interface WidgetTileStyle {
  surface: string;
  iconColor: string;
  labelColor: string;
  valueColor: string;
}

export const WIDGET_TILE_STYLES = {
  primary: {
    surface: `bg-linear-to-br from-[#5AC8FA] to-[#007AFF] dark:from-[#4AB0E0] dark:to-[#0066D6] ${TILE_HIGHLIGHT}`,
    iconColor: "text-white/95",
    labelColor: "text-white/85",
    valueColor: "text-white",
  },
  accent: {
    surface: `bg-linear-to-br from-[#A578FF] to-[#8E5AF7] dark:from-[#9B6AF0] dark:to-[#7A4AD9] ${TILE_HIGHLIGHT}`,
    iconColor: "text-white/95",
    labelColor: "text-white/85",
    valueColor: "text-white",
  },
} as const satisfies Record<string, WidgetTileStyle>;

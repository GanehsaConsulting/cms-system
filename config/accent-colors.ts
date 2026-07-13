import type { AccentColorId } from "@/types/appearance";

export interface AccentColorOption {
  id: AccentColorId;
  label: string;
  light: string;
  dark: string;
}

export const DEFAULT_ACCENT_ID: AccentColorId = "blue";

const LEGACY_ACCENT_IDS: Record<string, AccentColorId> = {
  neutral: "graphite",
  coral: "red",
};

/** Accent swatches — light & dark use the same brand hexes from the system palette. */
export const ACCENT_COLORS: AccentColorOption[] = [
  { id: "blue", label: "Default", light: "#007AFF", dark: "#007AFF" },
  { id: "purple", label: "Purple", light: "#A550A6", dark: "#A550A6" },
  { id: "pink", label: "Pink", light: "#F74F9D", dark: "#F74F9D" },
  { id: "red", label: "Red", light: "#FF5257", dark: "#FF5257" },
  { id: "orange", label: "Orange", light: "#F78219", dark: "#F78219" },
  { id: "yellow", label: "Yellow", light: "#FFC600", dark: "#FFC600" },
  { id: "green", label: "Green", light: "#60BA46", dark: "#60BA46" },
  { id: "graphite", label: "Graphite", light: "#8C8C8B", dark: "#8C8C8B" },
];

export const ACCENT_COLOR_IDS = new Set<AccentColorId>(
  ACCENT_COLORS.map((accent) => accent.id),
);

export function normalizeAccentId(value: string): AccentColorId {
  if (ACCENT_COLOR_IDS.has(value as AccentColorId)) {
    return value as AccentColorId;
  }

  return LEGACY_ACCENT_IDS[value] ?? DEFAULT_ACCENT_ID;
}

export function getAccentSwatch(
  accentId: AccentColorId,
  isDark: boolean,
): string {
  const accent =
    ACCENT_COLORS.find((entry) => entry.id === accentId) ?? ACCENT_COLORS[0];

  return isDark ? accent.dark : accent.light;
}

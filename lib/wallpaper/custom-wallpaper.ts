import {
  CUSTOM_WALLPAPER_SLOT_IDS,
  type CustomWallpaperSlotId,
  LEGACY_CUSTOM_WALLPAPER_ID,
  MAX_CUSTOM_WALLPAPERS,
} from "@/config/wallpapers";

export type CustomWallpaperSlots = [
  string | null,
  string | null,
  string | null,
];

export const EMPTY_CUSTOM_WALLPAPER_SLOTS: CustomWallpaperSlots = [
  null,
  null,
  null,
];

export function customWallpaperIdForSlot(slot: number): CustomWallpaperSlotId {
  if (slot < 0 || slot >= MAX_CUSTOM_WALLPAPERS) {
    return CUSTOM_WALLPAPER_SLOT_IDS[0];
  }

  return CUSTOM_WALLPAPER_SLOT_IDS[slot];
}

export function slotForCustomWallpaperId(id: string): number | null {
  if (id === LEGACY_CUSTOM_WALLPAPER_ID) {
    return 0;
  }

  const index = CUSTOM_WALLPAPER_SLOT_IDS.indexOf(id as CustomWallpaperSlotId);
  return index === -1 ? null : index;
}

export function isCustomWallpaperId(id: string): id is CustomWallpaperSlotId {
  return CUSTOM_WALLPAPER_SLOT_IDS.includes(id as CustomWallpaperSlotId);
}

export function countFilledCustomWallpaperSlots(
  slots: CustomWallpaperSlots,
): number {
  return slots.filter((url) => url !== null).length;
}

export function findFirstEmptyCustomWallpaperSlot(
  slots: CustomWallpaperSlots,
): number | null {
  const index = slots.findIndex((url) => url === null);
  return index === -1 ? null : index;
}

export function listFilledCustomWallpaperSlots(
  slots: CustomWallpaperSlots,
): { slot: number; url: string }[] {
  return slots.flatMap((url, slot) => (url ? [{ slot, url }] : []));
}

export function normalizeStoredWallpaperId(id: string): string {
  if (id === LEGACY_CUSTOM_WALLPAPER_ID) {
    return CUSTOM_WALLPAPER_SLOT_IDS[0];
  }

  return id;
}

export {
  CUSTOM_WALLPAPER_SLOT_IDS,
  LEGACY_CUSTOM_WALLPAPER_ID,
  MAX_CUSTOM_WALLPAPERS,
};

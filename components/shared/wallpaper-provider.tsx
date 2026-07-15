"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAppearance } from "@/components/shared/appearance-provider";
import { DEFAULT_WALLPAPER_MASK } from "@/config/wallpaper-mask";
import {
  DEFAULT_WALLPAPER_ID,
  MAX_CUSTOM_WALLPAPERS,
} from "@/config/wallpapers";
import {
  readCustomWallpaperSlots,
  setCustomWallpaperAtSlot,
} from "@/lib/wallpaper/custom-storage";
import {
  type CustomWallpaperSlots,
  countFilledCustomWallpaperSlots,
  customWallpaperIdForSlot,
  EMPTY_CUSTOM_WALLPAPER_SLOTS,
  findFirstEmptyCustomWallpaperSlot,
  isCustomWallpaperId,
  normalizeStoredWallpaperId,
  slotForCustomWallpaperId,
} from "@/lib/wallpaper/custom-wallpaper";
import {
  readStoredWallpaperMask,
  readStoredWallpaperMaskColor,
  writeStoredWallpaperMask,
  writeStoredWallpaperMaskColor,
} from "@/lib/wallpaper/mask-storage";
import { syncWallpaperPaintCache } from "@/lib/wallpaper/paint-cache";
import {
  processWallpaperFile,
  processWallpaperFromUrl,
  WallpaperUploadError,
} from "@/lib/wallpaper/process-image";
import {
  isActiveCustomWallpaper,
  resolveActiveWallpaper,
  resolveWallpaper,
} from "@/lib/wallpaper/resolve-wallpaper";
import {
  readStoredWallpaperId,
  writeStoredWallpaperId,
} from "@/lib/wallpaper/storage";
import type {
  Wallpaper,
  WallpaperId,
  WallpaperMaskColor,
} from "@/types/wallpaper";

interface WallpaperContextValue {
  wallpaper: Wallpaper;
  wallpaperId: WallpaperId;
  customWallpaperSlots: CustomWallpaperSlots;
  customWallpaperCount: number;
  canUploadMoreCustomWallpapers: boolean;
  maskOpacity: number;
  maskColor: WallpaperMaskColor;
  /** False until localStorage / IndexedDB prefs are applied — boot layer stays painted. */
  isReady: boolean;
  isUploading: boolean;
  uploadError: string | null;
  setWallpaperId: (id: WallpaperId) => void;
  setMaskOpacity: (value: number) => void;
  setMaskColor: (value: WallpaperMaskColor) => void;
  uploadCustomWallpaper: (file: File) => Promise<void>;
  uploadCustomWallpaperFromUrl: (url: string) => Promise<void>;
  removeCustomWallpaper: (slot: number) => Promise<void>;
}

const WallpaperContext = createContext<WallpaperContextValue | null>(null);

interface WallpaperProviderProps {
  children: React.ReactNode;
}

function resolveInitialWallpaperId(
  storedId: WallpaperId,
  slots: CustomWallpaperSlots,
): WallpaperId {
  const normalizedId = normalizeStoredWallpaperId(storedId) as WallpaperId;

  if (isCustomWallpaperId(normalizedId)) {
    return isActiveCustomWallpaper(normalizedId, slots)
      ? normalizedId
      : DEFAULT_WALLPAPER_ID;
  }

  return normalizedId;
}

async function loadInitialWallpaperState(): Promise<{
  wallpaperId: WallpaperId;
  customWallpaperSlots: CustomWallpaperSlots;
}> {
  const [storedId, customWallpaperSlots] = await Promise.all([
    Promise.resolve(readStoredWallpaperId()),
    readCustomWallpaperSlots(),
  ]);

  const wallpaperId = resolveInitialWallpaperId(storedId, customWallpaperSlots);

  if (wallpaperId !== storedId) {
    writeStoredWallpaperId(wallpaperId);
  }

  return { wallpaperId, customWallpaperSlots };
}

export function WallpaperProvider({ children }: WallpaperProviderProps) {
  const { resolvedDark, setAppIconStyle } = useAppearance();
  const [wallpaperId, setWallpaperIdState] =
    useState<WallpaperId>(DEFAULT_WALLPAPER_ID);
  const [customWallpaperSlots, setCustomWallpaperSlots] =
    useState<CustomWallpaperSlots>(EMPTY_CUSTOM_WALLPAPER_SLOTS);
  const [maskOpacity, setMaskOpacityState] = useState(DEFAULT_WALLPAPER_MASK);
  const [maskColor, setMaskColorState] = useState<WallpaperMaskColor>("black");
  const [isReady, setIsReady] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const customWallpaperCount = useMemo(
    () => countFilledCustomWallpaperSlots(customWallpaperSlots),
    [customWallpaperSlots],
  );

  const canUploadMoreCustomWallpapers =
    customWallpaperCount < MAX_CUSTOM_WALLPAPERS;

  useLayoutEffect(() => {
    let cancelled = false;

    void loadInitialWallpaperState().then(
      ({ wallpaperId, customWallpaperSlots }) => {
        if (cancelled) {
          return;
        }

        setWallpaperIdState(wallpaperId);
        setCustomWallpaperSlots(customWallpaperSlots);
        setMaskOpacityState(readStoredWallpaperMask());
        setMaskColorState(readStoredWallpaperMaskColor());
        setIsReady(true);
      },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.wallpaper = wallpaperId;
  }, [wallpaperId]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const light = resolveActiveWallpaper(
      wallpaperId,
      customWallpaperSlots,
      false,
    );
    const dark = resolveActiveWallpaper(
      wallpaperId,
      customWallpaperSlots,
      true,
    );

    syncWallpaperPaintCache({
      id: light.id,
      kind: light.kind,
      lightBackground: light.background,
      darkBackground: dark.background,
      maskOpacity,
      maskColor,
    });
  }, [customWallpaperSlots, isReady, maskColor, maskOpacity, wallpaperId]);

  const setWallpaperId = useCallback(
    (id: WallpaperId) => {
      setUploadError(null);
      setWallpaperIdState(id);
      writeStoredWallpaperId(id);

      // Solid backgrounds look best with colored app icons (like macOS).
      if (resolveWallpaper(id).kind === "solid") {
        setAppIconStyle("colored");
      }
    },
    [setAppIconStyle],
  );

  const setMaskOpacity = useCallback((value: number) => {
    setMaskOpacityState(value);
    writeStoredWallpaperMask(value);
  }, []);

  const setMaskColor = useCallback((value: WallpaperMaskColor) => {
    setMaskColorState(value);
    writeStoredWallpaperMaskColor(value);
  }, []);

  const saveCustomWallpaperDataUrl = useCallback(async (dataUrl: string) => {
    const slots = await readCustomWallpaperSlots();
    const emptySlot = findFirstEmptyCustomWallpaperSlot(slots);

    if (emptySlot === null) {
      throw new WallpaperUploadError(
        `Maximum ${MAX_CUSTOM_WALLPAPERS} custom wallpapers.`,
      );
    }

    const nextSlots = await setCustomWallpaperAtSlot(emptySlot, dataUrl);
    const nextId = customWallpaperIdForSlot(emptySlot);

    setCustomWallpaperSlots(nextSlots);
    setWallpaperIdState(nextId);
    writeStoredWallpaperId(nextId);
  }, []);

  const uploadCustomWallpaper = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const dataUrl = await processWallpaperFile(file);
        await saveCustomWallpaperDataUrl(dataUrl);
      } catch (error) {
        const message =
          error instanceof WallpaperUploadError
            ? error.message
            : "Failed to upload wallpaper.";
        setUploadError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [saveCustomWallpaperDataUrl],
  );

  const uploadCustomWallpaperFromUrl = useCallback(
    async (url: string) => {
      setIsUploading(true);
      setUploadError(null);

      try {
        const dataUrl = await processWallpaperFromUrl(url);
        await saveCustomWallpaperDataUrl(dataUrl);
      } catch (error) {
        const message =
          error instanceof WallpaperUploadError
            ? error.message
            : "Failed to import wallpaper from link.";
        setUploadError(message);
      } finally {
        setIsUploading(false);
      }
    },
    [saveCustomWallpaperDataUrl],
  );

  const removeCustomWallpaper = useCallback(
    async (slot: number) => {
      const nextSlots = await setCustomWallpaperAtSlot(slot, null);
      setCustomWallpaperSlots(nextSlots);
      setUploadError(null);

      const selectedSlot = slotForCustomWallpaperId(
        normalizeStoredWallpaperId(wallpaperId),
      );

      if (selectedSlot === slot) {
        setWallpaperIdState(DEFAULT_WALLPAPER_ID);
        writeStoredWallpaperId(DEFAULT_WALLPAPER_ID);
      }
    },
    [wallpaperId],
  );

  const wallpaper = useMemo(
    () =>
      resolveActiveWallpaper(wallpaperId, customWallpaperSlots, resolvedDark),
    [customWallpaperSlots, resolvedDark, wallpaperId],
  );

  const value = useMemo<WallpaperContextValue>(
    () => ({
      wallpaper,
      wallpaperId,
      customWallpaperSlots,
      customWallpaperCount,
      canUploadMoreCustomWallpapers,
      maskOpacity,
      maskColor,
      isReady,
      isUploading,
      uploadError,
      setWallpaperId,
      setMaskOpacity,
      setMaskColor,
      uploadCustomWallpaper,
      uploadCustomWallpaperFromUrl,
      removeCustomWallpaper,
    }),
    [
      canUploadMoreCustomWallpapers,
      customWallpaperCount,
      customWallpaperSlots,
      isReady,
      isUploading,
      maskColor,
      maskOpacity,
      removeCustomWallpaper,
      setMaskColor,
      setMaskOpacity,
      setWallpaperId,
      uploadCustomWallpaper,
      uploadCustomWallpaperFromUrl,
      uploadError,
      wallpaper,
      wallpaperId,
    ],
  );

  return (
    <WallpaperContext.Provider value={value}>
      {children}
    </WallpaperContext.Provider>
  );
}

export function useWallpaper(): WallpaperContextValue {
  const context = useContext(WallpaperContext);

  if (!context) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }

  return context;
}

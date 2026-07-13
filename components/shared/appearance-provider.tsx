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
import { DEFAULT_ACCENT_ID } from "@/config/accent-colors";
import { DEFAULT_APP_ICON_STYLE } from "@/config/app-icon-styles";
import { DEFAULT_GLASS_BLUR_LEVEL } from "@/config/glass-blur";
import { DEFAULT_GLASS_FILL_TRANSPARENCY } from "@/config/glass-fill";
import { DEFAULT_THEME_MODE } from "@/config/theme-modes";
import {
  applyAppearance,
  resolveDarkMode,
} from "@/lib/appearance/apply-appearance";
import { applyGlassAppearance } from "@/lib/appearance/apply-glass-blur";
import {
  readStoredGlassBlurLevel,
  readStoredGlassFillTransparency,
  writeStoredGlassBlurLevel,
  writeStoredGlassFillTransparency,
} from "@/lib/appearance/glass-blur-storage";
import {
  readStoredAccentId,
  readStoredAppIconStyle,
  readStoredThemeMode,
  writeStoredAccentId,
  writeStoredAppIconStyle,
  writeStoredThemeMode,
} from "@/lib/appearance/storage";
import type {
  AccentColorId,
  AppIconStyle,
  ThemeMode,
} from "@/types/appearance";
import type { GlassBlurLevelId } from "@/types/glass-blur";

interface AppearanceContextValue {
  themeMode: ThemeMode;
  accentId: AccentColorId;
  appIconStyle: AppIconStyle;
  glassBlurLevel: GlassBlurLevelId;
  glassFillTransparency: number;
  resolvedDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setAccentId: (id: AccentColorId) => void;
  setAppIconStyle: (style: AppIconStyle) => void;
  setGlassBlurLevel: (levelId: GlassBlurLevelId) => void;
  setGlassFillTransparency: (value: number) => void;
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

interface AppearanceProviderProps {
  children: React.ReactNode;
  initialThemeMode?: ThemeMode;
  initialAccentId?: AccentColorId;
  initialAppIconStyle?: AppIconStyle;
  initialResolvedDark?: boolean;
}

export function AppearanceProvider({
  children,
  initialThemeMode = DEFAULT_THEME_MODE,
  initialAccentId = DEFAULT_ACCENT_ID,
  initialAppIconStyle = DEFAULT_APP_ICON_STYLE,
  initialResolvedDark = false,
}: AppearanceProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(initialThemeMode);
  const [accentId, setAccentIdState] = useState<AccentColorId>(initialAccentId);
  const [appIconStyle, setAppIconStyleState] =
    useState<AppIconStyle>(initialAppIconStyle);
  const [glassBlurLevel, setGlassBlurLevelState] = useState<GlassBlurLevelId>(
    DEFAULT_GLASS_BLUR_LEVEL,
  );
  const [glassFillTransparency, setGlassFillTransparencyState] = useState(
    DEFAULT_GLASS_FILL_TRANSPARENCY,
  );
  const [resolvedDark, setResolvedDark] = useState(initialResolvedDark);

  useLayoutEffect(() => {
    const storedThemeMode = readStoredThemeMode();
    const storedAccentId = readStoredAccentId();
    const storedAppIconStyle = readStoredAppIconStyle();
    const storedGlassBlurLevel = readStoredGlassBlurLevel();
    const storedGlassFillTransparency = readStoredGlassFillTransparency();

    setThemeModeState(storedThemeMode);
    setAccentIdState(storedAccentId);
    setAppIconStyleState(storedAppIconStyle);
    setGlassBlurLevelState(storedGlassBlurLevel);
    setGlassFillTransparencyState(storedGlassFillTransparency);
    writeStoredThemeMode(storedThemeMode);
    writeStoredAccentId(storedAccentId);
    writeStoredAppIconStyle(storedAppIconStyle);
    writeStoredGlassBlurLevel(storedGlassBlurLevel);
    writeStoredGlassFillTransparency(storedGlassFillTransparency);
    applyAppearance({
      themeMode: storedThemeMode,
      accentId: storedAccentId,
      appIconStyle: storedAppIconStyle,
    });
    applyGlassAppearance(storedGlassBlurLevel, storedGlassFillTransparency);
    setResolvedDark(resolveDarkMode(storedThemeMode));
  }, []);

  useEffect(() => {
    applyAppearance({ themeMode, accentId, appIconStyle });
    setResolvedDark(resolveDarkMode(themeMode));
  }, [themeMode, accentId, appIconStyle]);

  useEffect(() => {
    if (themeMode !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyAppearance({ themeMode, accentId, appIconStyle });
      setResolvedDark(resolveDarkMode(themeMode));
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [themeMode, accentId, appIconStyle]);

  useEffect(() => {
    applyGlassAppearance(glassBlurLevel, glassFillTransparency);
  }, [glassBlurLevel, glassFillTransparency]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    writeStoredThemeMode(mode);
  }, []);

  const setAccentId = useCallback((id: AccentColorId) => {
    setAccentIdState(id);
    writeStoredAccentId(id);
  }, []);

  const setAppIconStyle = useCallback((style: AppIconStyle) => {
    setAppIconStyleState(style);
    writeStoredAppIconStyle(style);
  }, []);

  const setGlassBlurLevel = useCallback((levelId: GlassBlurLevelId) => {
    setGlassBlurLevelState(levelId);
    writeStoredGlassBlurLevel(levelId);
  }, []);

  const setGlassFillTransparency = useCallback((value: number) => {
    setGlassFillTransparencyState(value);
    writeStoredGlassFillTransparency(value);
  }, []);

  const value = useMemo<AppearanceContextValue>(
    () => ({
      themeMode,
      accentId,
      appIconStyle,
      glassBlurLevel,
      glassFillTransparency,
      resolvedDark,
      setThemeMode,
      setAccentId,
      setAppIconStyle,
      setGlassBlurLevel,
      setGlassFillTransparency,
    }),
    [
      accentId,
      appIconStyle,
      glassBlurLevel,
      glassFillTransparency,
      resolvedDark,
      setAccentId,
      setAppIconStyle,
      setGlassBlurLevel,
      setGlassFillTransparency,
      setThemeMode,
      themeMode,
    ],
  );

  return (
    <AppearanceContext.Provider value={value}>
      {children}
    </AppearanceContext.Provider>
  );
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext);

  if (!context) {
    throw new Error("useAppearance must be used within AppearanceProvider");
  }

  return context;
}

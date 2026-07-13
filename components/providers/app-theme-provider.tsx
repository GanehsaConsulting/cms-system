"use client";

import { AppearanceProvider } from "@/components/shared/appearance-provider";
import type { ServerAppearance } from "@/lib/appearance/cookies";

interface AppThemeProviderProps {
  children: React.ReactNode;
  initialAppearance: ServerAppearance;
}

export function AppThemeProvider({
  children,
  initialAppearance,
}: AppThemeProviderProps) {
  return (
    <AppearanceProvider
      initialThemeMode={initialAppearance.themeMode}
      initialAccentId={initialAppearance.accentId}
      initialResolvedDark={initialAppearance.resolvedDark}
    >
      {children}
    </AppearanceProvider>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { AppearanceDrawer } from "@/components/shared/appearance-drawer";

interface AppearanceDrawerContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openAppearance: () => void;
}

const AppearanceDrawerContext =
  createContext<AppearanceDrawerContextValue | null>(null);

interface AppearanceDrawerProviderProps {
  children: React.ReactNode;
}

export function AppearanceDrawerProvider({
  children,
}: AppearanceDrawerProviderProps) {
  const [open, setOpen] = useState(false);

  const openAppearance = useCallback(() => {
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openAppearance,
    }),
    [open, openAppearance],
  );

  return (
    <AppearanceDrawerContext.Provider value={value}>
      {children}
      <AppearanceDrawer />
    </AppearanceDrawerContext.Provider>
  );
}

export function useAppearanceDrawer(): AppearanceDrawerContextValue {
  const context = useContext(AppearanceDrawerContext);

  if (!context) {
    throw new Error(
      "useAppearanceDrawer must be used within AppearanceDrawerProvider",
    );
  }

  return context;
}

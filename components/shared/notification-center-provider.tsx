"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NotificationCenterDrawer } from "@/components/shared/notification-center-drawer";

interface NotificationCenterContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openNotificationCenter: () => void;
}

const NotificationCenterContext =
  createContext<NotificationCenterContextValue | null>(null);

interface NotificationCenterProviderProps {
  children: React.ReactNode;
}

export function NotificationCenterProvider({
  children,
}: NotificationCenterProviderProps) {
  const [open, setOpen] = useState(false);

  const openNotificationCenter = useCallback(() => {
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openNotificationCenter,
    }),
    [open, openNotificationCenter],
  );

  return (
    <NotificationCenterContext.Provider value={value}>
      {children}
      <NotificationCenterDrawer />
    </NotificationCenterContext.Provider>
  );
}

export function useNotificationCenter(): NotificationCenterContextValue {
  const context = useContext(NotificationCenterContext);

  if (!context) {
    throw new Error(
      "useNotificationCenter must be used within NotificationCenterProvider",
    );
  }

  return context;
}

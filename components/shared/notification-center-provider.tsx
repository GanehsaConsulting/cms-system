"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { NotificationCenterDrawer } from "@/components/shared/notification-center-drawer";
import { MOCK_NOTIFICATIONS } from "@/config/notifications";
import type { CmsNotification } from "@/types/notification";

interface NotificationCenterContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openNotificationCenter: () => void;
  notifications: CmsNotification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markUnread: (id: string) => void;
  markAllRead: () => void;
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
  const [notifications, setNotifications] =
    useState<CmsNotification[]>(MOCK_NOTIFICATIONS);

  const openNotificationCenter = useCallback(() => {
    setOpen(true);
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  }, []);

  const markUnread = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, read: false } : item,
      ),
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => (item.read ? item : { ...item, read: true })),
    );
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openNotificationCenter,
      notifications,
      unreadCount,
      markRead,
      markUnread,
      markAllRead,
    }),
    [
      open,
      openNotificationCenter,
      notifications,
      unreadCount,
      markRead,
      markUnread,
      markAllRead,
    ],
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

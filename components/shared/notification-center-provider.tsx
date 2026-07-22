"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { NotificationCenterDrawer } from "@/components/shared/notification-center-drawer";
import { useBrand } from "@/components/shared/brand-provider";
import {
  getBrandNotificationsAction,
  markAllNotificationsReadAction,
  markNotificationReadAction,
  markNotificationUnreadAction,
} from "@/lib/actions/activity";
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
  refreshNotifications: () => Promise<void>;
}

const NotificationCenterContext =
  createContext<NotificationCenterContextValue | null>(null);

interface NotificationCenterProviderProps {
  children: React.ReactNode;
  userId?: string;
}

export function NotificationCenterProvider({
  children,
  userId,
}: NotificationCenterProviderProps) {
  const { activeBrandId } = useBrand();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<CmsNotification[]>([]);

  const refreshNotifications = useCallback(async () => {
    if (!userId || !activeBrandId) {
      setNotifications([]);
      return;
    }

    const result = await getBrandNotificationsAction();
    if (result.success) {
      setNotifications(result.notifications);
    }
  }, [userId, activeBrandId]);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    if (!open) {
      return;
    }
    void refreshNotifications();
  }, [open, refreshNotifications]);

  const openNotificationCenter = useCallback(() => {
    setOpen(true);
  }, []);

  const markRead = useCallback(
    (id: string) => {
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: true } : item,
        ),
      );
      void markNotificationReadAction(id);
    },
    [],
  );

  const markUnread = useCallback(
    (id: string) => {
      setNotifications((current) =>
        current.map((item) =>
          item.id === id ? { ...item, read: false } : item,
        ),
      );
      void markNotificationUnreadAction(id);
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((current) =>
      current.map((item) => (item.read ? item : { ...item, read: true })),
    );
    void markAllNotificationsReadAction();
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
      refreshNotifications,
    }),
    [
      open,
      openNotificationCenter,
      notifications,
      unreadCount,
      markRead,
      markUnread,
      markAllRead,
      refreshNotifications,
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

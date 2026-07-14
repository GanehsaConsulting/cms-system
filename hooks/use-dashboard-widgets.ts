"use client";

import { useCallback, useEffect, useState } from "react";
import {
  createDefaultDashboardWidgetVisibility,
  type DashboardWidgetId,
} from "@/config/dashboard";
import {
  readStoredDashboardWidgetVisibility,
  writeStoredDashboardWidgetVisibility,
  type DashboardWidgetVisibility,
} from "@/lib/dashboard/storage";

export function useDashboardWidgets() {
  const [visibility, setVisibility] = useState<DashboardWidgetVisibility>(
    createDefaultDashboardWidgetVisibility,
  );
  const [hydrated, setHydrated] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    setVisibility(readStoredDashboardWidgetVisibility());
    setHydrated(true);
  }, []);

  const isVisible = useCallback(
    (id: DashboardWidgetId) => visibility[id] !== false,
    [visibility],
  );

  const setWidgetVisible = useCallback(
    (id: DashboardWidgetId, visible: boolean) => {
      setVisibility((current) => {
        const next = { ...current, [id]: visible };
        writeStoredDashboardWidgetVisibility(next);
        return next;
      });
    },
    [],
  );

  const resetWidgets = useCallback(() => {
    const defaults = createDefaultDashboardWidgetVisibility();
    writeStoredDashboardWidgetVisibility(defaults);
    setVisibility(defaults);
  }, []);

  return {
    visibility,
    hydrated,
    editOpen,
    setEditOpen,
    isVisible,
    setWidgetVisible,
    resetWidgets,
  };
}

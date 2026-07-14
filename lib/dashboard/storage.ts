import {
  createDefaultDashboardWidgetVisibility,
  DASHBOARD_WIDGET_IDS,
  type DashboardWidgetId,
} from "@/config/dashboard";

export const DASHBOARD_WIDGETS_STORAGE_KEY = "cms:dashboard-widgets";

export type DashboardWidgetVisibility = Record<DashboardWidgetId, boolean>;

export function readStoredDashboardWidgetVisibility(): DashboardWidgetVisibility {
  const defaults = createDefaultDashboardWidgetVisibility();

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const raw = window.localStorage.getItem(DASHBOARD_WIDGETS_STORAGE_KEY);
    if (!raw) {
      return defaults;
    }

    const parsed = JSON.parse(raw) as Partial<Record<string, boolean>>;
    const next = { ...defaults };

    for (const id of DASHBOARD_WIDGET_IDS) {
      if (typeof parsed[id] === "boolean") {
        next[id] = parsed[id];
      }
    }

    return next;
  } catch {
    return defaults;
  }
}

export function writeStoredDashboardWidgetVisibility(
  visibility: DashboardWidgetVisibility,
): void {
  window.localStorage.setItem(
    DASHBOARD_WIDGETS_STORAGE_KEY,
    JSON.stringify(visibility),
  );
}

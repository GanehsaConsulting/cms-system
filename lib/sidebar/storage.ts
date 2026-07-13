import { SIDEBAR_OPEN_STORAGE_KEY } from "@/config/sidebar";

export function readStoredSidebarOpen(defaultOpen = true): boolean {
  if (typeof window === "undefined") {
    return defaultOpen;
  }

  const stored = window.localStorage.getItem(SIDEBAR_OPEN_STORAGE_KEY);
  if (stored === null) {
    return defaultOpen;
  }

  return stored === "true";
}

export function writeStoredSidebarOpen(open: boolean): void {
  window.localStorage.setItem(SIDEBAR_OPEN_STORAGE_KEY, String(open));
}

import { ACTIVE_BRAND_STORAGE_KEY } from "@/config/brand-context";

export function readStoredActiveBrandId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_BRAND_STORAGE_KEY);
}

export function writeStoredActiveBrandId(id: string): void {
  window.localStorage.setItem(ACTIVE_BRAND_STORAGE_KEY, id);
}

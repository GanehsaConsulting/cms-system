import {
  ACTIVE_BRAND_COOKIE_KEY,
  ACTIVE_BRAND_COOKIE_MAX_AGE_SECONDS,
  ACTIVE_BRAND_STORAGE_KEY,
} from "@/config/brand-context";

export function readStoredActiveBrandId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACTIVE_BRAND_STORAGE_KEY);
}

export function writeStoredActiveBrandId(id: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACTIVE_BRAND_STORAGE_KEY, id);
  document.cookie = `${ACTIVE_BRAND_COOKIE_KEY}=${encodeURIComponent(id)}; path=/; max-age=${ACTIVE_BRAND_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`;
}

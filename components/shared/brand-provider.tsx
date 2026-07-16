"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  contentNavLinks,
  mainNavLinks,
  utilityNavLinks,
  type NavLink,
} from "@/config/nav";
import {
  filterNavLinksByBrand,
  resolveActiveBrand,
} from "@/lib/brands/nav";
import {
  readStoredActiveBrandId,
  writeStoredActiveBrandId,
} from "@/lib/brands/storage";
import type { Brand } from "@/types/brand";

interface BrandContextValue {
  brands: Brand[];
  activeBrand: Brand | null;
  /** Brand used for feature gating — `null` means unrestricted (Super Admin). */
  featureBrand: Brand | null;
  activeBrandId: string | null;
  setActiveBrandId: (id: string) => void;
  mainNavLinks: NavLink[];
  contentNavLinks: NavLink[];
  utilityNavLinks: NavLink[];
  userName: string | null;
  canAccessSettings: boolean;
  canAccessAllPages: boolean;
  switcherOpen: boolean;
  openSwitcher: () => void;
  closeSwitcher: () => void;
  setSwitcherOpen: (open: boolean) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

interface BrandProviderProps {
  brands: Brand[];
  userName?: string | null;
  canAccessSettings?: boolean;
  canAccessAllPages?: boolean;
  children: React.ReactNode;
}

export function BrandProvider({
  brands,
  userName = null,
  canAccessSettings = false,
  canAccessAllPages = false,
  children,
}: BrandProviderProps) {
  const [activeBrandId, setActiveBrandIdState] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedId = readStoredActiveBrandId();
    const resolved = resolveActiveBrand(brands, storedId);
    setActiveBrandIdState(resolved?.id ?? null);
    setHydrated(true);
  }, [brands]);

  const activeBrand = useMemo(() => {
    if (!hydrated) {
      return resolveActiveBrand(brands, null);
    }

    return (
      brands.find((brand) => brand.id === activeBrandId) ??
      resolveActiveBrand(brands, null)
    );
  }, [activeBrandId, brands, hydrated]);

  const featureBrand = canAccessAllPages ? null : activeBrand;

  const setActiveBrandId = useCallback(
    (id: string) => {
      const brand = brands.find((item) => item.id === id);
      if (!brand || brand.status !== "active") {
        return;
      }

      writeStoredActiveBrandId(id);
      setActiveBrandIdState(id);
    },
    [brands],
  );

  const filteredMainNav = useMemo(() => {
    if (canAccessAllPages) {
      return mainNavLinks;
    }
    return filterNavLinksByBrand(mainNavLinks, activeBrand);
  }, [activeBrand, canAccessAllPages]);

  const filteredContentNav = useMemo(() => {
    if (canAccessAllPages) {
      return contentNavLinks;
    }
    return filterNavLinksByBrand(contentNavLinks, activeBrand);
  }, [activeBrand, canAccessAllPages]);

  const filteredUtilityNav = useMemo(
    () => (canAccessSettings ? utilityNavLinks : []),
    [canAccessSettings],
  );

  const value = useMemo(
    () => ({
      brands,
      activeBrand,
      featureBrand,
      activeBrandId: activeBrand?.id ?? null,
      setActiveBrandId,
      mainNavLinks: filteredMainNav,
      contentNavLinks: filteredContentNav,
      utilityNavLinks: filteredUtilityNav,
      userName,
      canAccessSettings,
      canAccessAllPages,
      switcherOpen,
      openSwitcher: () => setSwitcherOpen(true),
      closeSwitcher: () => setSwitcherOpen(false),
      setSwitcherOpen,
    }),
    [
      activeBrand,
      brands,
      canAccessAllPages,
      canAccessSettings,
      featureBrand,
      filteredContentNav,
      filteredMainNav,
      filteredUtilityNav,
      setActiveBrandId,
      switcherOpen,
      userName,
    ],
  );

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within BrandProvider.");
  }

  return context;
}

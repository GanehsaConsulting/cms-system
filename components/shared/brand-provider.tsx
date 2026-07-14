"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { contentNavLinks, mainNavLinks } from "@/config/nav";
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
  activeBrandId: string | null;
  setActiveBrandId: (id: string) => void;
  mainNavLinks: typeof import("@/config/nav").mainNavLinks;
  contentNavLinks: typeof import("@/config/nav").contentNavLinks;
  switcherOpen: boolean;
  openSwitcher: () => void;
  closeSwitcher: () => void;
  setSwitcherOpen: (open: boolean) => void;
}

const BrandContext = createContext<BrandContextValue | null>(null);

interface BrandProviderProps {
  brands: Brand[];
  children: React.ReactNode;
}

export function BrandProvider({ brands, children }: BrandProviderProps) {
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

  const filteredMainNav = useMemo(
    () => filterNavLinksByBrand(mainNavLinks, activeBrand),
    [activeBrand],
  );

  const filteredContentNav = useMemo(
    () => filterNavLinksByBrand(contentNavLinks, activeBrand),
    [activeBrand],
  );

  const value = useMemo(
    () => ({
      brands,
      activeBrand,
      activeBrandId: activeBrand?.id ?? null,
      setActiveBrandId,
      mainNavLinks: filteredMainNav,
      contentNavLinks: filteredContentNav,
      switcherOpen,
      openSwitcher: () => setSwitcherOpen(true),
      closeSwitcher: () => setSwitcherOpen(false),
      setSwitcherOpen,
    }),
    [
      activeBrand,
      brands,
      filteredContentNav,
      filteredMainNav,
      setActiveBrandId,
      switcherOpen,
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

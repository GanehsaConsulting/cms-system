"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
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
import { getBrandSwitchNavigationPath } from "@/lib/brands/workspace-path";
import { notifySuccess } from "@/lib/notify/action-toast";
import type { Brand } from "@/types/brand";

interface BrandContextValue {
  brands: Brand[];
  activeBrand: Brand | null;
  /** Brand used for feature gating — always the active brand's enabled modules. */
  featureBrand: Brand | null;
  activeBrandId: string | null;
  setActiveBrandId: (id: string) => void;
  /** True while `router.refresh()` / navigation is in flight after a brand switch. */
  isSwitchingBrand: boolean;
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
  const router = useRouter();
  const pathname = usePathname();
  const [isSwitchingBrand, startBrandSwitch] = useTransition();
  const [activeBrandId, setActiveBrandIdState] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storedId = readStoredActiveBrandId();
    const resolved = resolveActiveBrand(brands, storedId);
    const resolvedId = resolved?.id ?? null;

    if (resolvedId) {
      writeStoredActiveBrandId(resolvedId);
    }

    setActiveBrandIdState(resolvedId);
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

  const featureBrand = activeBrand;

  const setActiveBrandId = useCallback(
    (id: string) => {
      const brand = brands.find((item) => item.id === id);
      if (!brand || brand.status !== "active") {
        return;
      }

      if (id === activeBrandId) {
        return;
      }

      writeStoredActiveBrandId(id);
      setActiveBrandIdState(id);
      notifySuccess(`Switched to ${brand.name}.`);

      const navigateTo = getBrandSwitchNavigationPath(pathname, brand);

      startBrandSwitch(() => {
        if (navigateTo && navigateTo !== pathname) {
          router.push(navigateTo);
          return;
        }
        router.refresh();
      });
    },
    [activeBrandId, brands, pathname, router],
  );

  const openSwitcher = useCallback(() => {
    if (isSwitchingBrand) {
      return;
    }
    setSwitcherOpen(true);
  }, [isSwitchingBrand]);

  const closeSwitcher = useCallback(() => {
    setSwitcherOpen(false);
  }, []);

  const filteredMainNav = useMemo(
    () => filterNavLinksByBrand(mainNavLinks, activeBrand),
    [activeBrand],
  );

  const filteredContentNav = useMemo(
    () => filterNavLinksByBrand(contentNavLinks, activeBrand),
    [activeBrand],
  );

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
      isSwitchingBrand,
      mainNavLinks: filteredMainNav,
      contentNavLinks: filteredContentNav,
      utilityNavLinks: filteredUtilityNav,
      userName,
      canAccessSettings,
      canAccessAllPages,
      switcherOpen,
      openSwitcher,
      closeSwitcher,
      setSwitcherOpen,
    }),
    [
      activeBrand,
      brands,
      canAccessAllPages,
      canAccessSettings,
      closeSwitcher,
      featureBrand,
      filteredContentNav,
      filteredMainNav,
      filteredUtilityNav,
      isSwitchingBrand,
      openSwitcher,
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

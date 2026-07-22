"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CmsPageHeaderActionsContextValue {
  actions: ReactNode;
  setActions: (actions: ReactNode) => void;
  subnav: ReactNode;
  setSubnav: (subnav: ReactNode) => void;
}

const CmsPageHeaderActionsContext =
  createContext<CmsPageHeaderActionsContextValue | null>(null);

export function CmsPageHeaderActionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [actions, setActionsState] = useState<ReactNode>(null);
  const [subnav, setSubnavState] = useState<ReactNode>(null);
  const setActions = useCallback((next: ReactNode) => {
    setActionsState(next);
  }, []);
  const setSubnav = useCallback((next: ReactNode) => {
    setSubnavState(next);
  }, []);

  const value = useMemo(
    () => ({ actions, setActions, subnav, setSubnav }),
    [actions, setActions, subnav, setSubnav],
  );

  return (
    <CmsPageHeaderActionsContext.Provider value={value}>
      {children}
    </CmsPageHeaderActionsContext.Provider>
  );
}

function useCmsPageHeaderActionsContext() {
  const context = useContext(CmsPageHeaderActionsContext);
  if (!context) {
    throw new Error(
      "Cms page header actions require CmsPageHeaderActionsProvider",
    );
  }
  return context;
}

/** Renders actions registered by the active page (filters / toolbars). */
export function CmsPageHeaderActionsSlot() {
  const { actions } = useCmsPageHeaderActionsContext();
  if (!actions) {
    return null;
  }
  return <div className="shrink-0">{actions}</div>;
}

/**
 * Registers header actions from a list view so they sit beside the title
 * in the stable section header.
 */
export function CmsPageHeaderActions({ children }: { children: ReactNode }) {
  const { setActions } = useCmsPageHeaderActionsContext();

  useLayoutEffect(() => {
    setActions(children);
    return () => setActions(null);
  }, [children, setActions]);

  return null;
}

/** Renders subnav (tabs) registered below the title row in the section header. */
export function CmsPageHeaderSubnavSlot() {
  const { subnav } = useCmsPageHeaderActionsContext();
  if (!subnav) {
    return null;
  }
  return <div className="w-full">{subnav}</div>;
}

/** Registers header subnav from a list view (e.g. Activity / Promo tabs). */
export function CmsPageHeaderSubnav({ children }: { children: ReactNode }) {
  const { setSubnav } = useCmsPageHeaderActionsContext();

  useLayoutEffect(() => {
    setSubnav(children);
    return () => setSubnav(null);
  }, [children, setSubnav]);

  return null;
}

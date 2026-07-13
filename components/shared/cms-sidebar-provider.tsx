"use client";

import { useCallback, useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  readStoredSidebarOpen,
  writeStoredSidebarOpen,
} from "@/lib/sidebar/storage";

interface CmsSidebarProviderProps extends React.ComponentProps<typeof SidebarProvider> {
  children: React.ReactNode;
}

export function CmsSidebarProvider({
  children,
  ...props
}: CmsSidebarProviderProps) {
  const [open, setOpenState] = useState(true);

  useEffect(() => {
    setOpenState(readStoredSidebarOpen(true));
  }, []);

  const setOpen = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setOpenState((previous) => {
      const next = typeof value === "function" ? value(previous) : value;
      writeStoredSidebarOpen(next);
      return next;
    });
  }, []);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen} {...props}>
      {children}
    </SidebarProvider>
  );
}

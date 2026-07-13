"use client";

import { useEffect, useState } from "react";
import { CaretDownIcon } from "@/lib/icons";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { RADIUS_DEEP } from "@/config/shape";
import { cn } from "@/lib/utils";

const STORAGE_KEY_PREFIX = "cms:sidebar-nav-group:";

interface SidebarNavGroupProps {
  id: string;
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function SidebarNavGroup({
  id,
  label,
  defaultOpen = true,
  children,
}: SidebarNavGroupProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
      if (stored === "0") {
        setOpen(false);
      } else if (stored === "1") {
        setOpen(true);
      }
    } catch {
      // Ignore storage errors (private mode, etc.)
    }
    setHydrated(true);
  }, [id]);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${id}`,
        nextOpen ? "1" : "0",
      );
    } catch {
      // Ignore storage errors
    }
  }

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange}>
      <SidebarGroup className="p-0">
        <CollapsibleTrigger
          className={cn(
            RADIUS_DEEP,
            "group/nav-label flex h-7 w-full items-center justify-between gap-2 px-2 text-left",
            "text-muted-foreground text-xs font-medium tracking-normal",
            "outline-none transition-colors hover:bg-black/5 hover:text-foreground",
            "focus-visible:ring-2 focus-visible:ring-ring/50",
            "dark:hover:bg-white/8",
            !hydrated && "pointer-events-none",
          )}
          aria-expanded={open}
        >
          <span className="min-w-0 truncate">{label}</span>
          <CaretDownIcon
            className={cn(
              "size-3 shrink-0 opacity-0 transition-[opacity,transform] duration-200",
              "group-hover/nav-label:opacity-70 group-focus-visible/nav-label:opacity-70",
              !open && "-rotate-90",
            )}
            aria-hidden
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0">
          <SidebarGroupContent className="pt-0.5">
            {children}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

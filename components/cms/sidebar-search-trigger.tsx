"use client";

import { MagnifyingGlassIcon } from "@/lib/icons";
import {
  LIST_TOOLBAR_CONTROL_FOCUS,
  LIST_TOOLBAR_CONTROL_HEIGHT,
  LIST_TOOLBAR_CONTROL_SURFACE,
  LIST_SEARCH_SHORTCUT_CLASS,
} from "@/config/list-toolbar";
import { cn } from "@/lib/utils";

interface SidebarSearchTriggerProps {
  onOpen: () => void;
  className?: string;
}

export function SidebarSearchTrigger({
  onOpen,
  className,
}: SidebarSearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        LIST_TOOLBAR_CONTROL_HEIGHT,
        LIST_TOOLBAR_CONTROL_SURFACE,
        LIST_TOOLBAR_CONTROL_FOCUS,
        "flex w-full items-center gap-2 px-2.5 text-left text-muted-foreground text-sm",
        className,
      )}
      aria-label="Search"
    >
      <MagnifyingGlassIcon className="size-3.5 shrink-0 opacity-70" />
      <span className="min-w-0 flex-1 truncate">Search</span>
      <kbd className={LIST_SEARCH_SHORTCUT_CLASS}>⌘/</kbd>
    </button>
  );
}

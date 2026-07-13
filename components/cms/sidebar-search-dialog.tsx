"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SidebarSearchResultItem } from "@/components/cms/sidebar-search-result-item";
import { useAppearanceDrawer } from "@/components/shared/appearance-drawer-provider";
import {
  CmsDialog,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@/lib/icons";
import {
  filterSidebarSearchItems,
  type SidebarSearchItem,
} from "@/lib/sidebar/search";
import { cn } from "@/lib/utils";

interface SidebarSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SidebarSearchDialog({
  open,
  onOpenChange,
}: SidebarSearchDialogProps) {
  const router = useRouter();
  const { openAppearance } = useAppearanceDrawer();
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => filterSidebarSearchItems(query), [query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function handleSelect(item: SidebarSearchItem) {
    onOpenChange(false);

    if (item.action === "appearance") {
      openAppearance();
      return;
    }

    if (item.href) {
      router.push(item.href);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0 ? 0 : (index + 1) % results.length,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length === 0
          ? 0
          : (index - 1 + results.length) % results.length,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const item = results[activeIndex];
      if (item) {
        handleSelect(item);
      }
    }
  }

  return (
    <CmsDialog open={open} onOpenChange={onOpenChange}>
      <CmsDialogContent
        showCloseButton={false}
        size="md"
        className="top-[min(20vh,8rem)] flex translate-y-0! flex-col"
      >
        <CmsDialogHeader className="sr-only border-0 p-0">
          <CmsDialogTitle>Search</CmsDialogTitle>
          <CmsDialogDescription>
            Jump to a page or open Appearance settings.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <div className="flex items-center gap-2 border-(--separator) border-b px-3">
          <MagnifyingGlassIcon
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search"
            aria-controls={listId}
            aria-autocomplete="list"
            className={cn(
              "h-11 border-0 bg-transparent px-0 shadow-none",
              "focus-visible:border-0 focus-visible:ring-0",
              "dark:bg-transparent",
            )}
          />
        </div>

        <div
          id={listId}
          role="listbox"
          aria-label="Search results"
          className="max-h-[min(50vh,22rem)] overflow-y-auto p-2"
        >
          {results.length > 0 ? (
            <ul className="space-y-0.5">
              {results.map((item, index) => (
                <li key={item.id} role="option" aria-selected={index === activeIndex}>
                  <SidebarSearchResultItem
                    item={item}
                    active={index === activeIndex}
                    onSelect={handleSelect}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-2 py-8 text-center text-muted-foreground text-sm">
              No results for “{query.trim()}”
            </p>
          )}
        </div>
      </CmsDialogContent>
    </CmsDialog>
  );
}

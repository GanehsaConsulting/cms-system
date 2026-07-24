"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { CmsImagePickerGrid } from "@/components/shared/cms-image-picker-grid";
import { CmsImagePickerTabs } from "@/components/shared/cms-image-picker-tabs";
import { CmsImagePickerUrlPanel } from "@/components/shared/cms-image-picker-url-panel";
import { CmsAlert } from "@/components/shared/cms-alert";
import {
  CmsDialog,
  CmsDialogBody,
  CmsDialogContent,
  CmsDialogDescription,
  CmsDialogFooter,
  CmsDialogHeader,
  CmsDialogTitle,
} from "@/components/shared/cms-dialog";
import { CmsListSearch } from "@/components/shared/cms-list-search";
import { Button } from "@/components/ui/button";
import { getMediaImagePickerDataAction } from "@/lib/actions/media-image-picker";
import { notifyError } from "@/lib/notify/action-toast";
import type {
  CmsImagePickerItem,
  CmsImagePickerTab,
} from "@/types/cms-image-picker";

interface CmsImagePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** URLs already on the form — shown as disabled in the grid. */
  existingUrls: string[];
  maxSelectable: number;
  onAdd: (urls: string[], meta?: { addedFileNames: string[] }) => void;
  /** Initial tab when the dialog opens. */
  initialTab?: CmsImagePickerTab;
}

function filterItems(items: CmsImagePickerItem[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return items;
  }

  return items.filter(
    (item) =>
      item.filename.toLowerCase().includes(normalized) ||
      item.url.toLowerCase().includes(normalized),
  );
}

export function CmsImagePickerDialog({
  open,
  onOpenChange,
  existingUrls,
  maxSelectable,
  onAdd,
  initialTab = "shared",
}: CmsImagePickerDialogProps) {
  const [tab, setTab] = useState<CmsImagePickerTab>(initialTab);
  const [query, setQuery] = useState("");
  const [shared, setShared] = useState<CmsImagePickerItem[]>([]);
  const [inUse, setInUse] = useState<CmsImagePickerItem[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const disabledUrls = useMemo(() => new Set(existingUrls), [existingUrls]);
  const selectedSet = useMemo(() => new Set(selectedUrls), [selectedUrls]);
  const remainingSlots = Math.max(0, maxSelectable - selectedUrls.length);

  const visibleItems = useMemo(() => {
    const source = tab === "in-use" ? inUse : shared;
    return filterItems(source, query);
  }, [inUse, query, shared, tab]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setTab(initialTab);
    setQuery("");
    setSelectedUrls([]);
    setLoadError(null);

    startTransition(async () => {
      const result = await getMediaImagePickerDataAction();
      if (!result.success) {
        setLoadError(result.error);
        notifyError(result.error || "Failed to load media images.");
        return;
      }

      setShared(result.shared);
      setInUse(result.inUse);
    });
  }, [initialTab, open]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function toggleItem(item: CmsImagePickerItem) {
    if (disabledUrls.has(item.url)) {
      return;
    }

    setSelectedUrls((current) => {
      if (current.includes(item.url)) {
        return current.filter((url) => url !== item.url);
      }

      if (current.length >= maxSelectable) {
        return current;
      }

      return [...current, item.url];
    });
  }

  function handleConfirmLibrary() {
    if (selectedUrls.length === 0) {
      return;
    }

    const nameByUrl = new Map(
      [...shared, ...inUse].map((item) => [item.url, item.filename] as const),
    );

    onAdd(selectedUrls, {
      addedFileNames: selectedUrls.map(
        (url) => nameByUrl.get(url) ?? "library-image",
      ),
    });
    onOpenChange(false);
  }

  function handleAddUrl(url: string) {
    if (disabledUrls.has(url) || selectedUrls.includes(url)) {
      notifyError("That image is already added.");
      return;
    }

    if (maxSelectable <= 0) {
      notifyError("Image limit reached.");
      return;
    }

    onAdd([url], { addedFileNames: ["url-image"] });
    onOpenChange(false);
  }

  return (
    <CmsDialog open={open} onOpenChange={handleOpenChange}>
      <CmsDialogContent size="xl" showCloseButton>
        <CmsDialogHeader>
          <CmsDialogTitle>Add images</CmsDialogTitle>
          <CmsDialogDescription>
            Choose from Shared Files & Media, reuse In-use images, or paste a
            URL. You can add up to {maxSelectable} more.
          </CmsDialogDescription>
        </CmsDialogHeader>

        <CmsDialogBody className="space-y-4">
          <CmsImagePickerTabs value={tab} onChange={setTab} />

          {tab === "url" ? (
            <CmsImagePickerUrlPanel
              remainingSlots={maxSelectable}
              disabled={isPending}
              onAdd={handleAddUrl}
            />
          ) : (
            <>
              <CmsListSearch
                inputId="cms-image-picker-search"
                value={query}
                placeholder={
                  tab === "shared"
                    ? "Search shared images…"
                    : "Search in-use images…"
                }
                ariaLabel="Search images"
                enableShortcut={false}
                onChange={setQuery}
              />

              {loadError ? (
                <CmsAlert variant="error" size="sm" message={loadError} />
              ) : null}

              {isPending && shared.length === 0 && inUse.length === 0 ? (
                <p className="text-muted-foreground text-sm">Loading images…</p>
              ) : (
                <CmsImagePickerGrid
                  items={visibleItems}
                  selectedUrls={selectedSet}
                  disabledUrls={disabledUrls}
                  onToggle={toggleItem}
                  emptyLabel={
                    tab === "shared"
                      ? "No shared images yet. Upload files in Files & Media."
                      : "No in-use images for this brand yet."
                  }
                />
              )}

              {selectedUrls.length > 0 ? (
                <p className="text-muted-foreground text-[11px] tabular-nums">
                  {selectedUrls.length} selected
                  {remainingSlots === 0 ? " · limit reached" : null}
                </p>
              ) : null}
            </>
          )}
        </CmsDialogBody>

        {tab !== "url" ? (
          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={selectedUrls.length === 0}
              onClick={handleConfirmLibrary}
            >
              Add selected
              {selectedUrls.length > 0 ? ` (${selectedUrls.length})` : ""}
            </Button>
          </CmsDialogFooter>
        ) : (
          <CmsDialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </CmsDialogFooter>
        )}
      </CmsDialogContent>
    </CmsDialog>
  );
}

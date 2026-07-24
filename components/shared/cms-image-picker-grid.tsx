"use client";

import Image from "next/image";
import { CheckIcon } from "@/lib/icons";
import { RADIUS_DEEP } from "@/config/shape";
import type { CmsImagePickerItem } from "@/types/cms-image-picker";
import { cn } from "@/lib/utils";

interface CmsImagePickerGridProps {
  items: CmsImagePickerItem[];
  selectedUrls: Set<string>;
  disabledUrls: Set<string>;
  onToggle: (item: CmsImagePickerItem) => void;
  emptyLabel: string;
}

export function CmsImagePickerGrid({
  items,
  selectedUrls,
  disabledUrls,
  onToggle,
  emptyLabel,
}: CmsImagePickerGridProps) {
  if (items.length === 0) {
    return (
      <div
        className={cn(
          RADIUS_DEEP,
          "flex min-h-40 items-center justify-center border border-dashed border-border bg-muted/30 px-4 text-center text-sm text-muted-foreground",
        )}
      >
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {items.map((item) => {
        const alreadyAdded = disabledUrls.has(item.url);
        const selected = selectedUrls.has(item.url);
        const disabled = alreadyAdded;

        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            aria-label={
              alreadyAdded
                ? `${item.filename} (already added)`
                : selected
                  ? `Deselect ${item.filename}`
                  : `Select ${item.filename}`
            }
            title={item.filename}
            onClick={() => onToggle(item)}
            className={cn(
              RADIUS_DEEP,
              "group relative aspect-square overflow-hidden bg-muted outline-none",
              "ring-1 ring-black/8 transition-[box-shadow,opacity] dark:ring-white/12",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              selected && "ring-2 ring-primary",
              disabled && "cursor-not-allowed opacity-45",
            )}
          >
            <Image
              src={item.url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
            {selected || alreadyAdded ? (
              <span
                className={cn(
                  "absolute top-1.5 right-1.5 flex size-5 items-center justify-center rounded-full",
                  alreadyAdded
                    ? "bg-muted-foreground/80 text-white"
                    : "bg-primary text-primary-foreground",
                )}
              >
                <CheckIcon className="size-3" />
              </span>
            ) : null}
            <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-black/55 px-1.5 py-1 text-[9px] text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.filename}
            </span>
          </button>
        );
      })}
    </div>
  );
}

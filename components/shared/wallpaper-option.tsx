"use client";

import { CheckIcon, TrashIcon } from "@/lib/icons";
import { RADIUS_DEEP } from "@/config/shape";
import { getWallpaperPreviewStyle } from "@/lib/wallpaper/resolve-wallpaper";
import type { Wallpaper } from "@/types/wallpaper";
import { cn } from "@/lib/utils";

interface WallpaperOptionProps {
  wallpaper: Wallpaper;
  selected: boolean;
  onSelect: (id: Wallpaper["id"]) => void;
  onRemove?: () => void;
}

export function WallpaperOption({
  wallpaper,
  selected,
  onSelect,
  onRemove,
}: WallpaperOptionProps) {
  return (
    <div
      className={cn(
        RADIUS_DEEP,
        "group relative overflow-hidden ring-1 ring-foreground/10 transition-all hover:ring-foreground/20",
        selected && "ring-2 ring-foreground/40",
      )}
    >
      <button
        type="button"
        onClick={() => onSelect(wallpaper.id)}
        aria-pressed={selected}
        aria-label={`Wallpaper ${wallpaper.label}`}
        className="w-full text-left"
      >
        <div
          className="aspect-4/3 w-full"
          style={getWallpaperPreviewStyle(wallpaper)}
        />
        <div className="flex items-center justify-between gap-2 border-(--separator) border-t px-2.5 py-2">
          <span className="truncate font-medium text-xs">
            {wallpaper.label}
          </span>
          {selected ? (
            <CheckIcon className="size-3.5 shrink-0 text-foreground" />
          ) : null}
        </div>
      </button>

      {onRemove ? (
        <button
          type="button"
          aria-label={`Hapus ${wallpaper.label}`}
          onClick={() => void onRemove()}
          className={cn(
            "absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full",
            "bg-black/45 text-white shadow-sm ring-1 ring-white/20 backdrop-blur-sm",
            "opacity-0 transition-opacity hover:bg-black/60 group-focus-within:opacity-100 group-hover:opacity-100",
            "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
          )}
        >
          <TrashIcon className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

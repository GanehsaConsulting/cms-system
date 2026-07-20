"use client";

import { useRef } from "react";
import { UploadSimpleIcon } from "@/lib/icons";
import { CmsAlert } from "@/components/shared/cms-alert";
import { useWallpaper } from "@/components/shared/wallpaper-provider";
import {
  SETTINGS_ROW,
  SETTINGS_ROW_DIVIDER,
} from "@/config/settings-layout";
import { MAX_CUSTOM_WALLPAPERS } from "@/config/wallpapers";
import { cn } from "@/lib/utils";

export function WallpaperUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    customWallpaperCount,
    canUploadMoreCustomWallpapers,
    isUploading,
    uploadError,
    uploadCustomWallpaper,
  } = useWallpaper();

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    await uploadCustomWallpaper(file);
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => void handleFileChange(event)}
      />
      <button
        type="button"
        disabled={isUploading || !canUploadMoreCustomWallpapers}
        onClick={() => inputRef.current?.click()}
        className={cn(
          SETTINGS_ROW,
          SETTINGS_ROW_DIVIDER,
          "justify-center gap-2 font-medium text-primary disabled:opacity-50",
        )}
      >
        <UploadSimpleIcon className="size-4" />
        {isUploading
          ? "Memproses..."
          : `Upload wallpaper sendiri (${customWallpaperCount}/${MAX_CUSTOM_WALLPAPERS})`}
      </button>
      {!canUploadMoreCustomWallpapers ? (
        <p className="px-4 py-2 text-center text-[11px] text-muted-foreground">
          Slot wallpaper kustom sudah penuh. Hapus salah satu untuk upload baru.
        </p>
      ) : null}
      {uploadError ? (
        <div className="px-4 py-2">
          <CmsAlert variant="error" size="sm" message={uploadError} />
        </div>
      ) : null}
    </>
  );
}

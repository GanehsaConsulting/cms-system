"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { BannerFormImageAddMenu } from "@/components/cms/banners/banner-form-image-add-menu";
import { CmsImagePickerDialog } from "@/components/shared/cms-image-picker-dialog";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BANNER_IMAGE_UPLOAD_HINT, BANNER_LIMITS } from "@/config/banner";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { CmsImagePickerTab } from "@/types/cms-image-picker";
import { cn } from "@/lib/utils";

export interface BannerFormImageChangeMeta {
  /** File names of images that were just added (empty when removing). */
  addedFileNames: string[];
}

interface BannerFormImageFieldProps {
  value: string[];
  disabled?: boolean;
  onChange: (value: string[], meta?: BannerFormImageChangeMeta) => void;
}

export function BannerFormImageField({
  value,
  disabled = false,
  onChange,
}: BannerFormImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<CmsImagePickerTab>("shared");
  const { openPreview } = useCmsImagePreview();
  const canAddMore = value.length < BANNER_LIMITS.maxImages;
  const remainingSlots = BANNER_LIMITS.maxImages - value.length;
  const uploadDisabled = disabled || isReading || !canAddMore;

  async function addFiles(fileList: FileList | File[]) {
    if (!canAddMore) {
      return;
    }

    setLocalError(null);
    setIsReading(true);

    try {
      const files = Array.from(fileList);
      const nextFiles = files.slice(0, remainingSlots);
      const nextImages: string[] = [];

      for (const file of nextFiles) {
        nextImages.push(await readGalleryImageFile(file));
      }

      onChange([...value, ...nextImages], {
        addedFileNames: nextFiles.map((file) => file.name),
      });
    } catch (uploadError) {
      setLocalError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload image.",
      );
    } finally {
      setIsReading(false);
    }
  }

  function addUrls(
    urls: string[],
    meta?: { addedFileNames: string[] },
  ) {
    const unique = urls
      .map((url) => url.trim())
      .filter((url) => url.length > 0 && !value.includes(url))
      .slice(0, remainingSlots);

    if (unique.length === 0) {
      return;
    }

    onChange([...value, ...unique], {
      addedFileNames: meta?.addedFileNames?.slice(0, unique.length) ?? [],
    });
  }

  function removeImage(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index), {
      addedFileNames: [],
    });
  }

  function openPicker(tab: CmsImagePickerTab) {
    setPickerTab(tab);
    setPickerOpen(true);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor="banner-images">Images</Label>
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {value.length}/{BANNER_LIMITS.maxImages}
        </span>
      </div>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {BANNER_IMAGE_UPLOAD_HINT}
      </p>
      <input
        ref={inputRef}
        id="banner-images"
        type="file"
        accept={GALLERY_ACCEPT_ATTRIBUTE}
        multiple
        className="sr-only"
        disabled={uploadDisabled}
        onChange={(event) => {
          const files = event.target.files;
          event.target.value = "";
          if (files?.length) {
            void addFiles(files);
          }
        }}
      />

      {value.length > 0 ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((image, index) => (
            <div
              key={`${image.slice(0, 32)}-${index}`}
              className={cn(
                RADIUS_DEEP,
                "group relative aspect-4/3 overflow-hidden bg-muted",
              )}
            >
              <button
                type="button"
                aria-label={`Preview image ${index + 1}`}
                className="absolute inset-0"
                onClick={() =>
                  openPreview({
                    images: value,
                    index,
                    title: "Banner image",
                  })
                }
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </button>
              <button
                type="button"
                aria-label={`Remove image ${index + 1}`}
                disabled={disabled || isReading}
                onClick={() => removeImage(index)}
                className={cn(
                  "absolute top-1 right-1 z-10 flex size-6 items-center justify-center rounded-full",
                  "bg-black/55 text-white opacity-0 transition-opacity",
                  "hover:bg-black/70 group-hover:opacity-100",
                  "focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                )}
              >
                <TrashIcon className="size-3.5" />
              </button>
              {index === 0 ? (
                <span className="pointer-events-none absolute bottom-1 left-1 rounded bg-black/55 px-1.5 py-0.5 text-[9px] text-white">
                  Cover
                </span>
              ) : null}
            </div>
          ))}

          {canAddMore ? (
            <BannerFormImageAddMenu
              disabled={uploadDisabled}
              onUpload={() => inputRef.current?.click()}
              onLibrary={() => openPicker("shared")}
              onUrl={() => openPicker("url")}
            />
          ) : null}
        </div>
      ) : (
        <div
          className={cn(RADIUS_DEEP, "flex items-center gap-3 bg-muted/50 p-3")}
        >
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden bg-background",
            )}
          >
            <UploadSimpleIcon className="size-5 text-muted-foreground" />
          </div>

          <div className="flex min-w-0 flex-1 flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadDisabled}
              onClick={() => inputRef.current?.click()}
            >
              Upload
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadDisabled}
              onClick={() => openPicker("shared")}
            >
              Library
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadDisabled}
              onClick={() => openPicker("url")}
            >
              URL
            </Button>
          </div>
        </div>
      )}

      {localError ? (
        <p className="text-destructive text-xs">{localError}</p>
      ) : null}

      <CmsImagePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        existingUrls={value}
        maxSelectable={remainingSlots}
        initialTab={pickerTab}
        onAdd={addUrls}
      />
    </div>
  );
}

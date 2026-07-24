"use client";

import Image from "next/image";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { CmsImageSourceMenu } from "@/components/shared/cms-image-source-menu";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Label } from "@/components/ui/label";
import { BANNER_IMAGE_UPLOAD_HINT, BANNER_LIMITS } from "@/config/banner";
import { RADIUS_DEEP } from "@/config/shape";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
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
  const { openPreview } = useCmsImagePreview();
  const remainingSlots = BANNER_LIMITS.maxImages - value.length;

  const source = useCmsImageSource({
    existingUrls: value,
    maxSelectable: remainingSlots,
    disabled,
    inputId: "banner-images",
    onAdd: (urls, meta) => {
      onChange([...value, ...urls], meta);
    },
  });

  function removeImage(index: number) {
    onChange(
      value.filter((_, itemIndex) => itemIndex !== index),
      { addedFileNames: [] },
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={source.inputId}>Images</Label>
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {value.length}/{BANNER_LIMITS.maxImages}
        </span>
      </div>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {BANNER_IMAGE_UPLOAD_HINT}
      </p>

      <CmsImageSourceInfra source={source} />

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
                disabled={disabled || source.isReading}
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

          {source.canAdd ? (
            <CmsImageSourceMenu
              disabled={source.busy}
              onUpload={source.openUpload}
              onLibrary={source.openLibrary}
              onUrl={source.openUrl}
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
          <CmsImageSourceActions
            disabled={source.busy}
            onUpload={source.openUpload}
            onLibrary={source.openLibrary}
            onUrl={source.openUrl}
          />
        </div>
      )}

      {source.localError ? (
        <p className="text-destructive text-xs">{source.localError}</p>
      ) : null}
    </div>
  );
}

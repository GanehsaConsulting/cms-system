"use client";

import Image from "next/image";
import type { Control } from "react-hook-form";
import { useFormContext, useWatch } from "react-hook-form";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { CmsImageSourceMenu } from "@/components/shared/cms-image-source-menu";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Label } from "@/components/ui/label";
import { CONTENT_ACTIVITY_FORM_LIMITS } from "@/config/content-activity-form";
import { RADIUS_DEEP } from "@/config/shape";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import type { ContentActivityFormValues } from "@/lib/validations/content-activity";
import { cn } from "@/lib/utils";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";

interface ContentActivityFormImagesFieldProps {
  control: Control<ContentActivityFormValues>;
  error?: string;
}

export function ContentActivityFormImagesField({
  control,
  error,
}: ContentActivityFormImagesFieldProps) {
  const { setValue, getValues } = useFormContext<ContentActivityFormValues>();
  const images = useWatch({ control, name: "images" }) ?? [];
  const { openPreview } = useCmsImagePreview();
  const remaining = CONTENT_ACTIVITY_FORM_LIMITS.maxImages - images.length;
  const canAddMore = remaining > 0;

  const source = useCmsImageSource({
    existingUrls: images,
    maxSelectable: remaining,
    onAdd: (urls) => {
      const current = getValues("images") ?? [];
      setValue("images", [...current, ...urls], {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-primary">Images</Label>
        <span className="text-muted-foreground text-[11px] tabular-nums">
          {images.length}/{CONTENT_ACTIVITY_FORM_LIMITS.maxImages}
        </span>
      </div>

      <CmsImageSourceInfra source={source} />

      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cn(
                RADIUS_DEEP,
                "group relative size-20 overflow-hidden bg-muted",
              )}
            >
              <button
                type="button"
                aria-label={`Preview image ${index + 1}`}
                className="absolute inset-0"
                onClick={() =>
                  openPreview({
                    images,
                    index,
                    title: "Activity images",
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
                className="absolute top-1 right-1 z-10 rounded-full bg-black/55 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
                onClick={() =>
                  setValue(
                    "images",
                    images.filter((_, i) => i !== index),
                    { shouldDirty: true, shouldValidate: true },
                  )
                }
              >
                <TrashIcon className="size-3" />
              </button>
            </div>
          ))}
          {canAddMore ? (
            <div className="size-20">
              <CmsImageSourceMenu
                disabled={source.busy}
                className="aspect-square size-20"
                onUpload={source.openUpload}
                onLibrary={source.openLibrary}
                onUrl={source.openUrl}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <div
          className={cn(
            RADIUS_DEEP,
            "flex min-h-24 w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted/30 px-4 py-6 text-muted-foreground",
          )}
        >
          <UploadSimpleIcon className="size-5" />
          <span className="text-sm">Add activity images</span>
        </div>
      )}

      {canAddMore ? (
        <CmsImageSourceActions
          disabled={source.busy}
          onUpload={source.openUpload}
          onLibrary={source.openLibrary}
          onUrl={source.openUrl}
        />
      ) : null}

      <p className="text-muted-foreground text-xs">
        Up to {CONTENT_ACTIVITY_FORM_LIMITS.maxImages} images. Upload, Library,
        or URL.
      </p>

      {source.localError || error ? (
        <p className="text-destructive text-xs">
          {source.localError ?? error}
        </p>
      ) : null}
    </div>
  );
}

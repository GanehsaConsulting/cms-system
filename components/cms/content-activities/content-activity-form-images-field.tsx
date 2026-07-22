"use client";

import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import Image from "next/image";
import { PlusIcon, TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CONTENT_ACTIVITY_FORM_LIMITS } from "@/config/content-activity-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  ARTICLE_IMAGE_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { ContentActivityFormValues } from "@/lib/validations/content-activity";
import { cn } from "@/lib/utils";

interface ContentActivityFormImagesFieldProps {
  control: Control<ContentActivityFormValues>;
  error?: string;
}

export function ContentActivityFormImagesField({
  control,
  error,
}: ContentActivityFormImagesFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { getValues } = useFormContext<ContentActivityFormValues>();

  return (
    <Controller
      control={control}
      name="images"
      render={({ field }) => {
        const images = field.value ?? [];
        const canAddMore = images.length < CONTENT_ACTIVITY_FORM_LIMITS.maxImages;
        const displayError = localError ?? error;

        async function addFiles(fileList: FileList | File[]) {
          if (!canAddMore) {
            return;
          }

          setLocalError(null);
          setIsReading(true);

          try {
            const files = Array.from(fileList);
            const currentImages = getValues("images") ?? [];
            const remainingSlots =
              CONTENT_ACTIVITY_FORM_LIMITS.maxImages - currentImages.length;
            const nextFiles = files.slice(0, remainingSlots);
            const nextImages: string[] = [];

            for (const file of nextFiles) {
              nextImages.push(await readGalleryImageFile(file));
            }

            field.onChange([...currentImages, ...nextImages]);
          } catch (uploadError) {
            setLocalError(
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to add image.",
            );
          } finally {
            setIsReading(false);
          }
        }

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Label className="text-primary">Images</Label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 gap-1.5"
                disabled={!canAddMore || isReading}
                onClick={() => inputRef.current?.click()}
              >
                <UploadSimpleIcon className="size-3.5" />
                Upload
              </Button>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept={ARTICLE_IMAGE_ACCEPT_ATTRIBUTE}
              multiple
              className="hidden"
              onChange={(event) => {
                const files = event.target.files;
                event.target.value = "";
                if (files?.length) {
                  void addFiles(files);
                }
              }}
            />

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
                    <Image
                      src={image}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 rounded-full bg-black/55 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                      onClick={() =>
                        field.onChange(images.filter((_, i) => i !== index))
                      }
                    >
                      <TrashIcon className="size-3" />
                    </button>
                  </div>
                ))}
                {canAddMore ? (
                  <button
                    type="button"
                    className={cn(
                      RADIUS_DEEP,
                      "flex size-20 items-center justify-center border border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted/70",
                    )}
                    aria-label="Add image"
                    disabled={isReading}
                    onClick={() => inputRef.current?.click()}
                  >
                    <PlusIcon className="size-4" />
                  </button>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                className={cn(
                  RADIUS_DEEP,
                  "flex min-h-24 w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted/30 px-4 py-6 text-muted-foreground transition-colors hover:bg-muted/50",
                )}
                disabled={isReading}
                onClick={() => inputRef.current?.click()}
              >
                <UploadSimpleIcon className="size-5" />
                <span className="text-sm">Upload activity images</span>
              </button>
            )}

            <p className="text-muted-foreground text-xs">
              Up to {CONTENT_ACTIVITY_FORM_LIMITS.maxImages} images. Max 2 MB each.
            </p>

            {displayError ? (
              <p className="text-destructive text-xs">{displayError}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}

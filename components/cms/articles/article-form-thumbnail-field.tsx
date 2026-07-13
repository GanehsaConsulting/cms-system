"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { ArticleFormField } from "@/components/cms/articles/article-form-field";
import { Button } from "@/components/ui/button";
import { THUMBNAIL_UPLOAD_HINT } from "@/config/article-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { ArticleFormValues } from "@/lib/validations/article";
import { cn } from "@/lib/utils";

interface ArticleFormThumbnailFieldProps {
  control: Control<ArticleFormValues>;
  error?: string;
}

export function ArticleFormThumbnailField({
  control,
  error,
}: ArticleFormThumbnailFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  return (
    <Controller
      control={control}
      name="thumbnail"
      render={({ field }) => {
        const thumbnail = field.value;
        const displayError = localError ?? error;

        async function setThumbnailFile(file: File) {
          setLocalError(null);
          setIsReading(true);

          try {
            field.onChange(await readGalleryImageFile(file));
          } catch (uploadError) {
            setLocalError(
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload thumbnail.",
            );
          } finally {
            setIsReading(false);
          }
        }

        function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
          const file = event.target.files?.[0];
          event.target.value = "";

          if (!file) {
            return;
          }

          void setThumbnailFile(file);
        }

        function handleDrop(event: React.DragEvent<HTMLButtonElement>) {
          event.preventDefault();

          if (isReading) {
            return;
          }

          const file = event.dataTransfer.files[0];
          if (file) {
            void setThumbnailFile(file);
          }
        }

        return (
          <ArticleFormField
            id="thumbnail"
            label="Thumbnail Image"
            hint={THUMBNAIL_UPLOAD_HINT}
            error={displayError}
          >
            <input
              ref={inputRef}
              id="thumbnail"
              type="file"
              accept={GALLERY_ACCEPT_ATTRIBUTE}
              className="sr-only"
              disabled={isReading}
              onChange={handleInputChange}
            />

            <div
              className={cn(
                RADIUS_DEEP,
                "relative aspect-video w-full overflow-hidden border border-border bg-muted/25",
              )}
            >
              {thumbnail ? (
                <>
                  <Image
                    src={thumbnail}
                    alt="Thumbnail preview"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon-sm"
                    className="absolute top-2 right-2 size-7 shadow-sm"
                    aria-label="Remove thumbnail"
                    onClick={() => field.onChange("")}
                  >
                    <TrashIcon className="size-3.5" />
                  </Button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
                  <UploadSimpleIcon className="size-7 text-muted-foreground/60" />
                  <p className="text-muted-foreground text-sm">
                    No thumbnail selected
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              disabled={isReading}
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className={cn(
                RADIUS_DEEP,
                "mt-2 flex w-full items-center justify-between gap-3 border border-border border-dashed bg-muted/15 px-3 py-2.5 text-left transition-colors hover:bg-muted/30 disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <UploadSimpleIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm">
                  {isReading
                    ? "Processing image..."
                    : thumbnail
                      ? "Replace image"
                      : "Choose image"}
                </span>
              </span>
              <span className="shrink-0 text-muted-foreground text-xs">
                or drag & drop
              </span>
            </button>
          </ArticleFormField>
        );
      }}
    />
  );
}

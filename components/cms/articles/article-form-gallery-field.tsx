"use client";

import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller, useFormContext } from "react-hook-form";
import { PlusIcon, UploadSimpleIcon } from "@/lib/icons";
import { ArticleFormGalleryCarousel } from "@/components/cms/articles/article-form-gallery-carousel";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import {
  ARTICLE_FORM_LIMITS,
  GALLERY_INPUT_ID,
  GALLERY_UPLOAD_HINT,
} from "@/config/article-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { ArticleFormValues } from "@/lib/validations/article";
import { cn } from "@/lib/utils";

interface ArticleFormGalleryFieldProps {
  control: Control<ArticleFormValues>;
  error?: string;
}

export function ArticleFormGalleryField({
  control,
  error,
}: ArticleFormGalleryFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { getValues } = useFormContext<ArticleFormValues>();

  return (
    <Controller
      control={control}
      name="gallery"
      render={({ field }) => {
        const images = field.value ?? [];
        const canAddMore = images.length < ARTICLE_FORM_LIMITS.maxGalleryImages;
        const displayError = localError ?? error;
        const hasImages = images.length > 0;
        const uploadDisabled = !canAddMore || isReading;

        async function addFiles(fileList: FileList | File[]) {
          if (!canAddMore) {
            return;
          }

          setLocalError(null);
          setIsReading(true);

          try {
            const files = Array.from(fileList);
            const currentImages = getValues("gallery") ?? [];
            const remainingSlots =
              ARTICLE_FORM_LIMITS.maxGalleryImages - currentImages.length;
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

        function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
          const files = event.target.files;

          if (!files?.length) {
            return;
          }

          void addFiles(files);
          event.target.value = "";
        }

        function handleDrop(event: React.DragEvent<HTMLElement>) {
          event.preventDefault();

          if (uploadDisabled) {
            return;
          }

          const files = event.dataTransfer.files;
          if (files.length > 0) {
            void addFiles(files);
          }
        }

        function removeImage(index: number) {
          field.onChange(images.filter((_, itemIndex) => itemIndex !== index));
        }

        return (
          <ArticleFormField
            id="article-gallery"
            label="Image Gallery"
            counter={ArticleFormCharCounter({
              current: images.length,
              max: ARTICLE_FORM_LIMITS.maxGalleryImages,
            })}
            hint={GALLERY_UPLOAD_HINT}
            error={displayError}
          >
            <input
              ref={inputRef}
              id={GALLERY_INPUT_ID}
              type="file"
              accept={GALLERY_ACCEPT_ATTRIBUTE}
              multiple
              className="sr-only"
              disabled={uploadDisabled}
              onChange={handleInputChange}
            />

            <ArticleFormGalleryCarousel
              images={images}
              onRemove={removeImage}
              uploadInputId={GALLERY_INPUT_ID}
              uploadDisabled={uploadDisabled}
              onDrop={handleDrop}
            />

            {canAddMore ? (
              <label
                htmlFor={GALLERY_INPUT_ID}
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                className={cn(
                  RADIUS_DEEP,
                  "mt-2 flex w-full cursor-pointer items-center justify-between gap-3 border border-border border-dashed bg-muted/15 px-3 py-2.5 text-left transition-colors hover:bg-muted/30",
                  uploadDisabled && "cursor-not-allowed opacity-60",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  {hasImages ? (
                    <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <UploadSimpleIcon className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="truncate text-sm">
                    {isReading
                      ? "Processing images..."
                      : hasImages
                        ? "Upload more images"
                        : "Choose images"}
                  </span>
                </span>
                <span className="shrink-0 text-muted-foreground text-xs">
                  or drag & drop
                </span>
              </label>
            ) : (
              <p className="mt-2 text-muted-foreground text-xs">
                Gallery limit reached. Remove an image to upload another.
              </p>
            )}
          </ArticleFormField>
        );
      }}
    />
  );
}

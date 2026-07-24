"use client";

import Image from "next/image";
import type { Control } from "react-hook-form";
import { useFormContext, useWatch } from "react-hook-form";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { ArticleFormField } from "@/components/cms/articles/article-form-field";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { THUMBNAIL_UPLOAD_HINT } from "@/config/article-form";
import { RADIUS_DEEP } from "@/config/shape";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
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
  const { setValue } = useFormContext<ArticleFormValues>();
  const thumbnail = useWatch({ control, name: "thumbnail" }) ?? "";
  const { openPreview } = useCmsImagePreview();

  const source = useCmsImageSource({
    existingUrls: thumbnail ? [thumbnail] : [],
    maxSelectable: 1,
    multiple: false,
    inputId: "thumbnail",
    onAdd: (urls) => {
      setValue("thumbnail", urls[0] ?? "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    if (source.busy) {
      return;
    }
    const file = event.dataTransfer.files[0];
    if (file) {
      void source.addFiles([file]);
    }
  }

  return (
    <ArticleFormField
      id="thumbnail"
      label="Thumbnail Image"
      hint={THUMBNAIL_UPLOAD_HINT}
      error={source.localError ?? error}
    >
      <CmsImageSourceInfra source={source} />

      <div
        className={cn(
          RADIUS_DEEP,
          "relative aspect-video w-full overflow-hidden border border-border bg-muted/25",
        )}
      >
        {thumbnail ? (
          <>
            <button
              type="button"
              aria-label="Preview thumbnail"
              className="absolute inset-0"
              onClick={() =>
                openPreview({
                  images: [thumbnail],
                  title: "Thumbnail preview",
                })
              }
            >
              <Image
                src={thumbnail}
                alt="Thumbnail preview"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </button>
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              className="absolute top-2 right-2 z-10 size-7 shadow-sm"
              aria-label="Remove thumbnail"
              onClick={() =>
                setValue("thumbnail", "", {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
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

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        className="mt-2 space-y-2"
      >
        <CmsImageSourceActions
          disabled={source.busy}
          uploadLabel={
            source.isReading
              ? "Processing…"
              : thumbnail
                ? "Replace"
                : "Upload"
          }
          onUpload={source.openUpload}
          onLibrary={source.openLibrary}
          onUrl={source.openUrl}
        />
        <p className="text-muted-foreground text-xs">Or drag & drop an image here.</p>
      </div>
    </ArticleFormField>
  );
}

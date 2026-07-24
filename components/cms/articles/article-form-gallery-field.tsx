"use client";

import { useFormContext, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import { ArticleFormGalleryCarousel } from "@/components/cms/articles/article-form-gallery-carousel";
import {
  ArticleFormCharCounter,
  ArticleFormField,
} from "@/components/cms/articles/article-form-field";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import {
  ARTICLE_FORM_LIMITS,
  GALLERY_INPUT_ID,
  GALLERY_UPLOAD_HINT,
} from "@/config/article-form";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import type { ArticleFormValues } from "@/lib/validations/article";

interface ArticleFormGalleryFieldProps {
  control: Control<ArticleFormValues>;
  error?: string;
}

export function ArticleFormGalleryField({
  control,
  error,
}: ArticleFormGalleryFieldProps) {
  const { setValue, getValues } = useFormContext<ArticleFormValues>();
  const images = useWatch({ control, name: "gallery" }) ?? [];
  const remaining = ARTICLE_FORM_LIMITS.maxGalleryImages - images.length;
  const canAddMore = remaining > 0;

  const source = useCmsImageSource({
    existingUrls: images,
    maxSelectable: remaining,
    inputId: GALLERY_INPUT_ID,
    onAdd: (urls) => {
      const current = getValues("gallery") ?? [];
      setValue("gallery", [...current, ...urls], {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
  });

  const uploadDisabled = source.busy || !canAddMore;

  function handleDrop(event: React.DragEvent<HTMLElement>) {
    event.preventDefault();
    if (uploadDisabled) {
      return;
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      void source.addFiles(files);
    }
  }

  function removeImage(index: number) {
    const current = getValues("gallery") ?? [];
    setValue(
      "gallery",
      current.filter((_, itemIndex) => itemIndex !== index),
      { shouldDirty: true, shouldValidate: true },
    );
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
      error={source.localError ?? error}
    >
      <CmsImageSourceInfra source={source} />

      <ArticleFormGalleryCarousel
        images={images}
        onRemove={removeImage}
        uploadDisabled={uploadDisabled}
        onDrop={handleDrop}
        onRequestUpload={source.openUpload}
      />

      {canAddMore ? (
        <div className="mt-2 space-y-2">
          <CmsImageSourceActions
            disabled={uploadDisabled}
            uploadLabel={
              source.isReading
                ? "Processing…"
                : images.length > 0
                  ? "Upload more"
                  : "Upload"
            }
            onUpload={source.openUpload}
            onLibrary={source.openLibrary}
            onUrl={source.openUrl}
          />
          <p className="text-muted-foreground text-xs">
            Or drag & drop images onto the gallery area.
          </p>
        </div>
      ) : (
        <p className="mt-2 text-muted-foreground text-xs">
          Gallery limit reached. Remove an image to upload another.
        </p>
      )}
    </ArticleFormField>
  );
}

"use client";

import Image from "next/image";
import type {
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { CmsImageSourceMenu } from "@/components/shared/cms-image-source-menu";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CLIENT_FORM_LIMITS,
  CLIENT_GALLERY_UPLOAD_HINT,
} from "@/config/client-form";
import { RADIUS_DEEP } from "@/config/shape";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import type { ClientFormValues } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

interface ClientFormGallerySectionProps {
  control: Control<ClientFormValues>;
  watch: UseFormWatch<ClientFormValues>;
  fields: { id: string }[];
  append: UseFieldArrayAppend<ClientFormValues, "photos">;
  remove: UseFieldArrayRemove;
}

export function ClientFormGallerySection({
  control,
  watch,
  fields,
  append,
  remove,
}: ClientFormGallerySectionProps) {
  const { openPreview } = useCmsImagePreview();
  const photos = watch("photos");
  const remaining = CLIENT_FORM_LIMITS.maxPhotos - fields.length;
  const existingUrls = photos.map((photo) => photo.url).filter(Boolean);

  const source = useCmsImageSource({
    existingUrls,
    maxSelectable: Math.max(remaining, 0),
    onAdd: (urls) => {
      for (const url of urls) {
        append({
          id: crypto.randomUUID(),
          url,
          caption: "",
        });
      }
    },
  });

  if (fields.length === 0) {
    return (
      <div className="space-y-3">
        <CmsImageSourceInfra source={source} />
        <div
          className={cn(
            RADIUS_DEEP,
            "flex flex-col items-center justify-center border border-dashed border-(--separator) bg-muted/30 px-4 py-10 text-center",
          )}
        >
          <UploadSimpleIcon className="size-5 text-muted-foreground" />
          <p className="mt-3 font-medium text-sm">No gallery photos yet</p>
          <p className="mt-1 max-w-sm text-muted-foreground text-sm">
            {CLIENT_GALLERY_UPLOAD_HINT}
          </p>
          <div className="mt-4">
            <CmsImageSourceActions
              disabled={source.busy}
              uploadLabel="Upload"
              onUpload={source.openUpload}
              onLibrary={source.openLibrary}
              onUrl={source.openUrl}
            />
          </div>
        </div>
        {source.localError ? (
          <p className="text-destructive text-xs">{source.localError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <CmsImageSourceInfra source={source} />

      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={cn(RADIUS_DEEP, "space-y-3 bg-muted/50 p-3")}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg bg-background">
              {photos[index]?.url ? (
                <button
                  type="button"
                  aria-label={`Preview photo ${index + 1}`}
                  className="absolute inset-0"
                  onClick={() =>
                    openPreview({
                      images: photos.map((photo) => photo.url).filter(Boolean),
                      index,
                      title: "Client photos",
                    })
                  }
                >
                  <Image
                    src={photos[index].url}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </button>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`photo-caption-${index}`}>Caption</Label>
              <Controller
                control={control}
                name={`photos.${index}.caption`}
                render={({ field: captionField }) => (
                  <Input
                    id={`photo-caption-${index}`}
                    placeholder="Optional caption"
                    {...captionField}
                  />
                )}
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => remove(index)}
            >
              <TrashIcon className="size-3.5" />
              Remove
            </Button>
          </div>
        ))}
      </div>

      {remaining > 0 ? (
        <CmsImageSourceMenu
          variant="button"
          buttonLabel="Add photo"
          disabled={source.busy}
          onUpload={source.openUpload}
          onLibrary={source.openLibrary}
          onUrl={source.openUrl}
        />
      ) : null}

      {source.localError ? (
        <p className="text-destructive text-xs">{source.localError}</p>
      ) : null}
    </div>
  );
}

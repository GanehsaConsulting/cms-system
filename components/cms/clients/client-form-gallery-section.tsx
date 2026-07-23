"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type {
  Control,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormWatch,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { PlusIcon, TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CLIENT_FORM_LIMITS,
  CLIENT_GALLERY_UPLOAD_HINT,
} from "@/config/client-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const { openPreview } = useCmsImagePreview();
  const photos = watch("photos");
  const remaining = CLIENT_FORM_LIMITS.maxPhotos - fields.length;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) {
      return;
    }

    setLocalError(null);
    setIsReading(true);

    try {
      const files = Array.from(fileList).slice(0, Math.max(remaining, 0));

      for (const file of files) {
        const url = await readGalleryImageFile(file);
        append({
          id: crypto.randomUUID(),
          url,
          caption: "",
        });
      }

      if (fileList.length > remaining) {
        setLocalError(
          `Only ${CLIENT_FORM_LIMITS.maxPhotos} photos are allowed per client.`,
        );
      }
    } catch (uploadError) {
      setLocalError(
        uploadError instanceof Error
          ? uploadError.message
          : "Failed to upload photo.",
      );
    } finally {
      setIsReading(false);
    }
  }

  if (fields.length === 0) {
    return (
      <div className="space-y-3">
        <input
          ref={inputRef}
          type="file"
          accept={GALLERY_ACCEPT_ATTRIBUTE}
          multiple
          className="sr-only"
          disabled={isReading}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
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
          <Button
            type="button"
            className="mt-4 gap-1.5"
            disabled={isReading}
            onClick={() => inputRef.current?.click()}
          >
            <PlusIcon className="size-3.5" />
            Upload Photo
          </Button>
        </div>
        {localError ? (
          <p className="text-destructive text-xs">{localError}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept={GALLERY_ACCEPT_ATTRIBUTE}
        multiple
        className="sr-only"
        disabled={isReading || remaining <= 0}
        onChange={(event) => {
          void handleFiles(event.target.files);
          event.target.value = "";
        }}
      />

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
        <Button
          type="button"
          variant="outline"
          className="gap-1.5"
          disabled={isReading}
          onClick={() => inputRef.current?.click()}
        >
          <PlusIcon className="size-3.5" />
          Upload Photo
        </Button>
      ) : null}

      {localError ? (
        <p className="text-destructive text-xs">{localError}</p>
      ) : null}
    </div>
  );
}

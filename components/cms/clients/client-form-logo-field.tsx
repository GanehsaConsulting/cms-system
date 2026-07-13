"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CLIENT_LOGO_UPLOAD_HINT } from "@/config/client-form";
import { RADIUS_DEEP } from "@/config/shape";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import type { ClientFormValues } from "@/lib/validations/client";
import { cn } from "@/lib/utils";

interface ClientFormLogoFieldProps {
  control: Control<ClientFormValues>;
}

export function ClientFormLogoField({ control }: ClientFormLogoFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);

  return (
    <Controller
      control={control}
      name="logo"
      render={({ field }) => {
        async function setLogoFile(file: File) {
          setLocalError(null);
          setIsReading(true);

          try {
            field.onChange(await readGalleryImageFile(file));
          } catch (uploadError) {
            setLocalError(
              uploadError instanceof Error
                ? uploadError.message
                : "Failed to upload logo.",
            );
          } finally {
            setIsReading(false);
          }
        }

        return (
          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {CLIENT_LOGO_UPLOAD_HINT}
            </p>
            <input
              ref={inputRef}
              id="logo"
              type="file"
              accept={GALLERY_ACCEPT_ATTRIBUTE}
              className="sr-only"
              disabled={isReading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (file) {
                  void setLogoFile(file);
                }
              }}
            />

            <div
              className={cn(
                RADIUS_DEEP,
                "flex items-center gap-3 bg-muted/50 p-3",
              )}
            >
              <div
                className={cn(
                  RADIUS_DEEP,
                  "relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-background",
                )}
              >
                {field.value ? (
                  <Image
                    src={field.value}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain p-2"
                  />
                ) : (
                  <UploadSimpleIcon className="size-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isReading}
                  onClick={() => inputRef.current?.click()}
                >
                  {field.value ? "Replace logo" : "Upload logo"}
                </Button>
                {field.value ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    disabled={isReading}
                    onClick={() => field.onChange("")}
                  >
                    <TrashIcon className="size-3.5" />
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>

            {localError ? (
              <p className="text-destructive text-xs">{localError}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}

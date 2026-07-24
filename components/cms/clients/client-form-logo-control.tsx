"use client";

import Image from "next/image";
import { TrashIcon, UploadSimpleIcon } from "@/lib/icons";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CLIENT_LOGO_UPLOAD_HINT } from "@/config/client-form";
import { RADIUS_DEEP } from "@/config/shape";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import { cn } from "@/lib/utils";

interface ClientFormLogoControlProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientFormLogoControl({
  value,
  onChange,
}: ClientFormLogoControlProps) {
  const { openPreview } = useCmsImagePreview();
  const source = useCmsImageSource({
    existingUrls: value ? [value] : [],
    maxSelectable: 1,
    multiple: false,
    inputId: "logo",
    onAdd: (urls) => onChange(urls[0] ?? ""),
  });

  return (
    <div className="space-y-2">
      <Label htmlFor={source.inputId}>Logo</Label>
      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {CLIENT_LOGO_UPLOAD_HINT}
      </p>

      <CmsImageSourceInfra source={source} />

      <div className={cn(RADIUS_DEEP, "flex items-center gap-3 bg-muted/50 p-3")}>
        <div
          className={cn(
            RADIUS_DEEP,
            "relative flex size-16 shrink-0 items-center justify-center overflow-hidden bg-background",
          )}
        >
          {value ? (
            <button
              type="button"
              aria-label="Preview logo"
              className="absolute inset-0"
              onClick={() =>
                openPreview({
                  images: [value],
                  title: "Logo preview",
                })
              }
            >
              <Image
                src={value}
                alt=""
                fill
                unoptimized
                className="object-contain p-2"
              />
            </button>
          ) : (
            <UploadSimpleIcon className="size-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <CmsImageSourceActions
            disabled={source.busy}
            uploadLabel={value ? "Replace" : "Upload"}
            onUpload={source.openUpload}
            onLibrary={source.openLibrary}
            onUrl={source.openUrl}
          />
          {value ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={source.busy}
              onClick={() => onChange("")}
            >
              <TrashIcon className="size-3.5" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {source.localError ? (
        <p className="text-destructive text-xs">{source.localError}</p>
      ) : null}
    </div>
  );
}

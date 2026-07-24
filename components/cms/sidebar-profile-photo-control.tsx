"use client";

import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { CmsImageSourceActions } from "@/components/shared/cms-image-source-actions";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CMS_IMAGE_SOURCE_HINT } from "@/config/cms-image-source";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import { TrashIcon } from "@/lib/icons";

interface SidebarProfilePhotoControlProps {
  value: string;
  displayName: string;
  onChange: (value: string) => void;
}

export function SidebarProfilePhotoControl({
  value,
  displayName,
  onChange,
}: SidebarProfilePhotoControlProps) {
  const source = useCmsImageSource({
    existingUrls: value ? [value] : [],
    maxSelectable: 1,
    multiple: false,
    onAdd: (urls) => onChange(urls[0] ?? ""),
  });

  return (
    <div className="space-y-3">
      <Label>Profile photo</Label>
      <div className="flex items-center gap-3">
        <SidebarProfileAvatar
          name={displayName}
          avatarUrl={value || undefined}
          size="lg"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <CmsImageSourceInfra source={source} />
          <div className="flex flex-wrap items-center gap-2">
            <CmsImageSourceActions
              disabled={source.busy}
              uploadLabel={value ? "Change" : "Upload"}
              onUpload={source.openUpload}
              onLibrary={source.openLibrary}
              onUrl={source.openUrl}
            />
            {value ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                disabled={source.busy}
                onClick={() => {
                  source.setLocalError(null);
                  onChange("");
                }}
              >
                <TrashIcon className="size-3.5" />
                Remove
              </Button>
            ) : null}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {CMS_IMAGE_SOURCE_HINT} Shown in the sidebar and profile dialog.
          </p>
          {source.localError ? (
            <p className="text-destructive text-xs">{source.localError}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

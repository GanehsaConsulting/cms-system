"use client";

import Image from "next/image";
import { MediaLibraryKindBadge } from "@/components/cms/media/media-library-kind-badge";
import { MediaLibraryKindIcon } from "@/components/cms/media/media-library-kind-icon";
import { MediaLibraryLibraryFileActionsMenu } from "@/components/cms/media/media-library-library-file-actions-menu";
import { MediaLibraryLibraryFileSelectCheckbox } from "@/components/cms/media/media-library-library-file-select-checkbox";
import { SolidSurface } from "@/components/shared/solid-surface";
import { isRenderableMediaPreview } from "@/lib/media/classify";
import { formatClientDateParts } from "@/lib/clients/list";
import { RADIUS_DEEP } from "@/config/shape";
import type { MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryGridCardProps {
  file: MediaLibraryFile;
  isSelected: boolean;
  hasSelection: boolean;
  onToggleSelect: (id: string) => void;
}

export function MediaLibraryLibraryGridCard({
  file,
  isSelected,
  hasSelection,
  onToggleSelect,
}: MediaLibraryLibraryGridCardProps) {
  const canPreview = isRenderableMediaPreview(file.kind);
  const uploaded = formatClientDateParts(file.uploadedAt);
  const showSelectControl = hasSelection || isSelected;

  return (
    // Card contains nested checkbox/menu controls; a native <button> would nest buttons.
    // biome-ignore lint/a11y/useSemanticElements: nested interactive controls
    <div
      role="button"
      tabIndex={0}
      onClick={() => onToggleSelect(file.id)}
      onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onToggleSelect(file.id);
        }
      }}
      className={cn(
        "group cursor-pointer rounded-(--radius-inner) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        isSelected && "ring-2 ring-primary/40",
      )}
    >
      <SolidSurface
        className={cn(
          "flex h-full flex-col gap-3 p-3 transition-colors",
          isSelected && "bg-primary/5",
        )}
      >
        <div
          className={cn(
            RADIUS_DEEP,
            "relative aspect-4/3 overflow-hidden bg-muted",
          )}
        >
          <div
            className={cn(
              "absolute top-1.5 left-1.5 z-20 transition-opacity",
              showSelectControl
                ? "opacity-100"
                : "pointer-events-none opacity-0 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100",
            )}
            onClick={(event) => event.stopPropagation()}
            onMouseDown={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <MediaLibraryLibraryFileSelectCheckbox
              checked={isSelected}
              visible
              onCheckedChange={() => onToggleSelect(file.id)}
              className="opacity-100"
            />
          </div>

          <div className="absolute top-1.5 right-1.5 z-10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <MediaLibraryLibraryFileActionsMenu
              file={file}
              triggerClassName="size-7 bg-background/80 backdrop-blur-sm hover:bg-background"
              onTriggerClick={(event) => event.stopPropagation()}
            />
          </div>

          {canPreview ? (
            <Image
              src={file.url}
              alt=""
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <MediaLibraryKindIcon
                kind={file.kind}
                className="size-8 opacity-60"
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-2 min-w-0 font-medium text-sm leading-snug">
              {file.filename}
            </p>
            <MediaLibraryKindBadge kind={file.kind} className="shrink-0" />
          </div>

          <p className="text-muted-foreground text-xs">
            Uploaded {uploaded.date}
          </p>
        </div>
      </SolidSurface>
    </div>
  );
}

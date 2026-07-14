"use client";

import { MediaLibraryInUseView } from "@/components/cms/media/media-library-in-use-view";
import { MediaLibraryLibraryView } from "@/components/cms/media/media-library-library-view";
import { MediaLibraryPageHeader } from "@/components/cms/media/media-library-page-header";
import { MediaLibrarySectionTabs } from "@/components/cms/media/media-library-section-tabs";
import { useMediaLibrarySection } from "@/hooks/use-media-library-section";
import { SHELL_PADDING } from "@/config/spacing";
import type { MediaAsset, MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryViewProps {
  assets: MediaAsset[];
  folders: MediaFolder[];
  files: MediaLibraryFile[];
}

export function MediaLibraryView({
  assets,
  folders,
  files,
}: MediaLibraryViewProps) {
  const { section, setSection } = useMediaLibrarySection("library");

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SHELL_PADDING,
      )}
    >
      <MediaLibraryPageHeader
        actions={
          <MediaLibrarySectionTabs value={section} onChange={setSection} />
        }
      />

      {section === "library" ? (
        <MediaLibraryLibraryView folders={folders} files={files} />
      ) : (
        <MediaLibraryInUseView assets={assets} />
      )}
    </div>
  );
}

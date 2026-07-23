"use client";

import { useMemo } from "react";
import { MediaLibraryInUseView } from "@/components/cms/media/media-library-in-use-view";
import { MediaLibraryLibraryView } from "@/components/cms/media/media-library-library-view";
import { MediaLibrarySectionTabs } from "@/components/cms/media/media-library-section-tabs";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { useMediaLibrarySection } from "@/hooks/use-media-library-section";
import type {
  MediaAsset,
  MediaFolder,
  MediaLibraryFile,
  MediaLibraryScope,
} from "@/types/media";

interface MediaLibraryViewProps {
  assets: MediaAsset[];
  foldersByScope: Record<MediaLibraryScope, MediaFolder[]>;
  filesByScope: Record<MediaLibraryScope, MediaLibraryFile[]>;
}

export function MediaLibraryView({
  assets,
  foldersByScope,
  filesByScope,
}: MediaLibraryViewProps) {
  const { section, setSection, isInUse, libraryScope } =
    useMediaLibrarySection("shared");

  const headerActions = useMemo(
    () => <MediaLibrarySectionTabs value={section} onChange={setSection} />,
    [section, setSection],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {isInUse ? (
        <MediaLibraryInUseView assets={assets} />
      ) : (
        <MediaLibraryLibraryView
          key={libraryScope}
          scope={libraryScope}
          folders={foldersByScope[libraryScope]}
          files={filesByScope[libraryScope]}
        />
      )}
    </div>
  );
}

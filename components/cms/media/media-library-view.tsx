"use client";

import { useMemo } from "react";
import { MediaLibraryInUseView } from "@/components/cms/media/media-library-in-use-view";
import { MediaLibraryLibraryView } from "@/components/cms/media/media-library-library-view";
import { MediaLibrarySectionTabs } from "@/components/cms/media/media-library-section-tabs";
import { CmsPageHeaderActions } from "@/components/shared/cms-page-header-actions";
import { useMediaLibrarySection } from "@/hooks/use-media-library-section";
import type { MediaAsset, MediaFolder, MediaLibraryFile } from "@/types/media";

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

  const headerActions = useMemo(
    () => <MediaLibrarySectionTabs value={section} onChange={setSection} />,
    [section, setSection],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <CmsPageHeaderActions>{headerActions}</CmsPageHeaderActions>

      {section === "library" ? (
        <MediaLibraryLibraryView folders={folders} files={files} />
      ) : (
        <MediaLibraryInUseView assets={assets} />
      )}
    </div>
  );
}

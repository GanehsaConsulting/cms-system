"use client";

import { MediaLibraryInUseView } from "@/components/cms/media/media-library-in-use-view";
import { MediaLibraryLibraryView } from "@/components/cms/media/media-library-library-view";
import { MediaLibrarySectionTabs } from "@/components/cms/media/media-library-section-tabs";
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="mb-4 flex shrink-0 justify-end">
        <MediaLibrarySectionTabs value={section} onChange={setSection} />
      </div>

      {section === "library" ? (
        <MediaLibraryLibraryView folders={folders} files={files} />
      ) : (
        <MediaLibraryInUseView assets={assets} />
      )}
    </div>
  );
}

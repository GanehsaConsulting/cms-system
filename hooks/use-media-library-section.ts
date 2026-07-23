"use client";

import { useState } from "react";
import { MEDIA_LIBRARY_SCOPES } from "@/lib/media/scope";
import type { MediaLibraryScope, MediaLibrarySection } from "@/types/media";

export function useMediaLibrarySection(
  initialSection: MediaLibrarySection = "shared",
) {
  const [section, setSection] = useState<MediaLibrarySection>(initialSection);

  const isLibraryScope = MEDIA_LIBRARY_SCOPES.includes(
    section as MediaLibraryScope,
  );

  return {
    section,
    setSection,
    isLibrary: isLibraryScope,
    isInUse: section === "in-use",
    libraryScope: (isLibraryScope ? section : "shared") as MediaLibraryScope,
  };
}

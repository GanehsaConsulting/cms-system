"use client";

import { useState } from "react";
import type { MediaLibrarySection } from "@/types/media";

export function useMediaLibrarySection(
  initialSection: MediaLibrarySection = "library",
) {
  const [section, setSection] = useState<MediaLibrarySection>(initialSection);

  return {
    section,
    setSection,
    isLibrary: section === "library",
    isInUse: section === "in-use",
  };
}

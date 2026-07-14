"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "media-library-search";

interface MediaLibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export function MediaLibrarySearch({
  value,
  onChange,
  placeholder = "Search media...",
  ariaLabel = "Search media",
}: MediaLibrarySearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder={placeholder}
      ariaLabel={ariaLabel}
      onChange={onChange}
    />
  );
}

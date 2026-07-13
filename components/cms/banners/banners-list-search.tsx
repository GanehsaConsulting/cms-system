"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "banners-list-search";

interface BannersListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BannersListSearch({ value, onChange }: BannersListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search banners"
      ariaLabel="Search banners"
      onChange={onChange}
    />
  );
}

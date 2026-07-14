"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "brand-list-search";

interface BrandListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BrandListSearch({ value, onChange }: BrandListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search brands..."
      ariaLabel="Search brands"
      onChange={onChange}
    />
  );
}

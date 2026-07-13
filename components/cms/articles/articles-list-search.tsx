"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "articles-list-search";

interface ArticlesListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ArticlesListSearch({ value, onChange }: ArticlesListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search articles..."
      ariaLabel="Search articles"
      onChange={onChange}
    />
  );
}

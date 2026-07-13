"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "prices-list-search";

interface PricesListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PricesListSearch({ value, onChange }: PricesListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search price plans..."
      ariaLabel="Search price plans"
      onChange={onChange}
    />
  );
}

"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

interface PortfolioListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function PortfolioListSearch({
  value,
  onChange,
}: PortfolioListSearchProps) {
  return (
    <CmsListSearch
      inputId="portfolio-list-search"
      value={value}
      placeholder="Search works..."
      ariaLabel="Search portfolio works"
      onChange={onChange}
    />
  );
}

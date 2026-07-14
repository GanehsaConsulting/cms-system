"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "clients-works-all-search";

interface ClientsWorksAllSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientsWorksAllSearch({
  value,
  onChange,
}: ClientsWorksAllSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search clients & works..."
      ariaLabel="Search clients and works"
      onChange={onChange}
    />
  );
}

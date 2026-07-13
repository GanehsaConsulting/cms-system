"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "clients-list-search";

interface ClientsListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ClientsListSearch({ value, onChange }: ClientsListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search clients..."
      ariaLabel="Search clients"
      onChange={onChange}
    />
  );
}

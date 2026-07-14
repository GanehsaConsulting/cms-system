"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

const SEARCH_INPUT_ID = "user-list-search";

interface UserListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function UserListSearch({ value, onChange }: UserListSearchProps) {
  return (
    <CmsListSearch
      inputId={SEARCH_INPUT_ID}
      value={value}
      placeholder="Search users..."
      ariaLabel="Search users"
      onChange={onChange}
    />
  );
}

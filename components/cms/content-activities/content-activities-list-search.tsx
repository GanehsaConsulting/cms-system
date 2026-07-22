"use client";

import { CmsListSearch } from "@/components/shared/cms-list-search";

interface ContentActivitiesListSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContentActivitiesListSearch({
  value,
  onChange,
}: ContentActivitiesListSearchProps) {
  return (
    <CmsListSearch
      inputId="content-activities-list-search"
      value={value}
      placeholder="Search title or description..."
      ariaLabel="Search activities"
      onChange={onChange}
    />
  );
}

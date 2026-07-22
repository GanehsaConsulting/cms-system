"use client";

import { CmsListFilterPopover } from "@/components/shared/cms-list-filter-popover";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONTENT_ACTIVITIES_LIST_SORT_OPTIONS,
  CONTENT_ACTIVITY_SHOW_TITLE_FILTERS,
  CONTENT_ACTIVITY_STATUS_FILTERS,
  type ContentActivitiesListSort,
  type ContentActivityShowTitleFilter,
  type ContentActivityStatusFilter,
} from "@/config/content-activities-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface ContentActivitiesListFilterProps {
  statusFilter: ContentActivityStatusFilter;
  showTitleFilter: ContentActivityShowTitleFilter;
  sort: ContentActivitiesListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: ContentActivityStatusFilter) => void;
  onShowTitleFilterChange: (filter: ContentActivityShowTitleFilter) => void;
  onSortChange: (sort: ContentActivitiesListSort) => void;
  onReset: () => void;
}

export function ContentActivitiesListFilter({
  statusFilter,
  showTitleFilter,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onShowTitleFilterChange,
  onSortChange,
  onReset,
}: ContentActivitiesListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="content-activities-status-filter">Status</Label>
          <Select
            value={statusFilter}
            items={toSelectItems(CONTENT_ACTIVITY_STATUS_FILTERS)}
            onValueChange={(value) =>
              onStatusFilterChange(value as ContentActivityStatusFilter)
            }
          >
            <SelectTrigger
              id="content-activities-status-filter"
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_ACTIVITY_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="content-activities-show-title-filter">
            Title display
          </Label>
          <Select
            value={showTitleFilter}
            items={toSelectItems(CONTENT_ACTIVITY_SHOW_TITLE_FILTERS)}
            onValueChange={(value) =>
              onShowTitleFilterChange(value as ContentActivityShowTitleFilter)
            }
          >
            <SelectTrigger
              id="content-activities-show-title-filter"
              className="w-full"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_ACTIVITY_SHOW_TITLE_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="content-activities-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(CONTENT_ACTIVITIES_LIST_SORT_OPTIONS)}
            onValueChange={(value) =>
              onSortChange(value as ContentActivitiesListSort)
            }
          >
            <SelectTrigger id="content-activities-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_ACTIVITIES_LIST_SORT_OPTIONS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CmsListFilterPopover>
  );
}

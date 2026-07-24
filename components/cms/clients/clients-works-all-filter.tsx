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
  CLIENT_FEATURED_FILTERS,
  CLIENTS_WORKS_ALL_CONTENT_FILTERS,
  CLIENTS_WORKS_ALL_SORT_OPTIONS,
  type ClientFeaturedFilter,
  type ClientsWorksAllContentFilter,
  type ClientsWorksAllListSort,
} from "@/config/clients-works-all";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";
import { toSelectItems } from "@/lib/select-items";

interface ClientsWorksAllFilterProps {
  featuredFilter: ClientFeaturedFilter;
  contentFilter: ClientsWorksAllContentFilter;
  sort: ClientsWorksAllListSort;
  hasActiveFilters: boolean;
  onFeaturedFilterChange: (filter: ClientFeaturedFilter) => void;
  onContentFilterChange: (filter: ClientsWorksAllContentFilter) => void;
  onSortChange: (sort: ClientsWorksAllListSort) => void;
  onReset: () => void;
}

export function ClientsWorksAllFilter({
  featuredFilter,
  contentFilter,
  sort,
  hasActiveFilters,
  onFeaturedFilterChange,
  onContentFilterChange,
  onSortChange,
  onReset,
}: ClientsWorksAllFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-featured-filter">Visibility</Label>
          <Select
            value={featuredFilter}
            items={toSelectItems(CLIENT_FEATURED_FILTERS)}
            onValueChange={(value) =>
              onFeaturedFilterChange(value as ClientFeaturedFilter)
            }
          >
            <SelectTrigger id="all-featured-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENT_FEATURED_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-content-filter">Contents</Label>
          <Select
            value={contentFilter}
            items={toSelectItems(CLIENTS_WORKS_ALL_CONTENT_FILTERS)}
            onValueChange={(value) =>
              onContentFilterChange(value as ClientsWorksAllContentFilter)
            }
          >
            <SelectTrigger id="all-content-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS_WORKS_ALL_CONTENT_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="all-sort">Sort by</Label>
          <Select
            value={sort}
            items={toSelectItems(CLIENTS_WORKS_ALL_SORT_OPTIONS)}
            onValueChange={(value) =>
              onSortChange(value as ClientsWorksAllListSort)
            }
          >
            <SelectTrigger id="all-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CLIENTS_WORKS_ALL_SORT_OPTIONS.map((option) => (
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

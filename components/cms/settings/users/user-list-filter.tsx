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
  USER_LIST_SORT_OPTIONS,
  USER_ROLE_FILTERS,
  USER_STATUS_FILTERS,
  type UserListSort,
  type UserRoleFilter,
  type UserStatusFilter,
} from "@/config/user-list";
import {
  LIST_FILTER_FIELD_CLASS,
  LIST_FILTER_FIELDS_CLASS,
} from "@/config/list-toolbar";

interface UserListFilterProps {
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;
  sort: UserListSort;
  hasActiveFilters: boolean;
  onStatusFilterChange: (filter: UserStatusFilter) => void;
  onRoleFilterChange: (filter: UserRoleFilter) => void;
  onSortChange: (sort: UserListSort) => void;
  onReset: () => void;
}

export function UserListFilter({
  statusFilter,
  roleFilter,
  sort,
  hasActiveFilters,
  onStatusFilterChange,
  onRoleFilterChange,
  onSortChange,
  onReset,
}: UserListFilterProps) {
  return (
    <CmsListFilterPopover hasActiveFilters={hasActiveFilters} onReset={onReset}>
      <div className={LIST_FILTER_FIELDS_CLASS}>
        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="user-status-filter">Status</Label>
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              onStatusFilterChange(value as UserStatusFilter)
            }
          >
            <SelectTrigger id="user-status-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_STATUS_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="user-role-filter">Role</Label>
          <Select
            value={roleFilter}
            onValueChange={(value) =>
              onRoleFilterChange(value as UserRoleFilter)
            }
          >
            <SelectTrigger id="user-role-filter" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLE_FILTERS.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={LIST_FILTER_FIELD_CLASS}>
          <Label htmlFor="user-sort">Sort by</Label>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as UserListSort)}
          >
            <SelectTrigger id="user-sort" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {USER_LIST_SORT_OPTIONS.map((option) => (
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

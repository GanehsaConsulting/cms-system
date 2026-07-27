"use client";

import { useCallback, useMemo, useState } from "react";

/** Checkbox multi-select for CMS list tables (page-scoped). */
export function useListBulkSelection(visibleIds: string[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedIdSet = useMemo(
    () => new Set(selectedIds),
    [selectedIds],
  );

  const isSelected = useCallback(
    (id: string) => selectedIdSet.has(id),
    [selectedIdSet],
  );

  const toggle = useCallback((id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id],
    );
  }, []);

  const clear = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(visibleIds);
  }, [visibleIds]);

  const hasSelection = selectedIds.length > 0;
  const isAllSelected =
    visibleIds.length > 0 &&
    visibleIds.every((id) => selectedIdSet.has(id));
  const isIndeterminate = hasSelection && !isAllSelected;

  return {
    selectedIds,
    selectedIdSet,
    selectedCount: selectedIds.length,
    hasSelection,
    isSelected,
    toggle,
    clear,
    selectAll,
    isAllSelected,
    isIndeterminate,
  };
}

export type ListBulkSelection = ReturnType<typeof useListBulkSelection>;

"use client";

import { useCallback, useMemo, useState } from "react";

export function useMediaLibraryFileSelection(visibleFileIds: string[]) {
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
    setSelectedIds(visibleFileIds);
  }, [visibleFileIds]);

  const hasSelection = selectedIds.length > 0;
  const isAllSelected =
    visibleFileIds.length > 0 &&
    visibleFileIds.every((id) => selectedIdSet.has(id));
  const isIndeterminate = hasSelection && !isAllSelected;

  return {
    selectedIds,
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

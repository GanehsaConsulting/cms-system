"use client";

import { useEffect, useMemo, useState } from "react";
import { MEDIA_LIBRARY_ALL_FILES_ID } from "@/config/media-library";
import { filterMediaFoldersBySearch } from "@/lib/media/folders";
import {
  filterMediaAssetsByType,
  filterMediaLibraryFilesBySearch,
} from "@/lib/media/list";
import {
  readStoredMediaViewMode,
  writeStoredMediaViewMode,
} from "@/lib/media/storage";
import type {
  MediaFolder,
  MediaLibraryFile,
  MediaTypeFilter,
  MediaViewMode,
} from "@/types/media";

export function useMediaLibraryLibraryList(
  folders: MediaFolder[],
  files: MediaLibraryFile[],
) {
  const [activeFolderId, setActiveFolderId] = useState<string>(
    MEDIA_LIBRARY_ALL_FILES_ID,
  );
  const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
  const [search, setSearch] = useState("");
  const [viewMode, setViewModeState] = useState<MediaViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setViewModeState(readStoredMediaViewMode());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID) {
      return;
    }

    const exists = folders.some((folder) => folder.id === activeFolderId);
    if (!exists) {
      setActiveFolderId(MEDIA_LIBRARY_ALL_FILES_ID);
    }
  }, [activeFolderId, folders]);

  function setViewMode(mode: MediaViewMode) {
    setViewModeState(mode);
    writeStoredMediaViewMode(mode);
  }

  const isAllFilesView = activeFolderId === MEDIA_LIBRARY_ALL_FILES_ID;

  const scopedFiles = useMemo(() => {
    if (isAllFilesView) {
      return [];
    }

    return files.filter((file) => file.folderId === activeFolderId);
  }, [activeFolderId, files, isAllFilesView]);

  const filteredFiles = useMemo(() => {
    const byType = filterMediaAssetsByType(scopedFiles, typeFilter);
    return filterMediaLibraryFilesBySearch(byType, search);
  }, [scopedFiles, search, typeFilter]);

  const childFoldersRaw = useMemo(() => {
    if (isAllFilesView) {
      return folders.filter((folder) => folder.parentId === null);
    }

    return folders.filter((folder) => folder.parentId === activeFolderId);
  }, [activeFolderId, folders, isAllFilesView]);

  const childFolders = useMemo(() => {
    if (!isAllFilesView) {
      return childFoldersRaw;
    }

    return filterMediaFoldersBySearch(childFoldersRaw, search);
  }, [childFoldersRaw, isAllFilesView, search]);

  const selectedFolder = isAllFilesView
    ? null
    : (folders.find((folder) => folder.id === activeFolderId) ?? null);

  const hasActiveFilters = isAllFilesView
    ? search.trim().length > 0
    : typeFilter !== "all" || search.trim().length > 0;

  function resetFilters() {
    if (!isAllFilesView) {
      setTypeFilter("all");
    }
    setSearch("");
  }

  function selectFolder(folderId: string) {
    if (folderId === MEDIA_LIBRARY_ALL_FILES_ID) {
      setTypeFilter("all");
    }
    setSearch("");
    setActiveFolderId(folderId);
  }

  return {
    activeFolderId,
    setActiveFolderId: selectFolder,
    isAllFilesView,
    selectedFolder,
    childFolders,
    childFolderTotalCount: childFoldersRaw.length,
    files: filteredFiles,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    viewMode: hydrated ? viewMode : "grid",
    setViewMode,
    hasActiveFilters,
    resetFilters,
    totalCount: scopedFiles.length,
    filteredCount: filteredFiles.length,
    canUpload: !isAllFilesView,
    canManageFolder: selectedFolder !== null,
  };
}

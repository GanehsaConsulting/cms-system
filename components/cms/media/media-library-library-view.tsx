"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MediaLibraryFolderActions } from "@/components/cms/media/media-library-folder-actions";
import { MediaLibraryFolderBreadcrumb } from "@/components/cms/media/media-library-folder-breadcrumb";
import { MediaLibraryFolderMoveDialog } from "@/components/cms/media/media-library-folder-move-dialog";
import { MediaLibraryFolderSidebar } from "@/components/cms/media/media-library-folder-sidebar";
import { MediaLibraryFolderView } from "@/components/cms/media/media-library-folder-view";
import { MediaLibraryLibraryGrid } from "@/components/cms/media/media-library-library-grid";
import { MediaLibraryLibraryMoveDialog } from "@/components/cms/media/media-library-library-move-dialog";
import { MediaLibraryLibrarySelectionBar } from "@/components/cms/media/media-library-library-selection-bar";
import { MediaLibraryLibraryTable } from "@/components/cms/media/media-library-library-table";
import { MediaLibrarySearch } from "@/components/cms/media/media-library-search";
import { MediaLibraryTypeTabs } from "@/components/cms/media/media-library-type-tabs";
import { MediaLibraryUploadButton } from "@/components/cms/media/media-library-upload-button";
import { MediaLibraryViewToggle } from "@/components/cms/media/media-library-view-toggle";
import { GlassSurface } from "@/components/shared/glass-surface";
import { useConfirmDialog } from "@/hooks/use-confirm-dialog";
import { useMediaLibraryFileSelection } from "@/hooks/use-media-library-file-selection";
import { useMediaLibraryLibraryList } from "@/hooks/use-media-library-library-list";
import { deleteMediaLibraryFilesAction } from "@/lib/actions/media-files";
import { deleteMediaFolderAction } from "@/lib/actions/media-folders";
import { getRootSelectedFolderIds } from "@/lib/media/folders";
import { countMediaAssetsByKind } from "@/lib/media/list";
import { LIST_TOOLBAR_CLASS } from "@/config/list-toolbar";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { MediaFolder, MediaLibraryFile } from "@/types/media";
import { cn } from "@/lib/utils";

interface MediaLibraryLibraryViewProps {
  folders: MediaFolder[];
  files: MediaLibraryFile[];
}

export function MediaLibraryLibraryView({
  folders,
  files: initialFiles,
}: MediaLibraryLibraryViewProps) {
  const router = useRouter();
  const [fileMoveOpen, setFileMoveOpen] = useState(false);
  const [folderMoveOpen, setFolderMoveOpen] = useState(false);
  const [isBatchPending, startBatchTransition] = useTransition();
  const { requestConfirm, confirmDialog } = useConfirmDialog(isBatchPending);

  const {
    activeFolderId,
    setActiveFolderId,
    isAllFilesView,
    selectedFolder,
    childFolders,
    childFolderTotalCount,
    files,
    typeFilter,
    setTypeFilter,
    search,
    setSearch,
    viewMode,
    setViewMode,
    hasActiveFilters,
    resetFilters,
    totalCount,
    filteredCount,
    canUpload,
    canManageFolder,
  } = useMediaLibraryLibraryList(folders, initialFiles);

  const visibleFileIds = useMemo(() => files.map((file) => file.id), [files]);
  const visibleFolderIds = useMemo(
    () => childFolders.map((folder) => folder.id),
    [childFolders],
  );

  const fileSelection = useMediaLibraryFileSelection(visibleFileIds);
  const folderSelection = useMediaLibraryFileSelection(visibleFolderIds);

  useEffect(() => {
    fileSelection.clear();
    folderSelection.clear();
  }, [activeFolderId, fileSelection.clear, folderSelection.clear]);

  const folderFiles = initialFiles.filter(
    (file) => file.folderId === activeFolderId,
  );
  const kindCounts = countMediaAssetsByKind(folderFiles);
  const currentParentId = isAllFilesView ? null : activeFolderId;

  function handleToggleFileSelect(id: string) {
    folderSelection.clear();
    fileSelection.toggle(id);
  }

  function handleToggleFolderSelect(id: string) {
    fileSelection.clear();
    folderSelection.toggle(id);
  }

  function handleToggleSelectAllFiles() {
    folderSelection.clear();
    if (fileSelection.isAllSelected) {
      fileSelection.clear();
      return;
    }
    fileSelection.selectAll();
  }

  function handleToggleSelectAllFolders() {
    fileSelection.clear();
    if (folderSelection.isAllSelected) {
      folderSelection.clear();
      return;
    }
    folderSelection.selectAll();
  }

  function handleBatchDeleteFiles() {
    requestConfirm({
      title: `Delete ${fileSelection.selectedCount} ${fileSelection.selectedCount === 1 ? "file" : "files"}?`,
      description: "These files will be removed from your library.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startBatchTransition(async () => {
          const result = await deleteMediaLibraryFilesAction(
            fileSelection.selectedIds,
          );
          if (!result.success) {
            return;
          }

          fileSelection.clear();
          router.refresh();
        });
      },
    });
  }

  function handleBatchDeleteFolders() {
    const rootIds = getRootSelectedFolderIds(
      folders,
      folderSelection.selectedIds,
    );

    requestConfirm({
      title: `Delete ${rootIds.length} ${rootIds.length === 1 ? "folder" : "folders"}?`,
      description:
        "Subfolders and files inside the selected folders will also be deleted.",
      confirmLabel: "Delete",
      variant: "destructive",
      onConfirm: () => {
        startBatchTransition(async () => {
          for (const id of rootIds) {
            const result = await deleteMediaFolderAction(id);
            if (!result.success) {
              return;
            }
          }

          folderSelection.clear();
          router.refresh();
        });
      },
    });
  }

  function renderFolderView(showBottomBorder: boolean) {
    return (
      <>
        <MediaLibraryLibrarySelectionBar
          selectedCount={folderSelection.selectedCount}
          disabled={isBatchPending}
          onMove={() => setFolderMoveOpen(true)}
          onDelete={handleBatchDeleteFolders}
          onClear={folderSelection.clear}
        />
        <MediaLibraryFolderView
          folders={childFolders}
          allFolders={folders}
          files={initialFiles}
          viewMode={viewMode}
          onOpen={setActiveFolderId}
          isSelected={folderSelection.isSelected}
          hasSelection={folderSelection.hasSelection}
          onToggleSelect={handleToggleFolderSelect}
          isAllSelected={folderSelection.isAllSelected}
          isIndeterminate={folderSelection.isIndeterminate}
          onToggleSelectAll={handleToggleSelectAllFolders}
          showBottomBorder={showBottomBorder}
        />
      </>
    );
  }

  return (
    <div className={cn("flex min-h-0 gap-4", CMS_FLEX_CHILD)}>
      <MediaLibraryFolderSidebar
        folders={folders}
        activeFolderId={activeFolderId}
        onSelect={setActiveFolderId}
      />

      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-(--separator) border-b px-4 py-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-sm">
              {isAllFilesView ? "All files" : (selectedFolder?.name ?? "Folder")}
            </h2>
            <p className="text-muted-foreground text-xs">
              {isAllFilesView
                ? `${childFolders.length} of ${childFolderTotalCount} folders`
                : `${filteredCount} of ${totalCount} files · ${kindCounts.image} images · ${kindCounts.video} videos · ${kindCounts.document} documents`}
            </p>
          </div>

          <div className={LIST_TOOLBAR_CLASS}>
            <MediaLibrarySearch
              value={search}
              onChange={setSearch}
              placeholder={
                isAllFilesView ? "Search folders..." : "Search media..."
              }
              ariaLabel={
                isAllFilesView ? "Search folders" : "Search media"
              }
            />
            <MediaLibraryFolderActions
              activeFolderId={activeFolderId}
              selectedFolder={canManageFolder ? selectedFolder : null}
              allFolders={folders}
              allFiles={initialFiles}
            />
            {!isAllFilesView ? (
              <MediaLibraryUploadButton
                folderId={canUpload ? activeFolderId : null}
                disabled={!canUpload}
              />
            ) : null}
            <MediaLibraryViewToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>

        {!isAllFilesView ? (
          <MediaLibraryFolderBreadcrumb
            folders={folders}
            activeFolderId={activeFolderId}
            onSelect={setActiveFolderId}
          />
        ) : null}

        {isAllFilesView ? (
          childFolders.length > 0 ? (
            <div className={cn(CMS_SCROLL_REGION, "flex flex-col")}>
              {renderFolderView(false)}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
              <p className="font-medium text-sm">
                {childFolderTotalCount === 0
                  ? "No folders yet"
                  : "No folders found"}
              </p>
              <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
                {childFolderTotalCount === 0
                  ? "Create a folder to start organizing and uploading media."
                  : "Try a different search keyword."}
              </p>
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-3 text-primary text-sm hover:underline"
                >
                  Reset search
                </button>
              ) : null}
            </div>
          )
        ) : (
          <>
            {childFolders.length > 0 ? (
              <div className="shrink-0">
                {renderFolderView(files.length > 0 || totalCount > 0)}
              </div>
            ) : null}

            {files.length > 0 ? (
              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <div className="shrink-0 border-(--separator) border-b px-4 py-3">
                  <MediaLibraryTypeTabs
                    value={typeFilter}
                    onChange={setTypeFilter}
                  />
                </div>

                <MediaLibraryLibrarySelectionBar
                  selectedCount={fileSelection.selectedCount}
                  disabled={isBatchPending}
                  onMove={() => setFileMoveOpen(true)}
                  onDelete={handleBatchDeleteFiles}
                  onClear={fileSelection.clear}
                />

                <div className={CMS_SCROLL_REGION}>
                  {viewMode === "grid" ? (
                    <MediaLibraryLibraryGrid
                      files={files}
                      isSelected={fileSelection.isSelected}
                      hasSelection={fileSelection.hasSelection}
                      onToggleSelect={handleToggleFileSelect}
                    />
                  ) : (
                    <MediaLibraryLibraryTable
                      files={files}
                      isSelected={fileSelection.isSelected}
                      onToggleSelect={handleToggleFileSelect}
                      isAllSelected={fileSelection.isAllSelected}
                      isIndeterminate={fileSelection.isIndeterminate}
                      onToggleSelectAll={handleToggleSelectAllFiles}
                    />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
                <p className="font-medium text-sm">
                  {totalCount === 0 ? "No files in this folder" : "No files found"}
                </p>
                <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
                  {totalCount === 0
                    ? "Upload files to this folder or open a subfolder."
                    : "Try changing the type filter or search keywords."}
                </p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-3 text-primary text-sm hover:underline"
                  >
                    Reset filters
                  </button>
                ) : null}
              </div>
            )}
          </>
        )}
      </GlassSurface>

      {!isAllFilesView ? (
        <MediaLibraryLibraryMoveDialog
          open={fileMoveOpen}
          onOpenChange={setFileMoveOpen}
          fileIds={fileSelection.selectedIds}
          folders={folders}
          currentFolderId={activeFolderId}
          onMoved={fileSelection.clear}
        />
      ) : null}

      <MediaLibraryFolderMoveDialog
        open={folderMoveOpen}
        onOpenChange={setFolderMoveOpen}
        folderIds={folderSelection.selectedIds}
        folders={folders}
        currentParentId={currentParentId}
        onMoved={folderSelection.clear}
      />

      {confirmDialog}
    </div>
  );
}

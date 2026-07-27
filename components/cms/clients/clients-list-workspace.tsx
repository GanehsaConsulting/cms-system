"use client";

import { ClientDetailPanel } from "@/components/cms/clients/client-detail-panel";
import { ClientListTable } from "@/components/cms/clients/client-list-table";
import { ClientsListBulkBar } from "@/components/cms/clients/clients-list-bulk-bar";
import { CmsListPagination } from "@/components/shared/cms-list-pagination";
import { GlassSurface } from "@/components/shared/glass-surface";
import type { ClientListSort } from "@/config/client-list";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { ClientListPreviewMode } from "@/lib/clients/preview";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientsListWorkspaceProps {
  clients: Client[];
  selectedClient: Client | null;
  selectedId: string | null;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  sort: ClientListSort;
  previewMode?: ClientListPreviewMode;
  bulkSelectedIds: string[];
  bulkSelectedIdSet: Set<string>;
  isAllBulkSelected: boolean;
  isBulkIndeterminate: boolean;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSortChange: (sort: ClientListSort) => void;
  onToggleBulk: (id: string) => void;
  onToggleBulkAll: (checked: boolean) => void;
  onClearBulk: () => void;
  className?: string;
}

export function ClientsListWorkspace({
  clients,
  selectedClient,
  selectedId,
  page,
  pageSize,
  total,
  totalPages,
  rangeStart,
  rangeEnd,
  sort,
  previewMode = "auto",
  bulkSelectedIds,
  bulkSelectedIdSet,
  isAllBulkSelected,
  isBulkIndeterminate,
  onSelect,
  onClosePanel,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onToggleBulk,
  onToggleBulkAll,
  onClearBulk,
  className,
}: ClientsListWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        {clients.length > 0 ? (
          <>
            <ClientsListBulkBar
              selectedIds={bulkSelectedIds}
              onClear={onClearBulk}
            />
            <div className={CMS_SCROLL_REGION}>
              <ClientListTable
                clients={clients}
                selectedId={selectedId}
                sort={sort}
                previewMode={previewMode}
                bulkSelectedIds={bulkSelectedIdSet}
                isAllBulkSelected={isAllBulkSelected}
                isBulkIndeterminate={isBulkIndeterminate}
                onSelect={onSelect}
                onSortChange={onSortChange}
                onToggleBulk={onToggleBulk}
                onToggleBulkAll={onToggleBulkAll}
              />
            </div>
            <CmsListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              totalPages={totalPages}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              itemLabel="clients"
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-10 text-center">
            <p className="font-medium text-sm">No clients found</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Try changing filters or search keywords.
            </p>
          </div>
        )}
      </GlassSurface>

      {selectedClient ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <ClientDetailPanel
            client={selectedClient}
            previewMode={previewMode}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}

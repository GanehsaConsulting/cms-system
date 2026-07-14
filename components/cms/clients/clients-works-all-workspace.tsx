"use client";

import { ClientsWorksAllDetailPanel } from "@/components/cms/clients/clients-works-all-detail-panel";
import { ClientsWorksAllTable } from "@/components/cms/clients/clients-works-all-table";
import { GlassSurface } from "@/components/shared/glass-surface";
import { CMS_FLEX_CHILD, CMS_SCROLL_REGION } from "@/config/spacing";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { cn } from "@/lib/utils";

interface ClientsWorksAllWorkspaceProps {
  groups: ClientWithWorks[];
  selectedId: string | null;
  selectedGroup: ClientWithWorks | null;
  clientCount: number;
  withWorksCount: number;
  portfolioCount: number;
  hasActiveFilters?: boolean;
  onSelect: (id: string) => void;
  onClosePanel: () => void;
  onResetFilters?: () => void;
  className?: string;
}

export function ClientsWorksAllWorkspace({
  groups,
  selectedId,
  selectedGroup,
  clientCount,
  withWorksCount,
  portfolioCount,
  hasActiveFilters = false,
  onSelect,
  onClosePanel,
  onResetFilters,
  className,
}: ClientsWorksAllWorkspaceProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 gap-3 overflow-hidden",
        CMS_FLEX_CHILD,
        className,
      )}
    >
      <GlassSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between gap-2 border-(--separator) border-b px-4 py-3">
          <div>
            <h2 className="font-semibold text-sm">Clients & works</h2>
            <p className="text-muted-foreground text-xs">
              {clientCount} clients · {withWorksCount} with portfolio ·{" "}
              {portfolioCount} works
            </p>
          </div>
        </div>
        <div className={CMS_SCROLL_REGION}>
          {groups.length > 0 ? (
            <ClientsWorksAllTable
              groups={groups}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="font-medium text-sm">No matching clients</p>
              <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
                {hasActiveFilters
                  ? "Try adjusting your search or filters."
                  : "No clients to display."}
              </p>
              {hasActiveFilters && onResetFilters ? (
                <button
                  type="button"
                  onClick={onResetFilters}
                  className="mt-3 text-primary text-sm hover:underline"
                >
                  Reset filters
                </button>
              ) : null}
            </div>
          )}
        </div>
      </GlassSurface>

      {selectedGroup ? (
        <GlassSurface className="hidden min-h-0 w-[24rem] shrink-0 flex-col overflow-hidden lg:flex">
          <ClientsWorksAllDetailPanel
            group={selectedGroup}
            onClose={onClosePanel}
          />
        </GlassSurface>
      ) : null}
    </div>
  );
}

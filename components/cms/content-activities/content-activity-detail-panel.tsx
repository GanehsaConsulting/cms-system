"use client";

import { XIcon } from "@/lib/icons";
import { ContentActivityDetailPanelActions } from "@/components/cms/content-activities/content-activity-detail-panel-actions";
import { ContentActivityDetailTabDetail } from "@/components/cms/content-activities/content-activity-detail-tab-detail";
import { ContentActivityKindBadge } from "@/components/cms/content-activities/content-activity-kind-badge";
import { ContentActivityStatusBadge } from "@/components/cms/content-activities/content-activity-status-badge";
import { ActivityLogPanel } from "@/components/shared/activity-log-panel";
import { Button } from "@/components/ui/button";
import type { ContentActivity } from "@/types/content-activity";

interface ContentActivityDetailPanelProps {
  item: ContentActivity;
  onClose: () => void;
}

export function ContentActivityDetailPanel({
  item,
  onClose,
}: ContentActivityDetailPanelProps) {
  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-(--separator) border-b p-4">
        <div className="min-w-0 space-y-2">
          <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
            Detail
          </p>
          <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
            {item.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <ContentActivityKindBadge kind={item.kind} />
            <ContentActivityStatusBadge status={item.status} />
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon-sm"
          className="size-8 shrink-0 bg-white/45 dark:bg-secondary"
          aria-label="Close panel"
          onClick={onClose}
        >
          <XIcon className="size-4" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <ContentActivityDetailTabDetail item={item} />
        <ActivityLogPanel
          entityType="content_activity"
          entityId={item.id}
          className="mt-6"
        />
      </div>

      <ContentActivityDetailPanelActions item={item} />
    </aside>
  );
}

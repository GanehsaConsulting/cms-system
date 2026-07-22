"use client";

import { useEffect, useState } from "react";
import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { getEntityActivityAction } from "@/lib/actions/activity";
import { formatActivityRelativeTime } from "@/lib/activity/format-relative-time";
import { cn } from "@/lib/utils";
import type { ActivityEntityType, ActivityEvent } from "@/types/activity";

interface ActivityLogListProps {
  events: ActivityEvent[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityLogList({
  events,
  emptyMessage = "No activity yet.",
  className,
}: ActivityLogListProps) {
  if (events.length === 0) {
    return (
      <p className={cn("text-muted-foreground text-xs", className)}>
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-start gap-2.5 rounded-(--radius-inner) bg-white/40 px-3 py-2.5 dark:bg-neutral-500/30"
        >
          <SidebarProfileAvatar
            name={event.actorName}
            avatarUrl={event.actorImageUrl ?? undefined}
            size="xs"
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm leading-snug">{event.summary}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
              {formatActivityRelativeTime(event.createdAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

interface ActivityLogPanelProps {
  entityType: ActivityEntityType;
  entityId: string;
  label?: string;
  className?: string;
}

export function ActivityLogPanel({
  entityType,
  entityId,
  label = "Activity",
  className,
}: ActivityLogPanelProps) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const result = await getEntityActivityAction(entityType, entityId);
      if (cancelled) {
        return;
      }

      if (result.success) {
        setEvents(result.events);
      } else {
        setEvents([]);
      }
      setLoading(false);
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [entityType, entityId]);

  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
        {label}
      </h3>
      {loading ? (
        <p className="text-muted-foreground text-xs">Loading activity…</p>
      ) : (
        <ActivityLogList events={events} />
      )}
    </section>
  );
}

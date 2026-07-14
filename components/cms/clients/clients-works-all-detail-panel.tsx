"use client";

import Image from "next/image";
import { XIcon } from "@/lib/icons";
import { ClientDetailTabDetail } from "@/components/cms/clients/client-detail-tab-detail";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { ClientsWorksAllDetailPanelActions } from "@/components/cms/clients/clients-works-all-detail-panel-actions";
import { ClientsWorksAllDetailWorks } from "@/components/cms/clients/clients-works-all-detail-works";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import type { ClientWithWorks } from "@/lib/clients/group-with-works";
import { cn } from "@/lib/utils";

interface ClientsWorksAllDetailPanelProps {
  group: ClientWithWorks;
  onClose: () => void;
}

export function ClientsWorksAllDetailPanel({
  group,
  onClose,
}: ClientsWorksAllDetailPanelProps) {
  const { client, works } = group;

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-(--separator) border-b p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              RADIUS_DEEP,
              "relative flex size-11 shrink-0 items-center justify-center overflow-hidden bg-white/45 dark:bg-white/10",
            )}
          >
            {client.logo ? (
              <Image
                src={client.logo}
                alt=""
                fill
                unoptimized
                className="object-contain p-1.5"
              />
            ) : (
              <span className="font-medium text-muted-foreground text-sm">
                {client.name.slice(0, 1).toUpperCase() || "?"}
              </span>
            )}
          </div>
          <div className="min-w-0 space-y-2">
            <p className="font-medium text-[11px] text-muted-foreground uppercase tracking-wide">
              Detail
            </p>
            <h2 className="line-clamp-2 font-semibold text-sm leading-snug">
              {client.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <ClientFeaturedBadge featured={client.featured} />
              <span className="text-muted-foreground text-xs">
                {works.length === 0
                  ? "No works"
                  : works.length === 1
                    ? "1 work"
                    : `${works.length} works`}
              </span>
            </div>
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

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
        <ClientsWorksAllDetailWorks works={works} />
        <ClientDetailTabDetail client={client} />
      </div>

      <ClientsWorksAllDetailPanelActions client={client} />
    </aside>
  );
}

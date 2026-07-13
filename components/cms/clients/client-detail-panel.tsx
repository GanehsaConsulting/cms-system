"use client";

import Image from "next/image";
import { XIcon } from "@/lib/icons";
import { ClientDetailPanelActions } from "@/components/cms/clients/client-detail-panel-actions";
import { ClientDetailTabDetail } from "@/components/cms/clients/client-detail-tab-detail";
import { ClientFeaturedBadge } from "@/components/cms/clients/client-featured-badge";
import { Button } from "@/components/ui/button";
import { RADIUS_DEEP } from "@/config/shape";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientDetailPanelProps {
  client: Client;
  onClose: () => void;
}

export function ClientDetailPanel({ client, onClose }: ClientDetailPanelProps) {
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
            <ClientFeaturedBadge featured={client.featured} />
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
        <ClientDetailTabDetail client={client} />
      </div>

      <ClientDetailPanelActions client={client} />
    </aside>
  );
}

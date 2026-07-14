"use client";

import Image from "next/image";
import Link from "next/link";
import { PortfolioWorkTypeBadge } from "@/components/cms/portfolio/portfolio-work-type-badge";
import { CmsDetailMetaGroup } from "@/components/shared/cms-detail-meta-group";
import { CmsDetailMetaRow } from "@/components/shared/cms-detail-meta-row";
import { RADIUS_DEEP } from "@/config/shape";
import { formatPortfolioDateParts } from "@/lib/portfolio/list";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ClientsWorksAllDetailWorksProps {
  works: Portfolio[];
}

export function ClientsWorksAllDetailWorks({
  works,
}: ClientsWorksAllDetailWorksProps) {
  if (works.length === 0) {
    return (
      <CmsDetailMetaGroup label="Portfolio">
        <CmsDetailMetaRow label="Works" showDivider={false}>
          None yet
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    );
  }

  return (
    <section className="space-y-1.5">
      <h3 className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Portfolio ({works.length})
      </h3>
      <ul className="overflow-hidden rounded-(--radius-inner) bg-white/40 dark:bg-neutral-500/30">
        {works.map((work, index) => {
          const updated = formatPortfolioDateParts(work.updatedAt);

          return (
            <li key={work.id}>
              <Link
                href={`/clients/portfolio/${work.id}/edit`}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-black/4 dark:hover:bg-white/6",
                  index < works.length - 1 && "border-(--separator) border-b",
                )}
              >
                <div
                  className={cn(
                    RADIUS_DEEP,
                    "relative size-9 shrink-0 overflow-hidden bg-muted",
                  )}
                >
                  {work.coverImage ? (
                    <Image
                      src={work.coverImage}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center font-medium text-[10px] text-muted-foreground">
                      {work.title.slice(0, 1).toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm">{work.title}</p>
                  <p className="truncate text-muted-foreground text-[11px]">
                    {updated.date}
                  </p>
                </div>
                <PortfolioWorkTypeBadge workType={work.workType} />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

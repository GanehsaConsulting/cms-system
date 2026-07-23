"use client";

import Image from "next/image";
import Link from "next/link";
import { PortfolioWorkTypeBadge } from "@/components/cms/portfolio/portfolio-work-type-badge";
import { useCmsImagePreview } from "@/components/shared/cms-image-preview-provider";
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
  const { openPreview } = useCmsImagePreview();

  if (works.length === 0) {
    return (
      <CmsDetailMetaGroup label="Portfolio">
        <CmsDetailMetaRow label="Works" showDivider={false}>
          None yet
        </CmsDetailMetaRow>
      </CmsDetailMetaGroup>
    );
  }

  const previewableCovers = works
    .map((work) => work.coverImage)
    .filter((url): url is string => Boolean(url?.trim()));

  return (
    <section className="space-y-1.5">
      <h3 className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">
        Portfolio ({works.length})
      </h3>
      <ul className="overflow-hidden rounded-(--radius-inner) bg-white/40 dark:bg-neutral-500/30">
        {works.map((work, index) => {
          const updated = formatPortfolioDateParts(work.updatedAt);
          const coverIndex = work.coverImage
            ? previewableCovers.indexOf(work.coverImage)
            : -1;

          return (
            <li key={work.id}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5",
                  index < works.length - 1 && "border-(--separator) border-b",
                )}
              >
                {work.coverImage ? (
                  <button
                    type="button"
                    aria-label={`Preview ${work.title} cover`}
                    onClick={() =>
                      openPreview({
                        images: previewableCovers,
                        index: Math.max(coverIndex, 0),
                        title: work.title,
                      })
                    }
                    className={cn(
                      RADIUS_DEEP,
                      "relative size-9 shrink-0 overflow-hidden bg-muted",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    )}
                  >
                    <Image
                      src={work.coverImage}
                      alt=""
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </button>
                ) : (
                  <div
                    className={cn(
                      RADIUS_DEEP,
                      "relative size-9 shrink-0 overflow-hidden bg-muted",
                    )}
                  >
                    <span className="flex size-full items-center justify-center font-medium text-[10px] text-muted-foreground">
                      {work.title.slice(0, 1).toUpperCase() || "?"}
                    </span>
                  </div>
                )}
                <Link
                  href={`/clients/portfolio/${work.id}/edit`}
                  className="min-w-0 flex-1 transition-colors hover:opacity-80"
                >
                  <p className="truncate font-medium text-sm">{work.title}</p>
                  <p className="truncate text-muted-foreground text-[11px]">
                    {updated.date}
                  </p>
                </Link>
                <PortfolioWorkTypeBadge workType={work.workType} />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

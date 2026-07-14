"use client";

import Image from "next/image";
import Link from "next/link";
import { PORTFOLIO_WORK_TYPE_LABELS } from "@/config/clients-works";
import { RADIUS_DEEP } from "@/config/shape";
import type { Portfolio } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ClientsWorksAllWorksPreviewProps {
  works: Portfolio[];
}

const MAX_THUMBS = 3;

export function ClientsWorksAllWorksPreview({
  works,
}: ClientsWorksAllWorksPreviewProps) {
  if (works.length === 0) {
    return <span className="text-muted-foreground text-xs">—</span>;
  }

  const visible = works.slice(0, MAX_THUMBS);
  const remaining = works.length - visible.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {visible.map((work, index) => (
          <Link
            key={work.id}
            href={`/clients/portfolio/${work.id}/edit`}
            title={work.title}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              RADIUS_DEEP,
              "relative size-8 shrink-0 overflow-hidden bg-muted ring-2 ring-background transition-transform hover:z-10 hover:scale-105",
              index > 0 && "-ml-2",
            )}
            style={{ zIndex: visible.length - index }}
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
          </Link>
        ))}
        {remaining > 0 ? (
          <span
            className={cn(
              RADIUS_DEEP,
              "-ml-2 flex size-8 items-center justify-center bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background",
            )}
          >
            +{remaining}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 hidden sm:block">
        <p className="truncate text-xs font-medium leading-snug">
          {works.length === 1 ? works[0]?.title : `${works.length} works`}
        </p>
        <p className="truncate text-[11px] text-muted-foreground">
          {[
            ...new Set(
              works.map((work) => PORTFOLIO_WORK_TYPE_LABELS[work.workType]),
            ),
          ].join(" · ")}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { DocumentationCopyButton } from "@/components/cms/settings/documentation/documentation-copy-button";
import { DocumentationMarkdown } from "@/components/cms/settings/documentation/documentation-markdown";
import { DocumentationSidebar } from "@/components/cms/settings/documentation/documentation-sidebar";
import { SolidSurface } from "@/components/shared/solid-surface";
import { Badge } from "@/components/ui/badge";
import {
  FE_WIRING_DOC_SECTIONS,
  FE_WIRING_DOCS_INTRO,
} from "@/config/fe-wiring-docs";
import {
  CMS_FLEX_CHILD,
  CMS_SCROLL_REGION,
  SECTION_BODY_PADDING,
} from "@/config/spacing";
import { cn } from "@/lib/utils";

export function DocumentationView() {
  const [activeId, setActiveId] = useState(
    FE_WIRING_DOC_SECTIONS[0]?.id ?? "full-pack",
  );

  const activeSection =
    FE_WIRING_DOC_SECTIONS.find((section) => section.id === activeId) ??
    FE_WIRING_DOC_SECTIONS[0];

  if (!activeSection) {
    return null;
  }

  const isFullPack = activeSection.id === "full-pack";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden",
        SECTION_BODY_PADDING,
      )}
    >
      <div className={cn("flex min-h-0 gap-4", CMS_FLEX_CHILD)}>
        <DocumentationSidebar
          sections={FE_WIRING_DOC_SECTIONS}
          activeId={activeSection.id}
          onSelect={setActiveId}
        />

        <SolidSurface className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="flex shrink-0 flex-col gap-3 border-(--separator) border-b px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold text-sm tracking-tight">
                  {activeSection.title}
                </h2>
                {isFullPack ? (
                  <Badge
                    variant="secondary"
                    className="font-normal text-[0.65rem]"
                  >
                    Recommended
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {activeSection.summary}
              </p>
              <p className="text-muted-foreground/80 text-[0.7rem] leading-relaxed">
                {FE_WIRING_DOCS_INTRO.description}
              </p>
            </div>
            <DocumentationCopyButton
              value={activeSection.markdown}
              label="Copy"
              className="shrink-0"
            />
          </div>

          <div className={CMS_SCROLL_REGION}>
            <DocumentationMarkdown markdown={activeSection.markdown} />
          </div>
        </SolidSurface>
      </div>
    </div>
  );
}

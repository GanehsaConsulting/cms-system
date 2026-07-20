"use client";

import { SolidSurface } from "@/components/shared/solid-surface";
import type { FeWiringDocSection } from "@/config/fe-wiring-docs";
import { cn } from "@/lib/utils";

interface DocumentationSidebarProps {
  sections: FeWiringDocSection[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function DocumentationSidebar({
  sections,
  activeId,
  onSelect,
}: DocumentationSidebarProps) {
  return (
    <SolidSurface className="flex w-56 shrink-0 flex-col overflow-hidden">
      <div className="border-(--separator) border-b px-3 py-3">
        <p className="font-semibold text-sm">Content pages</p>
      </div>

      <nav
        className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-2"
        aria-label="Documentation sections"
      >
        {sections.map((section) => {
          const isActive = activeId === section.id;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                isActive
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span className="truncate">{section.title}</span>
            </button>
          );
        })}
      </nav>
    </SolidSurface>
  );
}

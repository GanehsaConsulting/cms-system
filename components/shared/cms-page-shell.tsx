"use client";

import { useCallback, useRef, useState } from "react";
import {
  CMS_FLEX_CHILD,
  CMS_PAGE_BODY_SCROLL_MASK,
  CMS_PAGE_BODY_SCROLL_MASK_NONE,
  CMS_PAGE_BODY_SCROLL_MASK_TRANSITION,
  CMS_PAGE_BODY_TOP_PADDING,
  SHELL_PADDING,
} from "@/config/spacing";
import { cn } from "@/lib/utils";

export { CMS_FLEX_CHILD };
export { CMS_SCROLL_REGION } from "@/config/spacing";

interface CmsPageShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  padded?: boolean;
  scrollable?: boolean;
}

/**
 * Viewport-bound page shell — optional header stays fixed, body scrolls inside glass panel.
 */
export function CmsPageShell({
  children,
  header,
  className,
  headerClassName,
  contentClassName,
  padded = true,
  scrollable = true,
}: CmsPageShellProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }

    setIsScrolled(element.scrollTop > 4);
  }, []);

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    >
      {header ? (
        <div
          className={cn(
            "relative z-20 shrink-0",
            padded && "px-3 pt-3",
            headerClassName,
          )}
        >
          {header}
        </div>
      ) : null}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          CMS_FLEX_CHILD,
          "flex flex-col",
          scrollable && "overflow-y-auto",
          header &&
            scrollable && [
              CMS_PAGE_BODY_SCROLL_MASK_TRANSITION,
              isScrolled
                ? CMS_PAGE_BODY_SCROLL_MASK
                : CMS_PAGE_BODY_SCROLL_MASK_NONE,
            ],
          padded &&
            (header
              ? cn("px-3 pb-3", CMS_PAGE_BODY_TOP_PADDING)
              : SHELL_PADDING),
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}

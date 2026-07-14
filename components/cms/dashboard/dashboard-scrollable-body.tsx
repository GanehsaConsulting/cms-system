"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { DASHBOARD_RECENT_LIST_MAX_HEIGHT } from "@/config/dashboard";
import { cn } from "@/lib/utils";

interface DashboardScrollableBodyProps {
  children: ReactNode;
  className?: string;
  empty?: boolean;
}

export function DashboardScrollableBody({
  children,
  className,
  empty = false,
}: DashboardScrollableBodyProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateFade = useCallback(() => {
    const element = scrollRef.current;
    if (!element) {
      setShowBottomFade(false);
      return;
    }

    const remaining =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    setShowBottomFade(remaining > 4);
  }, []);

  useEffect(() => {
    if (empty) {
      setShowBottomFade(false);
      return;
    }

    const element = scrollRef.current;
    if (!element) {
      return;
    }

    updateFade();

    const resizeObserver = new ResizeObserver(() => {
      updateFade();
    });
    resizeObserver.observe(element);

    const mutationObserver = new MutationObserver(() => {
      updateFade();
    });
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [empty, updateFade]);

  if (empty) {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      onScroll={updateFade}
      className={cn(
        "mt-3 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 transition-[mask-image] duration-200",
        DASHBOARD_RECENT_LIST_MAX_HEIGHT,
        showBottomFade
          ? "[mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-2.75rem),transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_calc(100%-2.75rem),transparent_100%)]"
          : undefined,
        className,
      )}
    >
      {children}
    </div>
  );
}

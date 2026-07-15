"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

interface MacOsFolderIconProps {
  className?: string;
  /** Icon width in px; height scales to macOS folder proportions. */
  size?: number;
}

export function MacOsFolderIcon({
  className,
  size = 64,
}: MacOsFolderIconProps) {
  const uid = useId().replace(/:/g, "");
  const height = Math.round(size * (52 / 64));

  return (
    <svg
      viewBox="0 0 64 52"
      width={size}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={`${uid}-body`}
          x1="32"
          y1="10"
          x2="32"
          y2="50"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--primary) 52%, white)" />
          <stop offset="0.5" stopColor="color-mix(in srgb, var(--primary) 68%, white)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 82%, white)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-back`}
          x1="32"
          y1="8"
          x2="32"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--primary) 78%, black)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 62%, black)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-tab`}
          x1="18"
          y1="8"
          x2="18"
          y2="18"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="color-mix(in srgb, var(--primary) 45%, white)" />
          <stop offset="1" stopColor="color-mix(in srgb, var(--primary) 58%, white)" />
        </linearGradient>
        <filter
          id={`${uid}-shadow`}
          x="0"
          y="0"
          width="64"
          height="56"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2"
            floodColor="rgb(0 0 0 / 0.16)"
          />
        </filter>
      </defs>

      {/* Back panel */}
      <path
        d="M8 12.5C8 10.5 9.6 9 11.6 9H21.2L24.8 12.6H52.4C54.4 12.6 56 14.2 56 16.2V40.5C56 42.5 54.4 44.1 52.4 44.1H11.6C9.6 44.1 8 42.5 8 40.5V12.5Z"
        fill={`url(#${uid}-back)`}
      />

      {/* Front body */}
      <path
        d="M5.5 16.8C5.5 14.6 7.3 12.8 9.5 12.8H19.8L23.8 16.8H51.5C53.7 16.8 55.5 18.6 55.5 20.8V42.8C55.5 45 53.7 46.8 51.5 46.8H9.5C7.3 46.8 5.5 45 5.5 42.8V16.8Z"
        fill={`url(#${uid}-body)`}
        filter={`url(#${uid}-shadow)`}
      />

      {/* Tab */}
      <path
        d="M9.5 12.8H19.8L23.8 16.8H9.8C8.1 16.8 6.6 15.8 5.8 14.3C6.8 13.4 8.1 12.8 9.5 12.8Z"
        fill={`url(#${uid}-tab)`}
      />
    </svg>
  );
}

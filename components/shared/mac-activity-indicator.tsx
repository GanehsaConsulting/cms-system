import { cn } from "@/lib/utils";

interface MacActivityIndicatorProps {
  className?: string;
}

/** iOS / macOS ProgressView-style spinner (petal bars). */
export function MacActivityIndicator({ className }: MacActivityIndicatorProps) {
  return (
    <svg
      className={cn("size-9 text-foreground", className)}
      viewBox="0 0 40 40"
      aria-hidden
    >
      {Array.from({ length: 12 }, (_, index) => (
        <rect
          key={index}
          x="18.5"
          y="3.5"
          width="3"
          height="9"
          rx="1.5"
          fill="currentColor"
          opacity={(index + 1) / 12}
          transform={`rotate(${index * 30} 20 20)`}
        >
          <animate
            attributeName="opacity"
            values="1;0.12"
            dur="0.9s"
            begin={`${(index / 12) * 0.9}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}

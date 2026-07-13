import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface SolidSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Solid elevated card inside the glass page shell.
 * Prefer this over GlassSurface when nested cards need opaque readability.
 */
export function SolidSurface({ children, className }: SolidSurfaceProps) {
  return (
    <div
      className={cn(
        RADIUS_INNER,
        "border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

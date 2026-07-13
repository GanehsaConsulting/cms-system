import { GLASS_SURFACE } from "@/config/glass";
import { RADIUS_INNER } from "@/config/shape";
import { cn } from "@/lib/utils";

interface GlassSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

/** L2 inner glass wrapper — cards, lists, sections inside GlassPanel. */
export function GlassSurface({ children, className }: GlassSurfaceProps) {
  return (
    <div className={cn(RADIUS_INNER, GLASS_SURFACE, className)}>{children}</div>
  );
}

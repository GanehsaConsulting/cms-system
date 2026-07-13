import {
  SETTINGS_ROW,
  SETTINGS_ROW_DIVIDER,
} from "@/config/settings-layout";
import { cn } from "@/lib/utils";

interface CmsDetailMetaRowProps {
  label: string;
  children: React.ReactNode;
  /** Stack label above value for long text. */
  stacked?: boolean;
  showDivider?: boolean;
  className?: string;
}

export function CmsDetailMetaRow({
  label,
  children,
  stacked = false,
  showDivider = true,
  className,
}: CmsDetailMetaRowProps) {
  return (
    <div
      className={cn(
        SETTINGS_ROW,
        stacked ? "flex-col items-stretch gap-1.5" : "justify-between gap-3",
        showDivider ? SETTINGS_ROW_DIVIDER : undefined,
        "last:border-b-0",
        className,
      )}
    >
      <dt className="shrink-0 text-muted-foreground text-sm">{label}</dt>
      <dd
        className={cn(
          "min-w-0 text-sm",
          stacked ? "text-left leading-relaxed" : "text-right font-medium",
        )}
      >
        {children}
      </dd>
    </div>
  );
}

import { SHELL_PADDING } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface CmsSectionLayoutProps {
  /** Pass `null` to omit the padded header wrapper entirely. */
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * Keeps section title/tabs mounted while child routes swap via `loading.tsx`.
 * Body padding is left to the child (list views / CmsPageShell forms).
 */
export function CmsSectionLayout({
  header,
  children,
  className,
}: CmsSectionLayoutProps) {
  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
    >
      {header ? (
        <div className={cn(SHELL_PADDING, "shrink-0 pb-0")}>{header}</div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}

import { SETTINGS_SECTION_LABEL } from "@/config/settings-layout";
import { cn } from "@/lib/utils";

const DETAIL_META_GROUP_SURFACE =
  "overflow-hidden rounded-[var(--radius-inner)] bg-white/40 dark:bg-neutral-500/30";

interface CmsDetailMetaGroupProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export function CmsDetailMetaGroup({
  label,
  children,
  className,
}: CmsDetailMetaGroupProps) {
  return (
    <section className={cn("space-y-1.5", className)}>
      {label ? <h3 className={SETTINGS_SECTION_LABEL}>{label}</h3> : null}
      <dl className={DETAIL_META_GROUP_SURFACE}>{children}</dl>
    </section>
  );
}

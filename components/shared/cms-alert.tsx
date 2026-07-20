import { SidebarAppIcon } from "@/components/shared/sidebar-app-icon";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CMS_ALERT_SURFACE,
  CMS_ALERT_VARIANT_CONFIG,
  type CmsAlertVariant,
} from "@/config/cms-alert";
import { cn } from "@/lib/utils";

interface CmsAlertProps {
  variant?: CmsAlertVariant;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  size?: "default" | "sm";
  className?: string;
  showTitle?: boolean;
}

export function CmsAlert({
  variant = "error",
  title,
  message,
  children,
  size = "default",
  className,
  showTitle = false,
}: CmsAlertProps) {
  const config = CMS_ALERT_VARIANT_CONFIG[variant];
  const Icon = config.icon;
  const content = children ?? message;

  if (!content) {
    return null;
  }

  const resolvedTitle = title ?? config.title;

  return (
    <Alert
      variant={variant === "error" ? "destructive" : "default"}
      className={cn(
        CMS_ALERT_SURFACE,
        "flex items-start gap-3 p-3",
        size === "sm" && "p-2.5",
        className,
      )}
    >
      <SidebarAppIcon
        icon={Icon}
        tone={config.tone}
        className="mt-0.5 shrink-0"
      />
      <div className="min-w-0 flex-1">
        {showTitle ? (
          <AlertTitle className="font-semibold text-sm leading-tight">
            {resolvedTitle}
          </AlertTitle>
        ) : null}
        <AlertDescription
          className={cn(
            "text-xs leading-relaxed md:text-sm",
            config.descriptionClassName,
            showTitle && "mt-0.5",
          )}
        >
          {content}
        </AlertDescription>
      </div>
    </Alert>
  );
}

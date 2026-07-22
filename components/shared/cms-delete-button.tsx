import { CMS_DELETE_BUTTON_CLASS } from "@/config/cms-actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CmsDeleteButtonProps = React.ComponentProps<typeof Button>;

export function CmsDeleteButton({
  className,
  variant = "destructive",
  size = "sm",
  ...props
}: CmsDeleteButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(CMS_DELETE_BUTTON_CLASS, "gap-1", className)}
      {...props}
    />
  );
}

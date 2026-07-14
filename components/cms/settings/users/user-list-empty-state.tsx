import { GlassSurface } from "@/components/shared/glass-surface";
import { Button } from "@/components/ui/button";
import { CMS_FLEX_CHILD } from "@/config/spacing";
import { cn } from "@/lib/utils";

interface UserListEmptyStateProps {
  onCreate: () => void;
}

export function UserListEmptyState({ onCreate }: UserListEmptyStateProps) {
  return (
    <GlassSurface
      className={cn(
        "flex flex-1 flex-col items-center justify-center p-10 text-center",
        CMS_FLEX_CHILD,
      )}
    >
      <p className="font-medium text-sm">No users yet</p>
      <p className="mt-1 max-w-md text-muted-foreground text-sm leading-relaxed">
        Add team members, assign roles, and control which brands each user can
        access.
      </p>
      <Button type="button" className="mt-4 h-8" onClick={onCreate}>
        Add User
      </Button>
    </GlassSurface>
  );
}

import { SidebarProfileAvatar } from "@/components/cms/sidebar-profile-avatar";
import { cn } from "@/lib/utils";

interface ArticleAuthorAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "xs" | "sm" | "md";
  className?: string;
}

export function ArticleAuthorAvatar({
  name,
  avatarUrl,
  size = "sm",
  className,
}: ArticleAuthorAvatarProps) {
  return (
    <SidebarProfileAvatar
      name={name}
      avatarUrl={avatarUrl ?? undefined}
      size={size}
      className={cn(className)}
    />
  );
}

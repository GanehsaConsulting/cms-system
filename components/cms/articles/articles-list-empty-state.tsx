import { PlusIcon } from "@/lib/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlassSurface } from "@/components/shared/glass-surface";

interface ArticlesListEmptyStateProps {
  title?: string;
  description?: string;
}

export function ArticlesListEmptyState({
  title = "No articles yet",
  description = "Create your first article to publish on the company profile website.",
}: ArticlesListEmptyStateProps) {
  return (
    <GlassSurface className="flex flex-1 flex-col items-center justify-center p-12 text-center">
      <p className="font-medium text-sm">{title}</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm">{description}</p>
      <Button
        nativeButton={false}
        render={<Link href="/articles/new" />}
        className="mt-4"
      >
        <PlusIcon />
        Create Article
      </Button>
    </GlassSurface>
  );
}

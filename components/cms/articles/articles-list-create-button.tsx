import { PlusIcon } from "@/lib/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ArticlesListCreateButton() {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/articles/new" />}
      className="h-9 gap-1.5"
    >
      <PlusIcon className="size-3.5" />
      Create Article
    </Button>
  );
}

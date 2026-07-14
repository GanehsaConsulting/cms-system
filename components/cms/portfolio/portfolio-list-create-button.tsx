import Link from "next/link";
import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function PortfolioListCreateButton() {
  return (
    <Button
      nativeButton={false}
      render={<Link href="/clients/portfolio/new" />}
      className="h-8 gap-1.5"
    >
      <PlusIcon className="size-3.5" />
      New Work
    </Button>
  );
}

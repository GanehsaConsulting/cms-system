import Link from "next/link";
import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export function PortfolioListEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <p className="font-medium text-sm">No portfolio works yet</p>
      <p className="mt-1 max-w-sm text-muted-foreground text-sm leading-relaxed">
        Add social media and website projects linked to each client.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/clients/portfolio/new" />}
        className="mt-4 h-8 gap-1.5"
      >
        <PlusIcon className="size-3.5" />
        New Work
      </Button>
    </div>
  );
}

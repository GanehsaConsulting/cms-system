import Link from "next/link";
import { CaretLeftIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface PriceFormHeaderProps {
  mode: "create" | "edit";
  isPending: boolean;
  onSave: () => void;
}

export function PriceFormHeader({
  mode,
  isPending,
  onSave,
}: PriceFormHeaderProps) {
  return (
    <div className="space-y-3">
      <Link
        href="/prices"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <CaretLeftIcon className="size-3.5" />
        Back to Price List
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">
            {mode === "create" ? "Create Price Plan" : "Edit Price Plan"}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Configure multilingual pricing packages for your company profile site.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/prices" />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9"
            disabled={isPending}
            onClick={onSave}
          >
            {isPending ? "Saving..." : "Save Price Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

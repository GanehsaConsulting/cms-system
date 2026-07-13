import Link from "next/link";
import { CaretLeftIcon, DesktopIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface PriceFormHeaderProps {
  mode: "create" | "edit";
  planName?: string;
  isPending: boolean;
  onPreview: () => void;
  onSave: () => void;
}

export function PriceFormHeader({
  mode,
  planName,
  isPending,
  onPreview,
  onSave,
}: PriceFormHeaderProps) {
  const displayName = planName?.trim();

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
          {mode === "edit" && displayName ? (
            <div className="flex flex-row gap-1">
              <h1 className="font-semibold text-xl tracking-tight text-muted-foreground">
                Edit Price Plan
              </h1>
              <h1 className="truncate font-semibold text-xl tracking-tight">
                {displayName}
              </h1>
            </div>
          ) : (
            <h1 className="font-semibold text-xl tracking-tight">
              Create Price Plan
            </h1>
          )}
          <p className="mt-1 text-muted-foreground text-sm">
            Configure multilingual pricing packages for your company profile
            site.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-1.5"
            disabled={isPending}
            onClick={onPreview}
          >
            <DesktopIcon className="size-3.5" />
            Preview
          </Button>
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

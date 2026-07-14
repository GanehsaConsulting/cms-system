import Link from "next/link";
import { CaretLeftIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface PortfolioFormHeaderProps {
  mode: "create" | "edit";
  title?: string;
  isPending: boolean;
  onSave: () => void;
}

export function PortfolioFormHeader({
  mode,
  title,
  isPending,
  onSave,
}: PortfolioFormHeaderProps) {
  const displayTitle = title?.trim();

  return (
    <div className="space-y-3">
      <Link
        href="/clients/portfolio"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <CaretLeftIcon className="size-3.5" />
        Back to Portfolio
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {mode === "edit" && displayTitle ? (
            <div className="flex flex-row flex-wrap gap-1">
              <h1 className="font-semibold text-muted-foreground text-xl tracking-tight">
                Edit Work
              </h1>
              <h1 className="truncate font-semibold text-xl tracking-tight">
                {displayTitle}
              </h1>
            </div>
          ) : (
            <h1 className="font-semibold text-xl tracking-tight">
              Create Work
            </h1>
          )}
          <p className="mt-1 text-muted-foreground text-sm">
            Link social media or website work to a client.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/clients/portfolio" />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="h-9"
            disabled={isPending}
            onClick={onSave}
          >
            {isPending ? "Saving..." : "Save work"}
          </Button>
        </div>
      </div>
    </div>
  );
}

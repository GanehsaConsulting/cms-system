import Link from "next/link";
import { CaretLeftIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface ContentActivityFormHeaderProps {
  mode: "create" | "edit";
  title?: string;
  isPending: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export function ContentActivityFormHeader({
  mode,
  title,
  isPending,
  onSaveDraft,
  onPublish,
}: ContentActivityFormHeaderProps) {
  const displayTitle = title?.trim();

  return (
    <div className="space-y-3">
      <Link
        href="/activities"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <CaretLeftIcon className="size-3.5" />
        Back to Activities
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {mode === "edit" && displayTitle ? (
            <div className="flex flex-row flex-wrap gap-1">
              <h1 className="font-semibold text-muted-foreground text-xl tracking-tight">
                Edit Activity
              </h1>
              <h1 className="truncate font-semibold text-xl tracking-tight">
                {displayTitle}
              </h1>
            </div>
          ) : (
            <h1 className="font-semibold text-xl tracking-tight">
              Create New Activity
            </h1>
          )}
          <p className="mt-1 text-muted-foreground text-sm">
            Build activity or promo cards for your public site feed.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/activities" />}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            onClick={onSaveDraft}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            className="h-9"
            disabled={isPending}
            onClick={onPublish}
          >
            {isPending ? "Saving..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { CaretLeftIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";

interface ClientsWorksNewDataHeaderProps {
  isPending?: boolean;
  onSave?: () => void;
}

export function ClientsWorksNewDataHeader({
  isPending = false,
  onSave,
}: ClientsWorksNewDataHeaderProps) {
  return (
    <div className="space-y-3">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
      >
        <CaretLeftIcon className="size-3.5" />
        Back to Clients & Works
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-semibold text-xl tracking-tight">New Data</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Create a client and portfolio work together in one form.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            className="h-9"
            disabled={isPending}
            nativeButton={false}
            render={<Link href="/clients" />}
          >
            Cancel
          </Button>
          {onSave ? (
            <Button
              type="button"
              className="h-9"
              disabled={isPending}
              onClick={onSave}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

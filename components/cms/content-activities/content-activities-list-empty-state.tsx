import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContentActivitiesListCreateButton } from "@/components/cms/content-activities/content-activities-list-create-button";

export function ContentActivitiesListEmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="space-y-1">
        <p className="font-medium text-sm">No activities yet</p>
        <p className="max-w-sm text-muted-foreground text-sm">
          Create activity or promo cards for your public site feed.
        </p>
      </div>
      <ContentActivitiesListCreateButton />
      <Button render={<Link href="/activities/new" />} nativeButton={false} variant="secondary">
        Create your first activity
      </Button>
    </div>
  );
}

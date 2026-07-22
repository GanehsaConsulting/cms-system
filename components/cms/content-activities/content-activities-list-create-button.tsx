"use client";

import Link from "next/link";
import { PlusIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { LIST_TOOLBAR_BUTTON_CLASS } from "@/config/list-toolbar";

export function ContentActivitiesListCreateButton() {
  return (
    <Button
      render={<Link href="/activities/new" />}
      nativeButton={false}
      className={LIST_TOOLBAR_BUTTON_CLASS}
    >
      <PlusIcon className="size-3.5" />
      New Activity
    </Button>
  );
}

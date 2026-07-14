"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CaretDownIcon,
  Person2Icon,
  PhotoIcon,
  PlusIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const splitButtonClass =
  "h-8 rounded-none border-0 shadow-none focus-visible:border-transparent focus-visible:ring-0";

export function ClientsWorksNewDataButton() {
  const router = useRouter();

  return (
    <div
      data-slot="button-group"
      className="inline-flex h-8 items-stretch overflow-hidden rounded-lg focus-within:ring-3 focus-within:ring-ring/50"
    >
      <Button
        nativeButton={false}
        render={<Link href="/clients/new-data" />}
        className={cn(splitButtonClass, "gap-1.5 rounded-l-lg px-2.5")}
      >
        <PlusIcon className="size-3.5" />
        New Data
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              className={cn(
                splitButtonClass,
                "rounded-r-lg border-primary/60 border-l px-2 aria-expanded:bg-primary/80",
              )}
              aria-label="More create options"
            />
          }
        >
          <CaretDownIcon className="size-3.5 opacity-80" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem onClick={() => router.push("/clients/new")}>
            <Person2Icon />
            New Client
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push("/clients/portfolio/new")}
          >
            <PhotoIcon />
            New Work
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

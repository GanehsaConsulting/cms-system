"use client";

import type * as React from "react";
import { useLayoutEffect, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DIALOG_BODY_CLASS,
  DIALOG_DEFAULT_SIZE,
  DIALOG_SIZE,
  type DialogSize,
} from "@/config/dialog";
import { cn } from "@/lib/utils";

interface CmsDialogContentProps extends React.ComponentProps<
  typeof DialogContent
> {
  size?: DialogSize;
}

function CmsDialogContent({
  className,
  size = DIALOG_DEFAULT_SIZE,
  fullscreen,
  ...props
}: CmsDialogContentProps) {
  const isFullscreen = fullscreen ?? size === "full";

  return (
    <DialogContent
      fullscreen={isFullscreen}
      className={cn(DIALOG_SIZE[size], className)}
      {...props}
    />
  );
}

function CmsDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = bodyRef.current;
    if (!node) {
      return;
    }
    node.scrollTop = 0;
    node.scrollLeft = 0;
  }, []);

  return (
    <div
      ref={bodyRef}
      data-slot="dialog-body"
      className={cn(DIALOG_BODY_CLASS, className)}
      {...props}
    />
  );
}

export {
  Dialog as CmsDialog,
  DialogClose as CmsDialogClose,
  DialogDescription as CmsDialogDescription,
  DialogFooter as CmsDialogFooter,
  DialogHeader as CmsDialogHeader,
  DialogTitle as CmsDialogTitle,
  DialogTrigger as CmsDialogTrigger,
  CmsDialogBody,
  CmsDialogContent,
};

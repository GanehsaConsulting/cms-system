"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { MODAL_PANEL_SURFACE } from "@/config/glass";
import { cn } from "@/lib/utils";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "backdrop-blur-[1px] fixed inset-0 isolate z-50 bg-black/8 duration-100",
        "dark:bg-black/10",
        "data-open:fade-in-0 data-open:animate-in data-closed:fade-out-0 data-closed:animate-out",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  fullscreen = false,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
  /** Edge-to-edge viewport panel (e.g. article preview). */
  fullscreen?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          MODAL_PANEL_SURFACE,
          "fixed z-50 flex flex-col gap-0 overflow-hidden p-0 text-popover-foreground text-sm outline-none duration-100",
          fullscreen
            ? "inset-0 h-svh max-h-svh w-screen max-w-none rounded-none data-open:fade-in-0 data-open:animate-in data-closed:fade-out-0 data-closed:animate-out"
            : [
                "top-1/2 left-1/2 max-h-[min(92svh,40rem)] w-full max-w-none -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] sm:max-w-none",
                "data-open:fade-in-0 data-open:zoom-in-95 data-open:animate-in data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:animate-out",
              ],
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className={cn(
                  "absolute top-3 right-3",
                  fullscreen && "top-2.5 right-3 z-10",
                )}
                size="icon-sm"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex shrink-0 flex-col gap-1 border-(--separator) border-b px-5 py-4 text-left",
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse gap-2 border-(--separator) border-t bg-transparent p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading font-medium text-base leading-none",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

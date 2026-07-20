"use client";

import { useEffect, useState } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { SystemAppLogo } from "@/components/shared/system-app-logo";
import { CheckIcon, WarningIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** macOS notification squircle — 44px tile, ~22% corner radius. */
const TOAST_ICON_TILE =
  "size-11 rounded-[0.875rem] p-1 shadow-[0_1px_3px_rgb(0_0_0/0.14)] dark:shadow-[0_1px_4px_rgb(0_0_0/0.35)]";

function useDocumentTheme(): ToasterProps["theme"] {
  const [theme, setTheme] = useState<ToasterProps["theme"]>("system");

  useEffect(() => {
    const root = document.documentElement;

    function sync() {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    }

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return theme;
}

type MacToastIconVariant = "success" | "error" | "default" | "loading";

function MacToastAppIcon({ variant }: { variant: MacToastIconVariant }) {
  return (
    <div className="relative size-11 shrink-0">
      <SystemAppLogo decorative className={TOAST_ICON_TILE} />

      {variant === "success" ? (
        <span
          aria-hidden
          className="absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-[#34c759] shadow-sm ring-2 ring-white dark:ring-[#2c2c2e]"
        >
          <CheckIcon className="size-2.5 text-white" />
        </span>
      ) : null}

      {variant === "error" ? (
        <span
          aria-hidden
          className="absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-[#ff3b30] shadow-sm ring-2 ring-white dark:ring-[#2c2c2e]"
        >
          <WarningIcon className="size-2.5 text-white" />
        </span>
      ) : null}

      {variant === "loading" ? (
        <span
          aria-hidden
          className="absolute right-0 bottom-0 flex size-4 items-center justify-center rounded-full bg-[#007aff] shadow-sm ring-2 ring-white dark:ring-[#2c2c2e]"
        >
          <span className="size-2.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        </span>
      ) : null}
    </div>
  );
}

const toastSurfaceClass = cn(
  "group toast flex w-[21rem] max-w-[calc(100vw-2rem)] !items-start !gap-3.5 rounded-[22px] p-4 text-foreground",
  "border border-black/8 bg-white/78 shadow-[0_12px_40px_rgb(0_0_0/0.12),0_2px_6px_rgb(0_0_0/0.05)]",
  "backdrop-blur-2xl backdrop-saturate-150",
  "dark:border-white/10 dark:bg-[rgb(44_44_46/0.84)] dark:shadow-[0_12px_40px_rgb(0_0_0/0.42)]",
  "group-[.toaster]:border-black/8 dark:group-[.toaster]:border-white/10",
);

export function Toaster(props: ToasterProps) {
  const theme = useDocumentTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group z-9999 font-sans [--width:21rem]"
      position="top-right"
      offset={14}
      gap={8}
      visibleToasts={4}
      expand={false}
      closeButton={false}
      style={
        {
          "--toast-icon-margin-start": "0px",
          "--toast-icon-margin-end": "0px",
          "--border-radius": "22px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: toastSurfaceClass,
          content: "flex min-w-0 flex-1 flex-col gap-0.5 pt-1",
          title:
            "text-[13px] font-semibold leading-[1.2] tracking-[-0.01em] text-foreground",
          description:
            "text-[13px] font-normal leading-[1.35] tracking-[-0.005em] text-foreground/88",
          icon: "!m-0 !size-11 !min-h-11 !min-w-11 shrink-0 !overflow-visible !self-start",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          success: "!bg-white/78 dark:!bg-[rgb(44_44_46/0.84)]",
          error: "!bg-white/78 dark:!bg-[rgb(44_44_46/0.84)]",
          loading: "!bg-white/78 dark:!bg-[rgb(44_44_46/0.84)]",
        },
      }}
      icons={{
        success: <MacToastAppIcon variant="success" />,
        error: <MacToastAppIcon variant="error" />,
        loading: <MacToastAppIcon variant="loading" />,
        info: <MacToastAppIcon variant="default" />,
        warning: <MacToastAppIcon variant="error" />,
      }}
      {...props}
    />
  );
}

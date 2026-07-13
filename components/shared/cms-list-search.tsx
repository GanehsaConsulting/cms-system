"use client";

import { useEffect } from "react";
import { MagnifyingGlassIcon, XIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LIST_SEARCH_INPUT_CLASS,
  LIST_SEARCH_SHORTCUT_CLASS,
  LIST_SEARCH_WRAP_CLASS,
} from "@/config/list-toolbar";
import { cn } from "@/lib/utils";

interface CmsListSearchProps {
  inputId: string;
  value: string;
  placeholder: string;
  ariaLabel: string;
  onChange: (value: string) => void;
  enableShortcut?: boolean;
}

export function CmsListSearch({
  inputId,
  value,
  placeholder,
  ariaLabel,
  onChange,
  enableShortcut = true,
}: CmsListSearchProps) {
  useEffect(() => {
    if (!enableShortcut) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById(inputId)?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut, inputId]);

  return (
    <div className={LIST_SEARCH_WRAP_CLASS}>
      <MagnifyingGlassIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground opacity-70" />
      <Input
        id={inputId}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(LIST_SEARCH_INPUT_CLASS, value ? "pr-9" : "pr-14")}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="-translate-y-1/2 absolute top-1/2 right-1 size-7 text-muted-foreground hover:bg-transparent hover:text-foreground"
          aria-label="Clear search"
          onClick={() => onChange("")}
        >
          <XIcon className="size-3.5" />
        </Button>
      ) : enableShortcut ? (
        <kbd className={LIST_SEARCH_SHORTCUT_CLASS}>⌘K</kbd>
      ) : null}
    </div>
  );
}

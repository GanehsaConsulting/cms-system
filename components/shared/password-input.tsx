"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeSlashIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  "type"
> {}

export function PasswordInput({
  className,
  disabled,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn("pr-9", className)}
        {...props}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className={cn(
          "absolute top-1/2 right-1.5 flex size-7 -translate-y-1/2 items-center justify-center",
          "rounded-md text-muted-foreground transition-colors hover:text-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
        )}
      >
        {visible ? (
          <EyeSlashIcon className="size-3.5" />
        ) : (
          <EyeIcon className="size-3.5" />
        )}
      </button>
    </div>
  );
}

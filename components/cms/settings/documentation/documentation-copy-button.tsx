"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, DocumentIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface DocumentationCopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function DocumentationCopyButton({
  value,
  label = "Copy",
  className,
}: DocumentationCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn("gap-1.5", className)}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <CheckIcon size={4} /> : <DocumentIcon size={4} />}
      {copied ? "Copied" : label}
    </Button>
  );
}

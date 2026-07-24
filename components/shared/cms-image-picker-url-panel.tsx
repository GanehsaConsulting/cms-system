"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidImageHttpUrl } from "@/lib/cms/image-url";

interface CmsImagePickerUrlPanelProps {
  remainingSlots: number;
  disabled?: boolean;
  onAdd: (url: string) => void;
}

export function CmsImagePickerUrlPanel({
  remainingSlots,
  disabled = false,
  onAdd,
}: CmsImagePickerUrlPanelProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleAdd() {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("Enter an image URL.");
      return;
    }

    if (!isValidImageHttpUrl(trimmed)) {
      setError("Enter a valid http(s) image URL.");
      return;
    }

    if (remainingSlots <= 0) {
      setError("Image limit reached.");
      return;
    }

    setError(null);
    onAdd(trimmed);
    setUrl("");
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="cms-image-picker-url">Image URL</Label>
        <Input
          id="cms-image-picker-url"
          type="url"
          inputMode="url"
          placeholder="https://…"
          value={url}
          disabled={disabled || remainingSlots <= 0}
          onChange={(event) => {
            setUrl(event.target.value);
            if (error) {
              setError(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleAdd();
            }
          }}
        />
        <p className="text-muted-foreground text-[11px] leading-relaxed">
          Paste a direct http(s) link to an image. The URL is stored as-is.
        </p>
      </div>

      {error ? <p className="text-destructive text-xs">{error}</p> : null}

      <Button
        type="button"
        size="sm"
        disabled={disabled || remainingSlots <= 0 || url.trim().length === 0}
        onClick={handleAdd}
      >
        Add URL
      </Button>
    </div>
  );
}

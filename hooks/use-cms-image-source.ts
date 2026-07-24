"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  GALLERY_ACCEPT_ATTRIBUTE,
  readGalleryImageFile,
} from "@/lib/articles/gallery";
import {
  markNativeFilePickerClosed,
  markNativeFilePickerOpen,
} from "@/lib/cms/native-file-picker";
import type { CmsImagePickerTab } from "@/types/cms-image-picker";

export interface CmsImageSourceAddMeta {
  addedFileNames: string[];
}

export interface UseCmsImageSourceOptions {
  /** URLs already on the field (disabled in library picker for append mode). */
  existingUrls: string[];
  /** How many more images can be added (1 for replace/single). */
  maxSelectable: number;
  disabled?: boolean;
  /** Allow multi-file device picker. Defaults to maxSelectable > 1. */
  multiple?: boolean;
  accept?: string;
  inputId?: string;
  /** Custom file → URL reader (defaults to gallery image prep). */
  readFile?: (file: File) => Promise<string>;
  onAdd: (urls: string[], meta?: CmsImageSourceAddMeta) => void;
}

export function useCmsImageSource({
  existingUrls,
  maxSelectable,
  disabled = false,
  multiple,
  accept = GALLERY_ACCEPT_ATTRIBUTE,
  inputId: inputIdProp,
  readFile = readGalleryImageFile,
  onAdd,
}: UseCmsImageSourceOptions) {
  const generatedId = useId();
  const inputId = inputIdProp ?? `cms-image-source-${generatedId}`;
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerSessionRef = useRef(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<CmsImagePickerTab>("shared");

  const allowMultiple = multiple ?? maxSelectable > 1;
  const canAdd = maxSelectable > 0 && !disabled;
  const busy = disabled || isReading || !canAdd;

  useEffect(() => {
    function endPickerSession() {
      if (!pickerSessionRef.current) {
        return;
      }
      pickerSessionRef.current = false;
      markNativeFilePickerClosed();
    }

    function handleWindowFocus() {
      // OS file dialog closed (selected or cancelled).
      window.setTimeout(endPickerSession, 0);
    }

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
      endPickerSession();
    };
  }, []);

  const addUrls = useCallback(
    (urls: string[], meta?: CmsImageSourceAddMeta) => {
      const unique = urls
        .map((url) => url.trim())
        .filter((url) => url.length > 0)
        .filter((url) => !existingUrls.includes(url) || maxSelectable === 1)
        .slice(0, maxSelectable);

      if (unique.length === 0) {
        return;
      }

      onAdd(unique, {
        addedFileNames: meta?.addedFileNames?.slice(0, unique.length) ?? [],
      });
    },
    [existingUrls, maxSelectable, onAdd],
  );

  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!canAdd) {
        return;
      }

      // Snapshot immediately — FileList is live and clears with input.value = "".
      const files = Array.from(fileList).slice(0, maxSelectable);
      if (files.length === 0) {
        return;
      }

      setLocalError(null);
      setIsReading(true);

      try {
        const nextImages: string[] = [];
        const names: string[] = [];

        for (const file of files) {
          nextImages.push(await readFile(file));
          names.push(file.name);
        }

        addUrls(nextImages, { addedFileNames: names });
      } catch (uploadError) {
        setLocalError(
          uploadError instanceof Error
            ? uploadError.message
            : "Failed to upload image.",
        );
      } finally {
        setIsReading(false);
      }
    },
    [addUrls, canAdd, maxSelectable, readFile],
  );

  function beginNativeFilePicker() {
    if (pickerSessionRef.current) {
      return;
    }
    pickerSessionRef.current = true;
    markNativeFilePickerOpen();
  }

  function openUpload() {
    if (busy) {
      return;
    }
    const input = inputRef.current;
    if (!input) {
      return;
    }

    beginNativeFilePicker();
    // Open synchronously while still inside the user gesture (menu/button click).
    input.click();
  }

  function openPicker(tab: CmsImagePickerTab) {
    if (busy) {
      return;
    }
    setPickerTab(tab);
    setPickerOpen(true);
  }

  function openLibrary() {
    openPicker("shared");
  }

  function openUrl() {
    openPicker("url");
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Copy before clearing — clearing empties the live FileList.
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = "";

    if (pickerSessionRef.current) {
      pickerSessionRef.current = false;
      markNativeFilePickerClosed();
    }

    if (files.length > 0) {
      void addFiles(files);
    }
  }

  return {
    inputId,
    inputRef,
    accept,
    allowMultiple,
    maxSelectable,
    disabled,
    localError,
    setLocalError,
    isReading,
    busy,
    canAdd,
    pickerOpen,
    setPickerOpen,
    pickerTab,
    openUpload,
    openLibrary,
    openUrl,
    openPicker,
    addFiles,
    addUrls,
    handleInputChange,
    /** For replace/single fields, don't block the current URL in the picker. */
    pickerExistingUrls: maxSelectable === 1 ? [] : existingUrls,
  };
}

export type CmsImageSourceApi = ReturnType<typeof useCmsImageSource>;

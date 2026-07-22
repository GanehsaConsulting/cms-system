"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import {
  ARTICLE_IMAGE_ACCEPT_ATTRIBUTE,
  uploadArticleEditorImage,
} from "@/lib/articles/editor-images";
import { notifyError } from "@/lib/notify/action-toast";

interface ArticleEditorImageButtonProps {
  text?: string;
}

export async function insertArticleEditorImage(
  editor: Editor,
  file: File,
): Promise<boolean> {
  if (!editor.isEditable || editor.isActive("code")) {
    return false;
  }

  try {
    const url = await uploadArticleEditorImage(file);
    const alt = file.name.replace(/\.[^/.]+$/, "") || "Image";

    return editor
      .chain()
      .focus()
      .setImage({ src: url, alt, title: alt })
      .run();
  } catch (error) {
    notifyError(
      error instanceof Error ? error.message : "Failed to insert image.",
    );
    return false;
  }
}

export function ArticleEditorImageButton({
  text = "Image",
}: ArticleEditorImageButtonProps) {
  const { editor } = useTiptapEditor();
  const inputRef = useRef<HTMLInputElement>(null);

  const canInsert = Boolean(editor?.isEditable) && !editor?.isActive("code");

  const openPicker = useCallback(() => {
    if (!canInsert) {
      return;
    }

    inputRef.current?.click();
  }, [canInsert]);

  const handleChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";

      if (!file || !editor) {
        return;
      }

      await insertArticleEditorImage(editor, file);
    },
    [editor],
  );

  if (!editor) {
    return null;
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ARTICLE_IMAGE_ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="ghost"
        aria-label="Insert inline image"
        disabled={!canInsert}
        onClick={openPicker}
      >
        <ImagePlusIcon className="tiptap-button-icon" />
        {text ? <span className="tiptap-button-text">{text}</span> : null}
      </Button>
    </>
  );
}

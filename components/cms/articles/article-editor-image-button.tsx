"use client";

import type { Editor } from "@tiptap/react";
import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { Button } from "@/components/tiptap-ui-primitive/button";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
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

function insertEditorImageUrl(editor: Editor, url: string, alt = "Image") {
  if (!editor.isEditable || editor.isActive("code")) {
    return false;
  }

  return editor.chain().focus().setImage({ src: url, alt, title: alt }).run();
}

export function ArticleEditorImageButton({
  text = "Image",
}: ArticleEditorImageButtonProps) {
  const { editor } = useTiptapEditor();
  const canInsert = Boolean(editor?.isEditable) && !editor?.isActive("code");

  const source = useCmsImageSource({
    existingUrls: [],
    maxSelectable: 1,
    multiple: false,
    disabled: !canInsert,
    accept: ARTICLE_IMAGE_ACCEPT_ATTRIBUTE,
    readFile: uploadArticleEditorImage,
    onAdd: (urls, meta) => {
      if (!editor || urls.length === 0) {
        return;
      }
      const alt =
        meta?.addedFileNames?.[0]?.replace(/\.[^/.]+$/, "") || "Image";
      insertEditorImageUrl(editor, urls[0], alt);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <CmsImageSourceInfra source={source} />
      <Button
        type="button"
        variant="ghost"
        aria-label="Insert image"
        disabled={!canInsert || source.busy}
        onClick={source.open}
      >
        <ImagePlusIcon className="tiptap-button-icon" />
        {text ? <span className="tiptap-button-text">{text}</span> : null}
      </Button>
    </>
  );
}

"use client";

import type { Editor } from "@tiptap/react";
import { ImagePlusIcon } from "@/components/tiptap-icons/image-plus-icon";
import { CmsImageSourceInfra } from "@/components/shared/cms-image-source-infra";
import { Button } from "@/components/tiptap-ui-primitive/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CMS_IMAGE_SOURCE_LABELS } from "@/config/cms-image-source";
import { useCmsImageSource } from "@/hooks/use-cms-image-source";
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import {
  ARTICLE_IMAGE_ACCEPT_ATTRIBUTE,
  uploadArticleEditorImage,
} from "@/lib/articles/editor-images";
import {
  FolderOpenIcon,
  GlobeIcon,
  UploadSimpleIcon,
} from "@/lib/icons";
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
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={!canInsert || source.busy}
          render={
            <Button
              type="button"
              variant="ghost"
              aria-label="Insert image"
              disabled={!canInsert || source.busy}
            />
          }
        >
          <ImagePlusIcon className="tiptap-button-icon" />
          {text ? <span className="tiptap-button-text">{text}</span> : null}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-44">
          <DropdownMenuItem
            className="gap-2"
            onPointerDown={(event) => {
              event.preventDefault();
              source.openUpload();
            }}
          >
            <UploadSimpleIcon className="size-3.5" />
            {CMS_IMAGE_SOURCE_LABELS.uploadFromDevice}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={source.openLibrary} className="gap-2">
            <FolderOpenIcon className="size-3.5" />
            {CMS_IMAGE_SOURCE_LABELS.fromLibrary}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={source.openUrl} className="gap-2">
            <GlobeIcon className="size-3.5" />
            {CMS_IMAGE_SOURCE_LABELS.fromUrl}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { CmsImagePreviewDialog } from "@/components/shared/cms-image-preview-dialog";

export interface OpenCmsImagePreviewOptions {
  images: string[];
  index?: number;
  title?: string;
  description?: string;
}

interface CmsImagePreviewContextValue {
  openPreview: (options: OpenCmsImagePreviewOptions) => void;
}

const CmsImagePreviewContext =
  createContext<CmsImagePreviewContextValue | null>(null);

export function CmsImagePreviewProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [title, setTitle] = useState<string | undefined>();
  const [description, setDescription] = useState<string | undefined>();

  const openPreview = useCallback((options: OpenCmsImagePreviewOptions) => {
    const nextImages = options.images.map((src) => src.trim()).filter(Boolean);
    if (nextImages.length === 0) {
      return;
    }

    const nextIndex = Math.min(
      Math.max(options.index ?? 0, 0),
      nextImages.length - 1,
    );

    setImages(nextImages);
    setIndex(nextIndex);
    setTitle(options.title);
    setDescription(options.description);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openPreview }), [openPreview]);

  return (
    <CmsImagePreviewContext.Provider value={value}>
      {children}
      <CmsImagePreviewDialog
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);
          if (!nextOpen) {
            setImages([]);
            setIndex(0);
            setTitle(undefined);
            setDescription(undefined);
          }
        }}
        images={images}
        index={index}
        onIndexChange={setIndex}
        title={title}
        description={description}
      />
    </CmsImagePreviewContext.Provider>
  );
}

export function useCmsImagePreview() {
  const context = useContext(CmsImagePreviewContext);
  if (!context) {
    throw new Error(
      "useCmsImagePreview must be used within CmsImagePreviewProvider.",
    );
  }
  return context;
}

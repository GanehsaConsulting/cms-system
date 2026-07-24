import {
  OPTIMIZE_IMAGES_MAX_EDGE_PX,
  OPTIMIZE_IMAGES_QUALITY,
} from "@/config/optimize-images";
import { readStoredOptimizeImagesEnabled } from "@/lib/appearance/optimize-images-storage";
import { validateArticleImageFile } from "@/lib/articles/gallery";

function readFileAsDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read image file."));
        return;
      }

      resolve(reader.result);
    };
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.readAsDataURL(file);
  });
}

function isHeicLike(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type === "image/heic" || type === "image/heif") {
    return true;
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  return extension === "heic" || extension === "heif";
}

function isGifLike(file: File): boolean {
  if (file.type === "image/gif") {
    return true;
  }

  return file.name.split(".").pop()?.toLowerCase() === "gif";
}

function isImageLike(file: File): boolean {
  if (file.type.startsWith("image/")) {
    return true;
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "heic",
    "heif",
    "avif",
    "bmp",
  ].includes(extension);
}

function scaleDimensions(
  width: number,
  height: number,
  maxEdge: number,
): { width: number; height: number } {
  const largestEdge = Math.max(width, height);

  if (largestEdge <= maxEdge) {
    return { width, height };
  }

  const scale = maxEdge / largestEdge;
  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale),
  };
}

function loadImageFromFile(file: File | Blob): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be previewed in your browser."));
    };

    image.src = objectUrl;
  });
}

function supportsWebpEncoding(): boolean {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL("image/webp").startsWith("data:image/webp");
  } catch {
    return false;
  }
}

type EncodedImage = {
  mimeType: "image/webp" | "image/jpeg";
  extension: "webp" | "jpg";
  dataUrl: string;
};

function encodeOptimizedImage(image: HTMLImageElement): EncodedImage {
  const { width, height } = scaleDimensions(
    image.naturalWidth,
    image.naturalHeight,
    OPTIMIZE_IMAGES_MAX_EDGE_PX,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser does not support image processing.");
  }

  context.drawImage(image, 0, 0, width, height);

  if (supportsWebpEncoding()) {
    const webp = canvas.toDataURL("image/webp", OPTIMIZE_IMAGES_QUALITY);
    if (webp.startsWith("data:image/webp")) {
      return { mimeType: "image/webp", extension: "webp", dataUrl: webp };
    }
  }

  const jpeg = canvas.toDataURL("image/jpeg", OPTIMIZE_IMAGES_QUALITY);
  if (!jpeg.startsWith("data:image/jpeg")) {
    throw new Error("Failed to prepare image.");
  }

  return { mimeType: "image/jpeg", extension: "jpg", dataUrl: jpeg };
}

async function convertHeicToJpegFile(file: File): Promise<File> {
  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: OPTIMIZE_IMAGES_QUALITY,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!(blob instanceof Blob)) {
    throw new Error("Failed to convert HEIC image.");
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

function dataUrlToFile(
  dataUrl: string,
  filename: string,
  mimeType: string,
): File {
  const [, payload = ""] = dataUrl.split(",", 2);
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], filename, { type: mimeType });
}

async function resolveWorkingImageFile(file: File): Promise<File> {
  if (isHeicLike(file)) {
    return convertHeicToJpegFile(file);
  }
  return file;
}

/**
 * Browser-displayable data URL for CMS image fields.
 * When optimize is ON: resize + WebP (JPEG fallback). GIF stays as-is.
 * When optimize is OFF: original bytes as data URL (HEIC still converted for preview).
 */
export async function prepareArticleImageDataUrl(file: File): Promise<string> {
  const validationError = validateArticleImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (isGifLike(file)) {
    return readFileAsDataUrl(file);
  }

  const optimize = readStoredOptimizeImagesEnabled();
  const workingFile = await resolveWorkingImageFile(file);

  if (!optimize) {
    return readFileAsDataUrl(workingFile);
  }

  const image = await loadImageFromFile(workingFile);
  return encodeOptimizedImage(image).dataUrl;
}

/**
 * File ready for direct Cloudinary upload (Media Library).
 * Non-images and GIFs are returned unchanged. HEIC always converted.
 * When optimize is ON, still images become WebP (or JPEG fallback).
 */
export async function prepareCmsImageFileForUpload(file: File): Promise<File> {
  if (!isImageLike(file) || isGifLike(file)) {
    return file;
  }

  const optimize = readStoredOptimizeImagesEnabled();
  const workingFile = await resolveWorkingImageFile(file);

  if (!optimize) {
    return workingFile;
  }

  const image = await loadImageFromFile(workingFile);
  const encoded = encodeOptimizedImage(image);
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";

  return dataUrlToFile(
    encoded.dataUrl,
    `${baseName}.${encoded.extension}`,
    encoded.mimeType,
  );
}

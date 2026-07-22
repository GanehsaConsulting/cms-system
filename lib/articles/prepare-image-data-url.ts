import {
  validateArticleImageFile,
} from "@/lib/articles/gallery";

const MAX_EDGE_PX = 2048;
const OUTPUT_QUALITY = 0.88;

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

function encodeImageToJpegDataUrl(image: HTMLImageElement): string {
  const { width, height } = scaleDimensions(
    image.naturalWidth,
    image.naturalHeight,
    MAX_EDGE_PX,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Your browser does not support image processing.");
  }

  context.drawImage(image, 0, 0, width, height);

  const dataUrl = canvas.toDataURL("image/jpeg", OUTPUT_QUALITY);
  if (!dataUrl.startsWith("data:image/jpeg")) {
    throw new Error("Failed to prepare image preview.");
  }

  return dataUrl;
}

async function convertHeicToJpegFile(file: File): Promise<File> {
  const { default: heic2any } = await import("heic2any");
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: OUTPUT_QUALITY,
  });

  const blob = Array.isArray(converted) ? converted[0] : converted;
  if (!(blob instanceof Blob)) {
    throw new Error("Failed to convert HEIC image.");
  }

  const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}

/**
 * Returns a browser-displayable data URL for article thumbnails, gallery,
 * and inline editor images. HEIC/HEIF is converted to JPEG because most
 * browsers cannot render Apple formats in `<img>` tags.
 */
export async function prepareArticleImageDataUrl(file: File): Promise<string> {
  const validationError = validateArticleImageFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (isGifLike(file)) {
    return readFileAsDataUrl(file);
  }

  let workingFile = file;
  if (isHeicLike(file)) {
    workingFile = await convertHeicToJpegFile(file);
  }

  const image = await loadImageFromFile(workingFile);
  return encodeImageToJpegDataUrl(image);
}

export type CmsImagePickerTab = "device" | "shared" | "in-use" | "url";

export interface CmsImagePickerItem {
  id: string;
  url: string;
  filename: string;
}

export type CmsImagePickerTab = "shared" | "in-use" | "url";

export interface CmsImagePickerItem {
  id: string;
  url: string;
  filename: string;
}

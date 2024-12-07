import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileType(file: File): string {
  const fileType = file.type;
  if (fileType === "") {
    // Try to determine the file type from the file extension
    const extension = file.name.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "pdf":
        return "application/pdf";
      case "txt":
        return "text/plain";
      default:
        return "application/octet-stream";
    }
  }

  return fileType;
}

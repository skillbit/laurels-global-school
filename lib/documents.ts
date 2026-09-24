// Order here is the order categories appear on the public Documents page.
export const DOCUMENT_CATEGORIES = [
  { value: "fee_structure", label: "Fee structure" },
  { value: "admission_form", label: "Admission forms" },
  { value: "syllabus", label: "Syllabus" },
  { value: "circular", label: "Circulars" },
  { value: "newsletter", label: "Newsletters" },
] as const;

export function categoryLabel(value: string) {
  return DOCUMENT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export const DOCUMENT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
export const DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;

export function fileExtension(path: string) {
  return path.split(".").pop()?.toUpperCase() ?? "";
}

// Notice attachments use the same file types and size limit as documents.
export const NOTICE_ATTACHMENT_ACCEPT = DOCUMENT_ACCEPT;
export const NOTICE_ATTACHMENT_MAX_BYTES = DOCUMENT_MAX_BYTES;

/** Storage path of a notice file uploaded to our public bucket, or null for outside links. */
export function noticeFilePath(url: string | null | undefined): string | null {
  const m = url?.match(/\/storage\/v1\/object\/public\/public\/(notices\/[\w-]+\.\w+)$/);
  return m ? m[1] : null;
}

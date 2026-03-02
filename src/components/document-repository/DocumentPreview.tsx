import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TeacherDocument } from "@/models/TeacherDocument";

export function DocumentPreview({
  open,
  onOpenChange,
  doc,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: TeacherDocument | null;
}) {
  if (!doc) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[95vh] flex-col bg-white p-0">
        {/* Header */}
        <DialogHeader className="text-md truncate px-4 py-2 font-medium">
          <DialogTitle>{doc.document_title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="min-h-0 flex-1">
          {doc.extension === "pdf" && (
            <iframe src={doc.file_base64} className="h-full w-full" />
          )}

          {["png", "jpg", "jpeg", "webp"].includes(doc.extension) && (
            <div className="flex h-full items-center justify-center">
              <img src={doc.file_base64} className="max-h-full max-w-full" />
            </div>
          )}

          {!["pdf", "png", "jpg", "jpeg", "webp"].includes(doc.extension) && (
            <div className="text-muted-foreground p-4 text-sm">
              Preview not supported for this file type
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/teacher-document";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getDocumentIcon = (ext: string) => {
  const e = ext.toLowerCase();

  if (e === "pdf") {
    return {
      iconClass: "fas fa-file-pdf",
      bg: "bg-error-100 text-error-600",
    };
  }
  if (e === "doc" || e === "docx") {
    return {
      iconClass: "fas fa-file-word",
      bg: "bg-primary-100 text-primary-600",
    };
  }
  if (e === "ppt" || e === "pptx") {
    return {
      iconClass: "fas fa-file-powerpoint",
      bg: "bg-warning-100 text-warning-600",
    };
  }
  if (e === "xls" || e === "xlsx") {
    return {
      iconClass: "fas fa-file-excel",
      bg: "bg-success-100 text-success-600",
    };
  }
  if (e === "jpg" || e === "jpeg" || e === "png") {
    return {
      iconClass: "fas fa-file-image",
      bg: "bg-accent-100 text-accent-600",
    };
  }
  if (e === "zip" || e === "rar") {
    return {
      iconClass: "fas fa-file-archive",
      bg: "bg-primary-100 text-primary-600",
    };
  }

  return {
    iconClass: "fas fa-file-alt",
    bg: "bg-secondary-100 text-secondary-600",
  };
};

const getStatus = (expiry: string) => {
  const status = getExpiryState(expiry);

  if (status == "expired") {
    return { label: "Expired", className: "bg-red-300 text-error-700" };
  }

  if (status == "expiring") {
    return {
      label: "Expires Soon",
      className: "bg-orange-200 text-warning-700",
    };
  }

  return { label: "Valid", className: "bg-green-200 text-success-700" };
};

const FileCard = ({ doc }: { doc: TeacherDocument }) => {
  const { iconClass, bg } = getDocumentIcon(doc.extension);
  const status = getStatus(doc.expiryDate);

  return (
    <Dialog>
      <DialogTrigger className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
        <div className="mb-3 flex items-start justify-between">
          <i className={`${bg} rounded-lg p-2 ${iconClass}`}></i>

          <div className="opacity-0 transition-opacity group-hover:opacity-100">
            <button className="text-secondary-400 hover:text-secondary-600 p-1">
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-start">
          <h4 className="text-secondary-900 mb-1 truncate font-medium">
            {doc.documentTitle}
          </h4>

          <p className="text-secondary-500 mb-2 text-xs">
            {doc.extension.toUpperCase()} • {doc.fileSizeInMB} MB
          </p>
        </div>
        <div className="text-secondary-500 flex items-center justify-between text-xs">
          <span>{doc.issueDate}</span>
          <div className="flex items-center space-x-1">
            <i className="fas fa-calendar"></i>
            <span>{doc.expiryDate}</span>
          </div>
        </div>

        <div className="mt-2 flex items-center space-x-1">
          <span
            className={`${status.className} rounded-full px-2 py-1 text-xs`}
          >
            {status.label}
          </span>
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-[95vh] flex-col bg-white p-0">
        {/* Header */}
        <DialogHeader className="text-md truncate px-4 py-2 font-medium">
          <DialogTitle>{doc.documentTitle}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="min-h-0 flex-1">
          {doc.extension === "pdf" && (
            <iframe src={doc.fileBase64} className="h-full w-full" />
          )}

          {["png", "jpg", "jpeg", "webp"].includes(doc.extension) && (
            <div className="flex h-full items-center justify-center">
              <img src={doc.fileBase64} className="max-h-full max-w-full" />
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
};

export default FileCard;

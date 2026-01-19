import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { Download, Trash2 } from "lucide-react";
import { useState } from "react";

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

const getDocumentStatusClassName = (expiry: string) => {
  const status = getExpiryState(expiry);

  if (status == "expired") {
    return { label: "Expired", className: "bg-error-100 text-error-700" };
  }

  if (status == "expiring") {
    return {
      label: "Expires Soon",
      className: "bg-warning-100 text-warning-700",
    };
  }

  return { label: "Valid", className: "bg-success-100 text-success-700" };
};

const FileCard = ({
  doc,
  onArchive,
}: {
  doc: TeacherDocument;
  onArchive: () => void;
}) => {
  const { iconClass, bg } = getDocumentIcon(doc.extension);
  const statusClassName = getDocumentStatusClassName(doc.expiryDate);

  const [isContextOpen, setIsContextOpen] = useState(false);

  const handleDownload = () => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(doc.fileBase64.split(',')[1] || doc.fileBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `application/${doc.extension}` });

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.documentTitle}.${doc.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download the file');
    }
    setIsContextOpen(false);
  };

  const handleRemove = () => {
    if (
      window.confirm(`Are you sure you want to archive "${doc.documentTitle}"?`)
    ) {
      setIsContextOpen(false);
      onArchive();
    }
  };

  return (
    <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <i className={`${bg} rounded-lg p-2 ${iconClass}`}></i>

        <div className="flex items-center gap-5 opacity-0 transition-opacity group-hover:opacity-100">
          <Dialog>
            <DialogTrigger>
              <i className="fas fa-eye text-gray-700"></i>
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
                    <img
                      src={doc.fileBase64}
                      className="max-h-full max-w-full"
                    />
                  </div>
                )}

                {!["pdf", "png", "jpg", "jpeg", "webp"].includes(
                  doc.extension,
                ) && (
                  <div className="text-muted-foreground p-4 text-sm">
                    Preview not supported for this file type
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <button
            onClick={() => setIsContextOpen(!isContextOpen)}
            className="text-secondary-400 hover:text-secondary-600 relative p-1"
          >
            <span className="fas fa-ellipsis-v"></span>
            {isContextOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
                <a
                  onClick={handleDownload}
                  className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <Download size={16} className="text-gray-600" />
                  <span className="text-sm">Download</span>
                </a>

                <a
                  onClick={handleRemove}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">Archive</span>
                </a>
              </div>
            )}
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
          className={`${statusClassName.className} rounded-full px-2 py-1 text-xs`}
        >
          {statusClassName.label}
        </span>
      </div>
    </div>
  );
};

export default FileCard;

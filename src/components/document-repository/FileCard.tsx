import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { Download, Trash2, Printer } from "lucide-react";
import { useState } from "react";

import { formatReadableDate } from "@saintrelion/time-functions";

const getDocumentIcon = (ext: string) => {
  const e = ext.toLowerCase();

  if (e === "pdf") {
    return {
      iconClass: "fas fa-file-pdf",
      bg: "bg-red-100 text-red-600",
    };
  }
  if (e === "doc" || e === "docx") {
    return {
      iconClass: "fas fa-file-word",
      bg: "bg-blue-100 text-blue-600",
    };
  }
  if (e === "ppt" || e === "pptx") {
    return {
      iconClass: "fas fa-file-powerpoint",
      bg: "bg-yellow-100 text-yellow-600",
    };
  }
  if (e === "xls" || e === "xlsx") {
    return {
      iconClass: "fas fa-file-excel",
      bg: "bg-green-100 text-green-600",
    };
  }
  if (e === "jpg" || e === "jpeg" || e === "png") {
    return {
      iconClass: "fas fa-file-image",
      bg: "bg-yellow-100 text-yellow-600",
    };
  }
  if (e === "zip" || e === "rar") {
    return {
      iconClass: "fas fa-file-archive",
      bg: "bg-blue-100 text-blue-600",
    };
  }

  return {
    iconClass: "fas fa-file-alt",
    bg: "bg-gray-100 text-gray-600",
  };
};

const getDocumentStatusClassName = (expiry: string) => {
  const status = getExpiryState(expiry);

  if (status == "expired") {
    return { label: "Expired", className: "bg-red-100 text-red-700" };
  }

  if (status == "expiring") {
    return {
      label: "Expires Soon",
      className: "bg-yellow-100 text-yellow-700",
    };
  }

  return { label: "Valid", className: "bg-green-100 text-green-700" };
};

const FileCard = ({
  doc,
  onArchive,
  onRestore,
}: {
  doc: TeacherDocument;
  onArchive?: () => void;
  onRestore?: () => void;
}) => {
  const { iconClass, bg } = getDocumentIcon(doc.extension);
  const statusClassName = getDocumentStatusClassName(doc.expiry_date);

  const [isContextOpen, setIsContextOpen] = useState(false);

  const handleDownload = () => {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(
        doc.file_base64.split(",")[1] || doc.file_base64,
      );
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: `application/${doc.extension}`,
      });

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_title}.${doc.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download the file");
    }
    setIsContextOpen(false);
  };

  const handlePrint = async () => {
    try {
      const byteCharacters = atob(
        doc.file_base64.split(",")[1] || doc.file_base64,
      );
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: `application/${doc.extension}`,
      });

      const url = window.URL.createObjectURL(blob);

      if (doc.extension === "pdf") {
        const printWindow = window.open("", "_blank");
        if (!printWindow) throw new Error("Popup blocked");
        printWindow.document.write(
          `<!doctype html><html><head><title>${doc.document_title}</title></head><body style="margin:0"><iframe src="${url}" style="border:0;width:100%;height:100vh"></iframe><script>const f = document.querySelector('iframe'); f.onload = function(){ setTimeout(()=>{ f.contentWindow.focus(); f.contentWindow.print(); },300); };</script></body></html>`,
        );
        printWindow.document.close();
      } else if (["png", "jpg", "jpeg", "webp"].includes(doc.extension)) {
        const printWindow = window.open("", "_blank");
        if (!printWindow) throw new Error("Popup blocked");
        printWindow.document.write(
          `<!doctype html><html><head><title>${doc.document_title}</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center"><img src="${url}" style="max-width:100%;max-height:100vh" onload="window.print();"/></body></html>`,
        );
        printWindow.document.close();
      } else {
        // For other types, open in a new tab; user can print from there
        const w = window.open(url, "_blank");
        if (!w) throw new Error("Popup blocked");
      }

      // revoke after some time
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Print failed:", error);
      alert("Failed to print the file");
    }

    setIsContextOpen(false);
  };

  const handleArchive = () => {
    if (!onArchive) return;

    if (
      window.confirm(
        `Are you sure you want to archive "${doc.document_title}"?`,
      )
    ) {
      setIsContextOpen(false);
      onArchive();
    }
  };

  const handleRestore = () => {
    if (!onRestore) return;
    if (
      window.confirm(
        `Are you sure you want to restore "${doc.document_title}"?`,
      )
    ) {
      setIsContextOpen(false);
      onRestore();
    }
  };

  return (
    <div
      className={`group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md ${doc.is_archived ? "opacity-70" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <i className={`${bg} rounded-lg p-2 ${iconClass}`}></i>

        {/* Action buttons, hidden for archived docs */}
        <div className="relative flex items-center gap-5 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsContextOpen(!isContextOpen)}
            className="text-secondary-400 hover:text-secondary-600 p-1"
          >
            <span className="fas fa-ellipsis-v"></span>
          </button>

          {isContextOpen && (
            <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
              {!doc.is_archived ? (
                <>
                  <a
                    onClick={handleDownload}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Download size={16} className="text-gray-600" />
                    <span className="text-sm">Download</span>
                  </a>
                  <a
                    onClick={handlePrint}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <Printer size={16} className="text-gray-600" />
                    <span className="text-sm">Print</span>
                  </a>
                  <a
                    onClick={handleArchive}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    <span className="text-sm">Archive</span>
                  </a>
                </>
              ) : (
                <>
                  <a
                    onClick={handleRestore}
                    className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3 text-left text-green-600 transition-colors hover:bg-green-50"
                  >
                    <span className="text-sm">Restore</span>
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Document info */}
      <div className="flex flex-col items-start">
        <h4 className="text-secondary-900 mb-1 truncate font-medium">
          {doc.document_title}
        </h4>

        <p className="text-secondary-500 mb-2 text-xs">
          {doc.extension.toUpperCase()} • {doc.file_size_in_mb} MB
        </p>
      </div>

      <div className="text-secondary-500 flex items-center justify-between text-xs">
        <span>{formatReadableDate(doc.issue_date)}</span>
        <div className="flex items-center space-x-1">
          <i className="fas fa-calendar"></i>
          <span>{formatReadableDate(doc.expiry_date)}</span>
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

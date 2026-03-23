import { DocumentPreview } from "@/components/document-repository/DocumentPreview";
import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import {
  Eye,
  Download,
  Ellipsis,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileType2,
  FileWarning,
  Printer,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { formatReadableDate } from "@saintrelion/time-functions";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (value: string, terms: string[]) => {
  const cleanTerms = Array.from(
    new Set(terms.map((term) => term.trim()).filter((term) => term.length >= 2)),
  );

  if (!value || cleanTerms.length === 0) return value;

  const regex = new RegExp(`(${cleanTerms.map(escapeRegExp).join("|")})`, "gi");

  return value.split(regex).map((part, index) => {
    const isMatch = cleanTerms.some(
      (term) => part.toLowerCase() === term.toLowerCase(),
    );

    return isMatch ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-amber-200/70 px-1 text-slate-900"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
};

const getDocumentIcon = (ext: string) => {
  const e = ext.toLowerCase();

  if (e === "pdf") {
    return {
      Icon: FileType2,
      wrapperClassName: "bg-rose-500/10",
      iconClassName: "text-rose-600",
    };
  }
  if (e === "jpg" || e === "jpeg") {
    return {
      Icon: FileImage,
      wrapperClassName: "bg-amber-500/10",
      iconClassName: "text-amber-600",
    };
  }
  if (e === "png") {
    return {
      Icon: FileImage,
      wrapperClassName: "bg-blue-500/10",
      iconClassName: "text-blue-600",
    };
  }
  if (e === "doc" || e === "docx") {
    return {
      Icon: FileText,
      wrapperClassName: "bg-sky-500/10",
      iconClassName: "text-sky-600",
    };
  }
  if (e === "xls" || e === "xlsx") {
    return {
      Icon: FileSpreadsheet,
      wrapperClassName: "bg-emerald-500/10",
      iconClassName: "text-emerald-600",
    };
  }
  if (e === "zip" || e === "rar") {
    return {
      Icon: FileArchive,
      wrapperClassName: "bg-violet-500/10",
      iconClassName: "text-violet-600",
    };
  }

  return {
    Icon: FileWarning,
    wrapperClassName: "bg-slate-500/10",
    iconClassName: "text-slate-600",
  };
};

const getDocumentStatusClassName = (expiry: string) => {
  const status = getExpiryState(expiry);

  if (status === "expired") {
    return {
      label: "Expired",
      className:
        "bg-red-50 text-red-700 shadow-md shadow-red-500/20 ring-1 ring-red-200/80",
    };
  }

  if (status === "expiring") {
    return {
      label: "Expires Soon",
      className:
        "bg-amber-50 text-amber-700 shadow-md shadow-amber-500/20 ring-1 ring-amber-200/80",
    };
  }

  return {
    label: "Valid",
    className:
      "bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-200/80",
  };
};

const FileCard = ({
  doc,
  onArchive,
  onRestore,
  highlightTerms = [],
  matchContext = [],
}: {
  doc: TeacherDocument;
  onArchive?: () => void;
  onRestore?: () => void;
  highlightTerms?: string[];
  matchContext?: string[];
}) => {
  const { Icon, wrapperClassName, iconClassName } = getDocumentIcon(doc.extension);
  const statusClassName = getDocumentStatusClassName(doc.expiry_date);

  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const previewSupported = ["pdf", "png", "jpg", "jpeg", "webp"].includes(
    doc.extension.toLowerCase(),
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsContextOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleDownload = () => {
    try {
      const byteCharacters = atob(doc.file_base64.split(",")[1] || doc.file_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: `application/${doc.extension}`,
      });

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
      const byteCharacters = atob(doc.file_base64.split(",")[1] || doc.file_base64);
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
        const w = window.open(url, "_blank");
        if (!w) throw new Error("Popup blocked");
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (error) {
      console.error("Print failed:", error);
      alert("Failed to print the file");
    }

    setIsContextOpen(false);
  };

  const handleArchive = () => {
    if (!onArchive) return;

    if (window.confirm(`Are you sure you want to archive "${doc.document_title}"?`)) {
      setIsContextOpen(false);
      onArchive();
    }
  };

  const handleRestore = () => {
    if (!onRestore) return;
    if (window.confirm(`Are you sure you want to restore "${doc.document_title}"?`)) {
      setIsContextOpen(false);
      onRestore();
    }
  };

  const actionButtonClassName =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-50";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsPreviewOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsPreviewOpen(true);
          }
        }}
        className={`group relative w-full cursor-pointer rounded-2xl border border-white/20 bg-white/70 p-4 text-left shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-300/40 ${doc.is_archived ? "opacity-70" : ""}`}
      >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${wrapperClassName}`}
        >
          <Icon className={`h-6 w-6 ${iconClassName}`} strokeWidth={2} />
        </div>

        <div
          ref={menuRef}
          className="relative opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsContextOpen((prev) => !prev);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-slate-400 shadow-sm transition-all duration-200 hover:bg-white hover:text-slate-700"
          >
            <Ellipsis className="h-4 w-4" />
          </button>

          {isContextOpen && (
            <div
              className="absolute right-0 top-11 z-10 w-44 rounded-2xl border border-slate-200/70 bg-white/95 p-2 shadow-xl shadow-slate-200/60 backdrop-blur-sm"
              onClick={(event) => event.stopPropagation()}
            >
              {!doc.is_archived ? (
                <>
                  <button type="button" onClick={handleDownload} className={actionButtonClassName}>
                    <Download className="h-4 w-4 text-slate-500" />
                    Download
                  </button>
                  <button type="button" onClick={handlePrint} className={actionButtonClassName}>
                    <Printer className="h-4 w-4 text-slate-500" />
                    Print
                  </button>
                  <button
                    type="button"
                    onClick={handleArchive}
                    className={`${actionButtonClassName} text-red-600 hover:bg-red-50`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Archive
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleRestore}
                  className={`${actionButtonClassName} text-emerald-600 hover:bg-emerald-50`}
                >
                  <RotateCcw className="h-4 w-4" />
                  Restore
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="min-w-0">
        <h4 className="mb-1 truncate text-sm font-semibold text-slate-900">
          {highlightText(doc.document_title, highlightTerms)}
        </h4>
        <p className="mb-3 text-xs text-slate-400">
          {highlightText(
            `${doc.document_title}.${doc.extension.toLowerCase()} | ${doc.file_size_in_mb} MB`,
            highlightTerms,
          )}
        </p>
      </div>

      {matchContext.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {matchContext.slice(0, 3).map((item) => (
            <span
              key={item}
              className="inline-flex max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
            >
              <span className="truncate">{highlightText(item, highlightTerms)}</span>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{formatReadableDate(doc.issue_date)}</span>
        <span>{formatReadableDate(doc.expiry_date)}</span>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`${statusClassName.className} inline-flex rounded-full px-3 py-1 text-xs font-medium`}
          >
            {statusClassName.label}
          </span>

          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            {previewSupported ? "Preview" : "Open"}
          </span>
        </div>
      </div>
      </div>

      <DocumentPreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        doc={doc}
      />
    </>
  );
};

export default FileCard;

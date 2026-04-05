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
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BASE_API } from "@/sr-config";

import { toast } from "@saintrelion/notifications";
import { formatReadableDate } from "@saintrelion/time-functions";

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const highlightText = (value: string, terms: string[]) => {
  const cleanTerms = Array.from(
    new Set(
      terms.map((term) => term.trim()).filter((term) => term.length >= 2),
    ),
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
  const { Icon, wrapperClassName, iconClassName } = getDocumentIcon(
    doc.extension,
  );
  const statusClassName = getDocumentStatusClassName(doc.expiry_date);

  const [isContextOpen, setIsContextOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fullDoc, setFullDoc] = useState<TeacherDocument | null>(null);

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

  const getBlob = (data: string, ext: string): string => {
    const base64 = data.split(",")[1] || data;
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([new Uint8Array(byteNumbers)], {
      type: `application/${ext}`,
    });
    return window.URL.createObjectURL(blob);
  };

  const fetchFileData = async (): Promise<TeacherDocument | null> => {
    if (fullDoc?.file_base64) return fullDoc;

    setIsFetching(true);
    try {
      const response = await fetch(
        `${BASE_API}api/teacher-document-file/${doc.id}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      const result = await response.json();
      if (response.ok) {
        const updatedDoc = { ...doc, file_base64: result.file_base64 };
        setFullDoc(updatedDoc);
        return updatedDoc;
      } else {
        toast.error(result.detail || "Failed to load document data.");
        return null;
      }
    } catch (err) {
      const error = err as Record<string, string>;
      toast.error("Network error. Please try again. ", error);
      return null;
    } finally {
      setIsFetching(false);
    }
  };

  const handleAction = async (type: "download" | "print") => {
    setIsContextOpen(false);
    const data = await fetchFileData();
    if (!data?.file_base64) return;

    const url = getBlob(data.file_base64, doc.extension);

    if (type === "download") {
      const link = document.createElement("a");
      link.href = url;
      link.download = `${doc.document_title}.${doc.extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else if (type === "print") {
      const printWin = window.open("", "_blank");
      if (printWin) {
        const content =
          doc.extension === "pdf"
            ? `<iframe src="${url}" style="border:0;width:100%;height:100vh"></iframe>`
            : `<img src="${url}" style="max-width:100%" onload="window.print()"/>`;
        printWin.document.write(
          `<html><body style="margin:0">${content}</body></html>`,
        );
        printWin.document.close();
      }
    }
    setTimeout(() => window.URL.revokeObjectURL(url), 5000);
  };

  const handleOpenPreview = async () => {
    setIsPreviewOpen(true);
    await fetchFileData();
  };

  const actionButtonClassName =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-50";

  return (
    <>
      <div
        role="button"
        onClick={handleOpenPreview}
        className="group relative w-full cursor-pointer rounded-2xl border border-white/20 bg-white/70 p-4 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1"
      >
        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
            <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
          </div>
        )}

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
              onClick={(e): void => {
                e.stopPropagation();
                setIsContextOpen(!isContextOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm hover:bg-slate-50"
            >
              <Ellipsis className="h-4 w-4 text-slate-400" />
            </button>

            {isContextOpen && (
              <div
                className="absolute top-11 right-0 z-50 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {!doc.is_archived && (
                  <>
                    <button
                      onClick={() => handleAction("download")}
                      className={actionButtonClassName}
                    >
                      <Download className="h-4 w-4 text-slate-400" /> Download
                    </button>
                    <button
                      onClick={() => handleAction("print")}
                      className={actionButtonClassName}
                    >
                      <Printer className="h-4 w-4 text-slate-400" /> Print
                    </button>
                  </>
                )}
                {onArchive && !doc.is_archived && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Archive "${doc.document_title}"?`))
                        onArchive();
                    }}
                    className={`${actionButtonClassName} text-red-600 hover:bg-red-50`}
                  >
                    <Trash2 className="h-4 w-4" /> Archive
                  </button>
                )}
                {onRestore && doc.is_archived && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Restore "${doc.document_title}"?`))
                        onRestore();
                    }}
                    className={`${actionButtonClassName} text-emerald-600 hover:bg-emerald-50`}
                  >
                    <RotateCcw className="h-4 w-4" /> Restore
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
            {doc.extension.toUpperCase()} • {doc.file_size_in_mb} MB
          </p>
        </div>

        {/* --- matchContext implemented here --- */}
        {matchContext.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {matchContext.slice(0, 3).map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="inline-flex max-w-full items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600"
              >
                <span className="truncate">
                  {highlightText(item, highlightTerms)}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span>{formatReadableDate(doc.issue_date)}</span>
          <span>{formatReadableDate(doc.expiry_date)}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`${statusClassName.className} inline-flex rounded-full px-3 py-1 text-[10px] font-bold tracking-tight uppercase`}
          >
            {statusClassName.label}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 opacity-0 transition-opacity group-hover:opacity-100">
            <Eye className="h-3.5 w-3.5" />
            {previewSupported ? "Preview" : "Open"}
          </span>
        </div>
      </div>

      <DocumentPreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        doc={fullDoc || doc}
        isFetching={isFetching}
      />
    </>
  );
};

export default FileCard;

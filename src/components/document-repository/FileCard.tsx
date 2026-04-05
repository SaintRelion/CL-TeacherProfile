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
  CheckCircle2,
  CloudDownload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatReadableDate } from "@saintrelion/time-functions";
import { toast } from "@saintrelion/notifications";
import { BASE_API } from "@/sr-config";

const escapeRegExp = (value: string): string =>
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
  if (e === "pdf")
    return {
      Icon: FileType2,
      wrapperClassName: "bg-rose-500/10",
      iconClassName: "text-rose-600",
    };
  if (e === "jpg" || e === "jpeg" || e === "png" || e === "webp")
    return {
      Icon: FileImage,
      wrapperClassName: "bg-amber-500/10",
      iconClassName: "text-amber-600",
    };
  if (e === "doc" || e === "docx")
    return {
      Icon: FileText,
      wrapperClassName: "bg-sky-500/10",
      iconClassName: "text-sky-600",
    };
  if (e === "xls" || e === "xlsx")
    return {
      Icon: FileSpreadsheet,
      wrapperClassName: "bg-emerald-500/10",
      iconClassName: "text-emerald-600",
    };
  if (e === "zip" || e === "rar")
    return {
      Icon: FileArchive,
      wrapperClassName: "bg-violet-500/10",
      iconClassName: "text-violet-600",
    };
  return {
    Icon: FileWarning,
    wrapperClassName: "bg-slate-500/10",
    iconClassName: "text-slate-600",
  };
};

const getDocumentStatusClassName = (expiry: string) => {
  const status = getExpiryState(expiry);
  if (status === "expired")
    return {
      label: "Expired",
      className: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
    };
  if (status === "expiring")
    return {
      label: "Expires Soon",
      className: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
    };
  return {
    label: "Valid",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
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

  const [isContextOpen, setIsContextOpen] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [fetchStatus, setFetchStatus] = useState<
    "idle" | "fetching" | "error" | "ready"
  >("idle");
  const [fullDoc, setFullDoc] = useState<TeacherDocument | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const isReady = !!fullDoc?.file_base64;
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

  const preloadData = async (): Promise<void> => {
    if (fetchStatus === "ready" || fetchStatus === "fetching") return;

    setFetchStatus("fetching");
    try {
      const response = await fetch(
        `${BASE_API}api/teacher-document-file/${doc.id}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        const result = await response.json();

        setFullDoc({ ...doc, file_base64: result.file_base64 });
        setFetchStatus("ready");
      } else {
        setFetchStatus("error");
        toast.error("Server error: " + response.status);
      }
    } catch (error) {
      setFetchStatus("error"); // This catches ERR_CONNECTION_REFUSED
      toast.error("Connection Refused. Is the backend running?");
      console.error("Connection error:", error);
    }
  };

  const handleAction = async (type: "download" | "print" | "preview") => {
    setIsContextOpen(false);
    if (!fullDoc?.file_base64) return;

    if (type === "preview") {
      setIsPreviewOpen(true);
    } else {
      const url = getBlob(fullDoc.file_base64, doc.extension);
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
    }
  };

  const actionButtonClassName =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={preloadData}
        className="group relative flex w-full cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-blue-300 hover:shadow-md"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${wrapperClassName}`}
          >
            <Icon className={`h-6 w-6 ${iconClassName}`} strokeWidth={2} />
          </div>

          <div ref={menuRef} className="relative flex items-center gap-2">
            {/* Status Pill */}
            <div
              className={`flex h-8 items-center gap-2 rounded-lg px-2 text-[10px] font-bold transition-all ${
                fetchStatus === "fetching"
                  ? "animate-pulse bg-blue-50 text-blue-500"
                  : fetchStatus === "ready"
                    ? "bg-emerald-50 text-emerald-600"
                    : fetchStatus === "error"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-50 text-slate-400"
              }`}
            >
              {fetchStatus === "fetching" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : fetchStatus === "ready" ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : fetchStatus === "error" ? (
                <FileWarning className="h-3 w-3" />
              ) : (
                <CloudDownload className="h-3 w-3" />
              )}
              <span>{fetchStatus.toUpperCase()}</span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsContextOpen(!isContextOpen);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-slate-50 text-slate-400 hover:border-slate-200 hover:bg-white"
            >
              <Ellipsis className="h-4 w-4" />
            </button>

            {isContextOpen && (
              <div
                className="absolute top-11 right-0 z-50 w-44 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                {!doc.is_archived ? (
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
                    <button
                      onClick={() => onArchive?.()}
                      className={`${actionButtonClassName} text-red-600 hover:bg-red-50`}
                    >
                      <Trash2 className="h-4 w-4" /> Archive
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onRestore?.()}
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
          <h4 className="mb-1 truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-blue-600">
            {highlightText(doc.document_title, highlightTerms)}
          </h4>
          <p className="mb-3 text-xs font-medium text-slate-400">
            {doc.extension.toUpperCase()} • {doc.file_size_in_mb} MB
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span>{formatReadableDate(doc.issue_date)}</span>
          <span>{formatReadableDate(doc.expiry_date)}</span>
        </div>

        {matchContext.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {matchContext.slice(0, 2).map((item, i) => (
              <p
                key={i}
                className="line-clamp-1 border-l-2 border-slate-100 pl-2 text-[11px] text-slate-500 italic"
              >
                "{highlightText(item, highlightTerms)}"
              </p>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-50 pt-4">
          {/* Status Badge - Reduced padding/text for better fit */}
          <span
            className={`${statusClassName.className} truncate rounded-full px-2 py-1 text-[9px] font-bold tracking-tight uppercase`}
          >
            {statusClassName.label}
          </span>

          {/* Preview Button - Compact version */}
          <button
            type="button"
            disabled={!previewSupported}
            onClick={(e) => {
              e.stopPropagation();
              handleAction("preview");
            }}
            className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-all ${
              !isReady
                ? "cursor-not-allowed bg-slate-100 text-slate-300"
                : "bg-blue-600 text-white shadow-md hover:bg-blue-700"
            }`}
            title={isReady ? "View Preview" : "Prepare file first"}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {isReady ? "VIEW" : "WAIT"}
            </span>
          </button>
        </div>
      </div>

      <DocumentPreview
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        doc={fullDoc}
        isFetching={fetchStatus != "ready"}
      />
    </>
  );
};

export default FileCard;

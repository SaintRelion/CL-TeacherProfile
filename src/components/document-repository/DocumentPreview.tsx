import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { Expand, ExternalLink, Minimize2, Loader2, X } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

export function DocumentPreview({
  open,
  onOpenChange,
  doc,
  isFetching,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: TeacherDocument | null;
  isFetching?: boolean;
}) {
  const [blobUrl, setBlobUrl] = useState<string | null>();

  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [customSize, setCustomSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const resizeState = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  useEffect(() => {
    if (open) {
      setIsExpanded(true);
      setCustomSize(null);
    }
  }, [open]);

  useEffect(() => {
    // Only create the Blob if the modal is open and we have the data
    if (open && doc?.file_base64) {
      try {
        const base64Clean = doc.file_base64.split(",")[1] || doc.file_base64;
        const byteCharacters = atob(base64Clean);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const mimeType =
          doc.extension.toLowerCase() === "pdf"
            ? "application/pdf"
            : `image/${doc.extension.toLowerCase()}`;

        const blob = new Blob([new Uint8Array(byteNumbers)], {
          type: mimeType,
        });
        const url = URL.createObjectURL(blob);

        setBlobUrl(url);

        // Cleanup: Revoke the URL when the modal closes or doc changes
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (error) {
        console.error("Blob conversion failed:", error);
      }
    } else {
      setBlobUrl(null);
    }
  }, [open, doc?.file_base64, doc?.extension]);

  if (!doc) return null;

  const handleOpenInNewTab = (): void => {
    if (!blobUrl) return;
    // This will now work perfectly because it's a blob: url, not a 2MB string
    window.open(blobUrl, "_blank");
  };

  const handleResizeStart = (
    event: ReactMouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();
    event.stopPropagation();

    const currentWidth =
      customSize?.width ?? (isExpanded ? window.innerWidth * 0.99 : 1152);
    const currentHeight =
      customSize?.height ??
      (isExpanded ? window.innerHeight * 0.98 : window.innerHeight * 0.9);

    resizeState.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: currentWidth,
      startHeight: currentHeight,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!resizeState.current) return;
      const deltaX = moveEvent.clientX - resizeState.current.startX;
      const deltaY = moveEvent.clientY - resizeState.current.startY;
      setCustomSize({
        width: Math.min(
          Math.max(720, resizeState.current.startWidth + deltaX),
          window.innerWidth - 16,
        ),
        height: Math.min(
          Math.max(520, resizeState.current.startHeight + deltaY),
          window.innerHeight - 16,
        ),
      });
    };

    const handleMouseUp = () => {
      resizeState.current = null;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        /* [&>button]:hidden removes the default floating close button that overlays your actions */
        className={`flex flex-col overflow-hidden border-none bg-white p-0 shadow-2xl [&>button]:hidden ${
          isExpanded
            ? "h-[98vh] max-w-[99vw] rounded-xl"
            : "h-[90vh] max-w-6xl rounded-2xl"
        }`}
        style={
          customSize
            ? {
                width: `${customSize.width}px`,
                height: `${customSize.height}px`,
                maxWidth: `${customSize.width}px`,
              }
            : undefined
        }
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 text-left">
          <div className="min-w-0 flex-1">
            <DialogTitle className="truncate text-base font-semibold text-slate-900">
              {doc.document_title}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-xs text-slate-500">
              {doc.extension.toUpperCase()} • {doc.file_size_in_mb}MB
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isExpanded ? "Minimize" : "Expand"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">New Tab</span>
            </button>

            <div className="mx-1 h-6 w-px bg-slate-200" />

            {/* Manually placed close button to prevent overlay issues */}
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="relative min-h-0 flex-1 bg-slate-100">
          {(isFetching || !blobUrl) && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="mt-2 text-xs font-medium text-slate-400">
                Loading Preview...
              </p>
            </div>
          )}

          {blobUrl ? (
            <div className="h-full w-full">
              {doc.extension.toLowerCase() === "pdf" ? (
                <iframe
                  src={blobUrl}
                  className="h-full w-full bg-white"
                  title={doc.document_title}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6">
                  <img
                    src={blobUrl}
                    className="max-h-full max-w-full rounded-xl bg-white object-contain shadow-lg"
                    alt={doc.document_title}
                  />
                </div>
              )}
            </div>
          ) : (
            !isFetching && (
              <div className="flex h-full items-center justify-center p-4 text-sm font-semibold text-slate-400">
                Preview not supported for {doc.extension.toUpperCase()} files.
              </div>
            )
          )}
        </div>

        <button
          type="button"
          onMouseDown={handleResizeStart}
          className="absolute right-1 bottom-1 flex h-6 w-6 cursor-se-resize items-center justify-center rounded-sm text-slate-300 transition hover:text-slate-600"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor">
            <path d="M5 11h1v1H5zm3 0h1v1H8zm3 0h1v1h-1zM8 8h1v1H8zm3 0h1v1h-1zm3 0h1v1h-1zm-3-3h1v1h-1zm3 0h1v1h-1z" />
          </svg>
        </button>
      </DialogContent>
    </Dialog>
  );
}

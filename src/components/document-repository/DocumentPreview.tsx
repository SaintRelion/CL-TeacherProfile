import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { Expand, ExternalLink, Minimize2, Loader2 } from "lucide-react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

export function DocumentPreview({
  open,
  onOpenChange,
  doc,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  doc: TeacherDocument | null;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [customSize, setCustomSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // 1. Hook into the "Heavy" file resource
  const { useRetrieve: getFile } = useResourceLocked<TeacherDocument>(
    "teacherdocumentfile",
  );

  // 2. Fetch data based on the doc ID.
  // In most resource hooks, passing the ID directly to the retrieve hook
  // handles the GET /api/teacherdocumentfile/{id} call.
  const fetchedData = getFile(doc?.id || "").data;

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

  if (!doc) return null;

  // 3. Extract the Base64 from the lazy-loaded result
  const base64Data = fetchedData?.file_base64;

  const previewSupported = ["pdf", "png", "jpg", "jpeg", "webp"].includes(
    doc.extension.toLowerCase(),
  );

  const handleOpenInNewTab = () => {
    if (!base64Data) return;
    const link = document.createElement("a");
    link.href = base64Data;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResizeStart = (event: ReactMouseEvent<HTMLButtonElement>) => {
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
      const minWidth = 720;
      const minHeight = 520;
      const maxWidth = window.innerWidth - 16;
      const maxHeight = window.innerHeight - 16;

      setCustomSize({
        width: Math.min(
          Math.max(minWidth, resizeState.current.startWidth + deltaX),
          maxWidth,
        ),
        height: Math.min(
          Math.max(minHeight, resizeState.current.startHeight + deltaY),
          maxHeight,
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

  const dialogStyle = customSize
    ? {
        width: `${customSize.width}px`,
        height: `${customSize.height}px`,
        maxWidth: `${customSize.width}px`,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`flex flex-col overflow-hidden border-none bg-white p-0 shadow-2xl ${
          isExpanded
            ? "h-[98vh] max-w-[99vw] rounded-xl"
            : "h-[90vh] max-w-6xl rounded-2xl"
        }`}
        style={dialogStyle}
      >
        <DialogHeader className="flex-row items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 text-left">
          <div className="min-w-0">
            <DialogTitle className="truncate text-base font-semibold text-slate-900">
              {doc.document_title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-slate-500">
              {doc.extension.toUpperCase()} • {doc.file_size_in_mb}MB
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Expand className="h-4 w-4" />
              )}
              {isExpanded ? "Minimize" : "Expand"}
            </button>

            <button
              type="button"
              disabled={!base64Data}
              onClick={handleOpenInNewTab}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <ExternalLink className="h-4 w-4" />
              View in New Tab
            </button>
          </div>
        </DialogHeader>

        <div className="relative min-h-0 flex-1 bg-slate-100">
          {/* Loading State Overlay while Base64 is fetching */}
          {!base64Data && previewSupported && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/50 backdrop-blur-[2px]">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
              <p className="mt-2 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                Loading Document Data...
              </p>
            </div>
          )}

          {base64Data && (
            <>
              {doc.extension.toLowerCase() === "pdf" && (
                <iframe
                  src={base64Data}
                  className="h-full w-full bg-white"
                  title={doc.document_title}
                />
              )}

              {["png", "jpg", "jpeg", "webp"].includes(
                doc.extension.toLowerCase(),
              ) && (
                <div className="flex h-full items-center justify-center p-6">
                  <img
                    src={base64Data}
                    className="max-h-full max-w-full rounded-xl bg-white object-contain shadow-lg"
                    alt={doc.document_title}
                  />
                </div>
              )}
            </>
          )}

          {!previewSupported && (
            <div className="flex h-full items-center justify-center p-4 text-sm font-semibold text-slate-400">
              Preview not supported for {doc.extension.toUpperCase()} files.
            </div>
          )}
        </div>

        <button
          type="button"
          onMouseDown={handleResizeStart}
          className="absolute right-1 bottom-1 h-5 w-5 cursor-se-resize rounded-sm text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          title="Resize preview"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4">
            <path
              d="M5 11h1v1H5zm3 0h1v1H8zm3 0h1v1h-1zM8 8h1v1H8zm3 0h1v1h-1zm3 0h1v1h-1zm-3-3h1v1h-1zm3 0h1v1h-1z"
              fill="currentColor"
            />
          </svg>
        </button>
      </DialogContent>
    </Dialog>
  );
}

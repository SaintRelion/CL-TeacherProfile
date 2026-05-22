import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Printer,
  ArrowLeft,
  X,
  Settings2,
  FileDown,
  Eye,
} from "lucide-react";

import { type PDSDataNode, type PDSPrintTemplateData } from "@/pds-schema";
import type { User } from "@/models/user";
import { transformDbToPrintData } from "@/lib/pds-mapper";
import {
  PDSPrintTemplate,
  type PDSPrintMode,
  type PDSPrintTemplateOptions,
} from "./PDSPrintTemplate";
import html2pdf from "html2pdf.js";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const PDSExportOptions: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  user,
}) => {
  // --- States ---
  const [printMode, setPrintMode] = useState<PDSPrintMode>("filled");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);

  const printOptions = useMemo<PDSPrintTemplateOptions>(
    () => ({
      mode: printMode,
    }),
    [printMode],
  );

  // --- Memos ---
  const formData = useMemo<PDSPrintTemplateData | null>(() => {
    if (!user?.pds) return null;
    return transformDbToPrintData(user.pds as PDSDataNode);
  }, [user]);

  // --- The "Golden" Print Function ---
  const handlePrint = () => {
    const content = document.getElementById("pds-printable-root");
    if (!content) return;

    const printWindow = window.open("", "_blank", "width=1100,height=900");
    if (!printWindow) return;

    const styleTags = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )
      .map((tag) => tag.outerHTML)
      .join("\n");

    // Clone and REMOVE the only-print class so it's visible in the new window
    const cloned = content.cloneNode(true) as HTMLElement;
    cloned.classList.remove("only-print");
    cloned.style.display = "block";

    printWindow.document.write(`
    <html>
      <head>
        <title>PDS Export - ${user.username}</title>
        ${styleTags}
        <style>
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          #pds-printable-root {
            margin: 0 auto !important;
            box-shadow: none !important;
            display: block !important;
          }
          table, th, td {
            border-color: black !important;
          }
          @media print {
            @page { margin: 0; size: auto; }
            body { padding: 0 !important; background: white !important; }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .print-page {
              break-before: page;
              page-break-before: always;
            }
            .print-page:first-child {
              break-before: avoid;
              page-break-before: avoid;
            }
          }
        </style>
      </head>
      <body>
        ${cloned.outerHTML}
        <script>
          window.onload = () => {
            setTimeout(() => { window.print(); }, 800);
          };
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("pds-printable-root");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `PDS_${user.username}.pdf`,
      image: {
        type: "jpeg" as const, // Force TS to treat this as the literal "jpeg"
        quality: 0.98,
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: "in",
        format: [8.5, 13] as [number, number],
        orientation: "portrait" as const,
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  const closeAll = () => {
    setPreviewOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      {/* 1. CONFIGURATION DIALOG */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[380px] p-6">
          <DialogHeader className="flex flex-row items-center gap-2">
            <Settings2 className="h-5 w-5 text-emerald-600" />
            <DialogTitle>Export PDS</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <label className="text-xs font-bold text-slate-500 uppercase">
              Print Mode
            </label>
            <div className="mt-2 flex gap-3">
              {(["filled", "blank"] as PDSPrintMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setPrintMode(mode)}
                  className={`flex-1 rounded-xl border-2 py-3 text-[11px] font-black tracking-widest uppercase transition-all ${
                    printMode === mode
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {mode === "filled" ? "Filled Data" : "Blank Form"}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="gap-2 bg-blue-600 px-8 shadow-md transition-all hover:bg-blue-700 active:scale-95"
              onClick={() => {
                onOpenChange(false);
                setPreviewOpen(true);
              }}
            >
              <Eye className="h-4 w-4" />
              Generate Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. DIGITAL PREVIEW OVERLAY */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          className="flex h-[98vh] w-[98vw] max-w-none flex-col overflow-hidden border-none bg-slate-900 p-0 shadow-2xl transition-all"
          style={{ maxWidth: "98vw" }}
        >
          {/* TOOLBAR - Now includes Download and Print */}
          <div className="z-50 flex items-center justify-between border-b bg-white p-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-600 p-2 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="leading-tight font-bold text-slate-900">
                  PDS Digital Preview
                </h3>
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Mode: {printMode}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setPreviewOpen(false);
                  onOpenChange(true);
                }}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Options
              </Button>

              <div className="mx-1 h-6 w-[1px] bg-slate-200" />

              {/* DOWNLOAD PDF ACTION */}
              <Button
                variant="outline"
                className="gap-2 border-slate-200 text-slate-700"
                onClick={handleDownloadPDF}
              >
                <FileDown className="h-4 w-4" />
                Download PDF
              </Button>

              {/* PRINT ACTION */}
              <Button
                className="gap-2 bg-emerald-600 px-6 shadow-md transition-all hover:bg-emerald-700 active:scale-95"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print Document
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={closeAll}
                className="ml-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* VIEWPORT AREA */}
          <div className="no-scrollbar custom-scroll flex-1 overflow-auto bg-slate-800 p-10">
            <div className="flex min-h-full items-start justify-center">
              {formData && (
                <div
                  className="transition-all duration-300 ease-in-out hover:shadow-[0_0_100px_rgba(0,0,0,0.6)]"
                  // Force show even though only-print hides it
                  style={{ display: "block" }}
                >
                  {/* Inline override to defeat only-print */}
                  <style>{`#pds-printable-root { display: block !important; }`}</style>
                  <PDSPrintTemplate
                    formData={formData}
                    options={printOptions}
                  />
                </div>
              )}
            </div>
            <div className="h-20" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

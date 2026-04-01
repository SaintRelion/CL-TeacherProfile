import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Printer, ArrowLeft, X, Settings2 } from "lucide-react";

import {
  PDS_CONFIG,
  type PDSDataNode,
  type PDSPrintTemplateData,
} from "@/pds-schema";
import type { User } from "@/models/user";
import { transformDbToPrintData } from "@/lib/pds-mapper";
import {
  PDSPrintTemplate,
  type PDSPrintMode,
  type PDSPrintPaperSize,
  type PDSPrintSectionId,
  type PDSPrintTemplateOptions,
} from "./PDSPrintTemplate";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const PDSPrintable: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  user,
}) => {
  // --- States ---
  const [paperSize, setPaperSize] = useState<PDSPrintPaperSize>("A4");
  const [printMode, setPrintMode] = useState<PDSPrintMode>("filled");
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [sectionsToPrint, setSectionsToPrint] = useState<
    Record<string, boolean>
  >(() =>
    PDS_CONFIG.reduce(
      (acc, s) => {
        acc[s.id] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  // --- Memos ---
  const formData = useMemo<PDSPrintTemplateData | null>(() => {
    if (!user?.pds) return null;
    return transformDbToPrintData(user.pds as PDSDataNode);
  }, [user]);

  const printOptions = useMemo<PDSPrintTemplateOptions>(
    () => ({
      mode: printMode,
      paperSize: paperSize,
      includedSections: Object.keys(sectionsToPrint).filter(
        (id) => sectionsToPrint[id],
      ) as PDSPrintSectionId[],
    }),
    [printMode, paperSize, sectionsToPrint],
  );

  // --- The "Golden" Print Function ---
  const handlePrint = () => {
    const content = document.getElementById("pds-printable-root");
    if (!content) return;

    // 1. Create Isolation Window
    const printWindow = window.open("", "_blank", "width=1100,height=900");
    if (!printWindow) return;

    // 2. Clone ALL application styles (Tailwind, Main CSS, Shadcn)
    const styleTags = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]'),
    )
      .map((tag) => tag.outerHTML)
      .join("\n");

    // 3. Construct the Print Document
    printWindow.document.write(`
      <html>
        <head>
          <title>PDS Export - ${user.username}</title>
          ${styleTags}
          <style>
            body { 
              margin: 0 !important; 
              padding: 20px !important; 
              background: #f1f5f9 !important; 
              display: flex;
              justify-content: center;
            }
            #pds-printable-root { 
              margin: 0 auto !important; 
              box-shadow: none !important; 
            }
            @media print {
              @page { 
                margin: 0; 
                size: auto; 
              }
              body { 
                padding: 0 !important; 
                background: white !important; 
              }
              * { 
                -webkit-print-color-adjust: exact !important; 
                print-color-adjust: exact !important; 
              }
            }
          </style>
        </head>
        <body>
          ${content.outerHTML}
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
                // Optional: window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const closeAll = () => {
    setPreviewOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      {/* 1. CONFIGURATION DIALOG */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[500px] p-6">
          <DialogHeader className="flex flex-row items-center gap-2">
            <Settings2 className="h-5 w-5 text-emerald-600" />
            <DialogTitle>PDS Export Options</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Paper Size
                </label>
                <Select
                  value={paperSize}
                  onValueChange={(v) => setPaperSize(v as PDSPrintPaperSize)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (Standard)</SelectItem>
                    <SelectItem value="Letter">Letter (Short)</SelectItem>
                    <SelectItem value="Legal">Legal (Long)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">
                  Print Mode
                </label>
                <Select
                  value={printMode}
                  onValueChange={(v) => setPrintMode(v as PDSPrintMode)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filled">Filled Data</SelectItem>
                    <SelectItem value="blank">Blank Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Sections to Include
              </label>
              <ScrollArea className="h-[220px] rounded-lg border bg-slate-50 p-4">
                {PDS_CONFIG.map((s) => (
                  <div
                    key={s.id}
                    className="mb-3 flex items-center gap-3 last:mb-0"
                  >
                    <Checkbox
                      id={`section-${s.id}`}
                      checked={sectionsToPrint[s.id]}
                      onCheckedChange={() =>
                        setSectionsToPrint((prev) => ({
                          ...prev,
                          [s.id]: !prev[s.id],
                        }))
                      }
                    />
                    <label
                      htmlFor={`section-${s.id}`}
                      className="cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {s.title}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                onOpenChange(false);
                setPreviewOpen(true);
              }}
            >
              Generate Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. DIGITAL PREVIEW OVERLAY */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          /* CRITICAL FIXES: 
       1. h-[98vh] and w-[98vw] for maximum screen real estate.
       2. max-w-none to override the default Shadcn/Radix 512px limit.
       3. p-0 to ensure the toolbar stays flush to the top.
    */
          className="flex h-[98vh] w-[98vw] max-w-none flex-col overflow-hidden border-none bg-slate-900 p-0 shadow-2xl transition-all"
          style={{ maxWidth: "98vw" }}
        >
          {/* TOOLBAR - Sticky at the top */}
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
                  Format: {paperSize} | Mode: {printMode}
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
                Options
              </Button>

              <div className="mx-1 h-6 w-[1px] bg-slate-200" />

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
                className="ml-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* VIEWPORT AREA - Where the magic happens */}
          <div className="no-scrollbar custom-scroll flex-1 overflow-x-auto overflow-y-auto bg-slate-800 p-10">
            {/* Centered Canvas: 
          We use justify-center on the parent and items-start 
          to allow the user to scroll from the top naturally.
      */}
            <div className="flex min-h-full items-start justify-center">
              {formData && (
                <div className="transition-all duration-300 ease-in-out hover:shadow-[0_0_100px_rgba(0,0,0,0.6)]">
                  <PDSPrintTemplate
                    formData={formData}
                    options={printOptions}
                  />
                </div>
              )}
            </div>

            {/* Bottom Padding so the PDS doesn't touch the bottom edge */}
            <div className="h-20" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

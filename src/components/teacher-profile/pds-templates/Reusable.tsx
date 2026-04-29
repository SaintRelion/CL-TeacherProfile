import type { PDSPrintTemplateData } from "@/pds-schema";

export interface PDSPageProps {
  data: PDSPrintTemplateData;
  show: (id: string) => boolean;
}

// --- CONSTANTS & HELPERS ---
export const sideLabelBg = "bg-[#cfcfcf]";
export const labelBg = "bg-[#f2f2f2]";
export const borderClass = "border-black border-r border-b";

export const SectionHeader = ({ title }: { title: string }) => (
  <div className="mt-[-1px] border-t border-b border-black bg-[#969696] px-2 py-0.5">
    <h2 className="text-[9pt] leading-tight font-extrabold text-white uppercase italic">
      {title}
    </h2>
  </div>
);

export const LabelBox = ({
  label,
  span = 2,
  className = "",
  rowSpan = 1,
}: {
  label: string;
  span?: number;
  className?: string;
  rowSpan?: number;
}) => (
  <div
    className={`${sideLabelBg} ${borderClass} flex flex-col justify-center p-1 text-[12px] text-black ${className}`}
    style={{ gridColumn: `span ${span}`, gridRow: `span ${rowSpan}` }}
  >
    {label}
  </div>
);

export const ValueBox = ({
  value,
  span = 4,
  className = "",
}: {
  value?: string;
  span?: number;
  className?: string;
}) => (
  <div
    className={`bg-white ${borderClass} flex items-center px-1.5 py-1 text-[12px] font-medium text-black uppercase ${className}`}
    style={{ gridColumn: `span ${span}` }}
  >
    {value || ""}
  </div>
);

export const AddressCell = ({
  label,
  value,
  span = 2,
}: {
  label: string;
  value?: string;
  span?: number;
}) => (
  <div
    className={`bg-white ${borderClass} flex flex-col p-1`}
    style={{ gridColumn: `span ${span}` }}
  >
    <div className="flex-grow text-[12px] leading-tight font-medium text-black uppercase">
      {value || ""}
    </div>
    <div className="text-[10px] leading-none italic">{label}</div>
  </div>
);

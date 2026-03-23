import type { LucideIcon } from "lucide-react";
import { ArrowRight, FileText, FolderKanban, Users } from "lucide-react";
import { Link } from "react-router-dom";

interface KPIValue {
  title: string;
  value: string;
  path?: string;
  details?: string;
}

interface KPICardProps {
  kvp: KPIValue;
  index?: number;
}

const iconStyles: Array<{
  Icon: LucideIcon;
  iconClassName: string;
  wrapperClassName: string;
  hoverShadowClassName: string;
}> = [
  {
    Icon: Users,
    iconClassName: "text-blue-600",
    wrapperClassName: "bg-blue-500/10",
    hoverShadowClassName: "hover:shadow-blue-500/15",
  },
  {
    Icon: FileText,
    iconClassName: "text-amber-600",
    wrapperClassName: "bg-amber-500/10",
    hoverShadowClassName: "hover:shadow-amber-500/15",
  },
  {
    Icon: FolderKanban,
    iconClassName: "text-rose-600",
    wrapperClassName: "bg-rose-500/10",
    hoverShadowClassName: "hover:shadow-rose-500/15",
  },
];

const KPICard = ({ kvp, index = 0 }: KPICardProps) => {
  const iconStyle = iconStyles[index % iconStyles.length];
  const { Icon } = iconStyle;

  const cardContent = (
    <>
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-slate-200/80 to-transparent" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{kvp.title}</p>
          <div className="mt-3 flex items-end gap-3">
            <p className="text-4xl font-semibold tracking-tight text-slate-900">
              {kvp.value}
            </p>
          </div>
          {kvp.details && (
            <p className="mt-3 text-sm text-slate-500">{kvp.details}</p>
          )}
        </div>
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconStyle.wrapperClassName}`}
        >
          <Icon className={`h-6 w-6 ${iconStyle.iconClassName}`} strokeWidth={2} />
        </div>
      </div>

      {kvp.path && (
        <div className="mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4 text-sm font-medium text-slate-500">
          <span>View details</span>
          <ArrowRight className="h-4 w-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-600" />
        </div>
      )}
    </>
  );

  const baseClassName = `group relative overflow-hidden rounded-2xl border border-slate-200/50 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${iconStyle.hoverShadowClassName}`;

  if (kvp.path) {
    return (
      <Link to={kvp.path} className={`${baseClassName} block cursor-pointer`}>
        {cardContent}
      </Link>
    );
  }

  return <div className={baseClassName}>{cardContent}</div>;
};

export default KPICard;

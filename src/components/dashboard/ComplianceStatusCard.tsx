import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileWarning,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ComplianceStatusCardProps {
  title: string;
  description: string;
  value: string;
  redirectPath?: string;
  tone: "danger" | "warning" | "success";
}

const toneStyles: Record<
  ComplianceStatusCardProps["tone"],
  {
    Icon: LucideIcon;
    iconClassName: string;
    iconWrapperClassName: string;
    badgeClassName: string;
    progressClassName: string;
    hoverShadowClassName: string;
  }
> = {
  danger: {
    Icon: FileWarning,
    iconClassName: "text-rose-600",
    iconWrapperClassName: "bg-rose-500/10",
    badgeClassName: "bg-rose-500/10 text-rose-700",
    progressClassName: "bg-rose-500",
    hoverShadowClassName: "hover:shadow-rose-500/15",
  },
  warning: {
    Icon: AlertTriangle,
    iconClassName: "text-amber-600",
    iconWrapperClassName: "bg-amber-500/10",
    badgeClassName: "bg-amber-500/10 text-amber-700",
    progressClassName: "bg-amber-500",
    hoverShadowClassName: "hover:shadow-amber-500/15",
  },
  success: {
    Icon: CheckCircle2,
    iconClassName: "text-emerald-600",
    iconWrapperClassName: "bg-emerald-500/10",
    badgeClassName: "bg-emerald-500/10 text-emerald-700",
    progressClassName: "bg-emerald-500",
    hoverShadowClassName: "hover:shadow-emerald-500/15",
  },
};

const ComplianceStatusCard = ({
  title,
  description,
  value,
  redirectPath,
  tone,
}: ComplianceStatusCardProps) => {
  const navigate = useNavigate();
  const percentage = parseInt(value.replace("%", ""), 10) || 0;
  const toneStyle = toneStyles[tone];
  const { Icon } = toneStyle;

  return (
    <button
      type="button"
      className={`group w-full rounded-2xl border border-slate-200/50 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${toneStyle.hoverShadowClassName} ${redirectPath ? "cursor-pointer" : "cursor-default"}`}
      onClick={() => redirectPath && navigate(redirectPath)}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneStyle.iconWrapperClassName}`}
        >
          <Icon className={`h-5 w-5 ${toneStyle.iconClassName}`} strokeWidth={2} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {title}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {description}
              </p>
            </div>
            <span
              className={`inline-flex shrink-0 rounded-xl px-2.5 py-1 text-sm font-semibold ${toneStyle.badgeClassName}`}
            >
              {value}
            </span>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                Compliance progress
              </span>
              {redirectPath && (
                <span className="inline-flex items-center gap-1 text-slate-500 transition-colors duration-300 group-hover:text-slate-700">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              )}
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${toneStyle.progressClassName} transition-all duration-700 ease-out`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ComplianceStatusCard;

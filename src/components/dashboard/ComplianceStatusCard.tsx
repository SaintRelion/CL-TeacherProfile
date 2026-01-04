interface ComplianceStatusCardProps {
  wrapperColor: string;
  iconClassName: string;
  title: string;
  description: string;
  value: string;
  valueClassName: string;
}

const ComplianceStatusCard = ({
  wrapperColor,
  iconClassName,
  title,
  value,
  valueClassName,
}: ComplianceStatusCardProps) => {
  // Determine progress bar color based on value
  const percentage = parseInt(value.replace("%", "")) || 0;
  const progressColor =
    percentage >= 90
      ? "bg-emerald-500"
      : percentage >= 70
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
      {/* Icon */}
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${wrapperColor}`}
      >
        <i className={`${iconClassName} text-sm`}></i>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-slate-700">{title}</p>
          <span className={`shrink-0 text-sm font-bold ${valueClassName}`}>
            {value}
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full ${progressColor} transition-all duration-500`}
            style={{ width: value }}
          ></div>
        </div>
      </div>
    </div>
  );
};
export default ComplianceStatusCard;

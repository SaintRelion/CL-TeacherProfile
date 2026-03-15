import { useNavigate } from "react-router-dom";

interface ComplianceStatusCardProps {
  wrapperColor: string;
  iconClassName: string;
  title: string;
  description: string;
  value: string;
  valueClassName: string;
  redirectPath?: string;
}

const ComplianceStatusCard = ({
  wrapperColor,
  iconClassName,
  title,
  value,
  valueClassName,
  redirectPath,
}: ComplianceStatusCardProps) => {
  const navigate = useNavigate();
  // Determine progress bar color based on value
  const percentage = parseInt(value.replace("%", "")) || 0;
  const progressColor =
    percentage >= 90
      ? "bg-blue-600"
      : percentage >= 70
        ? "bg-yellow-500"
        : "bg-red-500";

  const handleClick = () => {
    if (redirectPath) {
      navigate(redirectPath);
    }
  };

  return (
    <div 
      className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${redirectPath ? "cursor-pointer hover:bg-blue-50" : ""}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${wrapperColor}`}
        >
          <i className={`text-lg ${iconClassName}`}></i>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-gray-800">{title}</p>
            <span className={`inline-flex shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold ${valueClassName}`}>
              {value}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 line-clamp-1">Status overview</p>
          {/* Progress bar - Enhanced */}
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full ${progressColor} rounded-full transition-all duration-700 ease-out`}
              style={{ width: value }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ComplianceStatusCard;

import { Link } from "react-router-dom";

interface KPICardProps {
  kvp: Record<string, string>;
  index?: number;
}

const KPICard = ({ kvp, index = 0 }: KPICardProps) => {
  // Gradient backgrounds based on index for visual variety
  const gradients = [
    { bg: "from-blue-500 to-blue-600", light: "bg-blue-50", text: "text-blue-600" },
    { bg: "from-amber-500 to-orange-500", light: "bg-amber-50", text: "text-amber-600" },
    { bg: "from-emerald-500 to-green-500", light: "bg-emerald-50", text: "text-emerald-600" },
    { bg: "from-rose-500 to-red-500", light: "bg-rose-50", text: "text-rose-600" },
  ];
  
  const gradient = gradients[index % gradients.length];

  const cardContent = (
    <>
      {/* Decorative gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradient.bg}`}></div>
      
      {/* Background pattern effect */}
      <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${gradient.light} opacity-30 blur-2xl`}></div>
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-semibold tracking-widest uppercase ${gradient.text}`}>
            {kvp.title}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <p className="text-secondary-900 text-4xl font-bold tracking-tight">
              {kvp.value}
            </p>
          </div>
          {kvp.details && (
            <p className="text-slate-600 mt-4 text-sm">
              {kvp.details}
            </p>
          )}
        </div>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient.bg} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
          <i className={`${kvp.kpiIcon?.split(' ')[0]} ${kvp.kpiIcon?.split(' ')[1]} text-2xl text-white`}></i>
        </div>
      </div>
      
      {/* Click indicator */}
      {kvp.path && (
        <div className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:bg-slate-200">
          <i className="fas fa-arrow-right text-slate-600"></i>
        </div>
      )}
    </>
  );

  const baseClassName = "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 hover:border-slate-300";

  // If path is provided, render as a Link
  if (kvp.path) {
    return (
      <Link to={kvp.path} className={`${baseClassName} block cursor-pointer`}>
        {cardContent}
      </Link>
    );
  }

  // Otherwise render as a div
  return (
    <div className={baseClassName}>
      {cardContent}
    </div>
  );
};
export default KPICard;

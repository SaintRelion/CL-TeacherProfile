interface KPICardProps {
  kvp: Record<string, string>;
  index?: number;
}

const KPICard = ({ kvp, index = 0 }: KPICardProps) => {
  // Gradient backgrounds based on index for visual variety
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-green-500",
    "from-rose-500 to-red-500",
  ];
  
  const gradient = gradients[index % gradients.length];

  const cardContent = (
    <>
      {/* Decorative gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-secondary-500 text-sm font-medium tracking-wide uppercase">
            {kvp.title}
          </p>
          <p className="text-secondary-900 mt-2 text-3xl font-bold tracking-tight">
            {kvp.value}
          </p>
          {kvp.details && (
            <p className="text-success-600 mt-3 flex items-center gap-1.5 text-sm font-medium">
              <i className={kvp.detailsIcon}></i>
              <span>{kvp.details}</span>
            </p>
          )}
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <i className={`${kvp.kpiIcon?.split(' ')[0]} ${kvp.kpiIcon?.split(' ')[1]} text-xl text-white`}></i>
        </div>
      </div>
      
      {/* Click indicator */}
      {kvp.path && (
        <div className="absolute bottom-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <i className="fas fa-arrow-right text-slate-400"></i>
        </div>
      )}
    </>
  );

  const baseClassName = "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5";

  // If path is provided, render as a link
  if (kvp.path) {
    return (
      <a href={kvp.path} className={`${baseClassName} block cursor-pointer`}>
        {cardContent}
      </a>
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

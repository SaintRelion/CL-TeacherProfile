const KpiCard = ({ kvp }: { kvp: Record<string, string> }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-secondary-600 text-sm font-medium">{kvp.title}</p>
          <p className="text-secondary-900 mt-1 text-2xl font-bold">
            {kvp.value}
          </p>
        </div>
        <i className={kvp.iconClassName}></i>
      </div>
    </div>
  );
};
export default KpiCard;

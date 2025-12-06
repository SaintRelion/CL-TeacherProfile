const Filters = ({
  filters,
  onSearchChange,
  onFilterChange,
}: {
  filters: Record<string, string>;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents, content, or metadata..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 py-3 pr-12 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
            />
            <i className="fas fa-search text-secondary-400 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
            <button className="text-secondary-400 hover:text-primary-600 absolute top-1/2 right-3 -translate-y-1/2 transform">
              <i className="fas fa-sliders-h"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className="focus:ring-primary-500 rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
          >
            <option value="">Sort By</option>
            <option value="modified">Date Modified</option>
            <option value="created">Date Created</option>
            <option value="name">File Name</option>
            <option value="size">File Size</option>
          </select>

          <div className="flex items-center rounded-lg bg-slate-100 p-1">
            <button className="text-primary-600 rounded-md bg-white p-2 shadow-sm">
              <i className="fas fa-th-large"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange("quickTag", "none")}
          className={`${filters.quickTag == "none" ? "bg-primary-100" : "bg-slate-100"} text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-sm font-medium transition-colors`}
        >
          None
        </button>
        <button
          onClick={() => onFilterChange("quickTag", "recent")}
          className={`${filters.quickTag == "recent" ? "bg-primary-100" : "bg-slate-100"} text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-sm font-medium transition-colors`}
        >
          Recent
        </button>
        <button
          onClick={() => onFilterChange("quickTag", "expiring")}
          className={`${filters.quickTag == "expiring" ? "bg-primary-100" : "bg-slate-100"} text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-sm font-medium transition-colors`}
        >
          Expiring soon
        </button>
        <button
          onClick={() => onFilterChange("quickTag", "large")}
          className={`${filters.quickTag == "large" ? "bg-primary-100" : "bg-slate-100"} text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-sm font-medium transition-colors`}
        >
          Large files
        </button>
      </div>
    </div>
  );
};
export default Filters;

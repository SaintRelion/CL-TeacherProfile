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
    <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documents, content, or metadata..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <i className="fas fa-search absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"></i>
            <button className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-blue-600">
              <i className="fas fa-sliders-h"></i>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">All Departments</option>
            <option value="mathematics">Mathematics</option>
            <option value="science">Science</option>
            <option value="english">English</option>
            <option value="social-studies">Social Studies</option>
            <option value="physical-education">Physical Education</option>
            <option value="arts">Arts</option>
            <option value="technology">Technology</option>
          </select>

          <select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Sort By</option>
            <option value="modified">Date Modified</option>
            <option value="created">Date Created</option>
            <option value="name">File Name</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange("quickTag", "none")}
          className={`${
            filters.quickTag == "none"
              ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-700"
          } rounded-full px-3 py-1 text-sm font-medium transition-colors hover:bg-blue-200`}
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

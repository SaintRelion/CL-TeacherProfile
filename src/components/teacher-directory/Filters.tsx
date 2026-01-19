import { useState } from "react";

const Filters = ({
  dataCount,
  filters,
  onSearchChange,
  onFilterChange,
  onViewChange,
}: {
  dataCount: string;
  filters: Record<string, string>;
  onSearchChange: (search: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onViewChange?: (view: "grid" | "list") => void;
}) => {
  const [showFilter, setShowFilter] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "list">("grid"); // "grid" or "list"

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name, subject, or employee ID..."
              className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:outline-none"
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <i className="fas fa-search text-secondary-400 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center space-x-2 rounded-lg border px-4 py-3 transition-all ${
              showFilter
                ? "border-primary-500 bg-primary-50 text-primary-600"
                : "border-slate-300 text-secondary-600 hover:bg-slate-50"
            }`}
          >
            <i className={`fas fa-filter transition-transform ${showFilter ? "rotate-180" : ""}`}></i>
            <span className="text-secondary-700">Filters</span>
          </button>
          <div className="flex items-center rounded-lg border border-slate-300 p-1">
            <button
              onClick={() => {
                setGridView("grid");
                onViewChange?.("grid");
              }}
              className={`flex items-center space-x-1 rounded-md px-3 py-2 transition-all ${
                gridView === "grid"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-secondary-600 hover:bg-slate-50"
              }`}
            >
              <i className="fas fa-th-large"></i>
              <span className="text-sm">Grid</span>
            </button>
            <button
              onClick={() => {
                setGridView("list");
                onViewChange?.("list");
              }}
              className={`flex items-center space-x-1 rounded-md px-3 py-2 transition-all ${
                gridView === "list"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "bg-white text-secondary-600 hover:bg-slate-50"
              }`}
            >
              <i className="fas fa-list"></i>
              <span className="text-sm">List</span>
            </button>
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-secondary-700 mb-2 block text-sm font-medium">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange("department", e.target.value)}
                className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
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
            </div>
            <div>
              <label className="text-secondary-700 mb-2 block text-sm font-medium">
                Certification Status
              </label>
              <select
                value={filters.certificationStatus}
                onChange={(e) =>
                  onFilterChange("certificationStatus", e.target.value)
                }
                className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
              >
                <option value="">All Status</option>
                <option value="current">Current</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div>
              <label className="text-secondary-700 mb-2 block text-sm font-medium">
                Years of Service
              </label>
              <select
                value={filters.yearsOfService}
                onChange={(e) =>
                  onFilterChange("yearsOfService", e.target.value)
                }
                className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
              >
                <option value="">All Experience</option>
                <option value="0 2 years">0-2 years</option>
                <option value="3 5 years">3-5 years</option>
                <option value="6 10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
            <div>
              <label className="text-secondary-700 mb-2 block text-sm font-medium">
                Performance Rating
              </label>
              <select
                value={filters.performanceRating}
                onChange={(e) =>
                  onFilterChange("performanceRating", e.target.value)
                }
                className="focus:ring-primary-500 w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:outline-none"
              >
                <option value="">All Ratings</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="satisfactory">Satisfactory</option>
                <option value="needs-improvement">Needs Improvement</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => onFilterChange("reset", "")}
              className="text-secondary-600 hover:text-secondary-800 text-sm font-medium"
            >
              <i className="fas fa-undo mr-1"></i>
              Reset Filters
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-secondary-600 text-sm">
                {dataCount} teachers found
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Filters;

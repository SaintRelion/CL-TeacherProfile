import {
  ChevronDown,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

const defaultFileTypes: FilterOption[] = [
  { label: "All File Types", value: "" },
  { label: "PDF", value: "pdf" },
  { label: "DOCX", value: "docx" },
  { label: "DOC", value: "doc" },
  { label: "XLSX", value: "xlsx" },
  { label: "XLS", value: "xls" },
  { label: "PNG", value: "png" },
  { label: "JPG", value: "jpg" },
  { label: "ZIP", value: "zip" },
];

const defaultStatuses: FilterOption[] = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
  { label: "Expiring", value: "expiring" },
  { label: "Expired", value: "expired" },
];

const selectClassName =
  "h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-9 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10";

const dateClassName =
  "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-all duration-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-500/10";

const Filters = ({
  filters,
  searchValue,
  onSearchChange,
  onFilterChange,
  suggestionItems = [],
  departmentOptions = [],
  fileTypeOptions = defaultFileTypes,
  statusOptions = defaultStatuses,
}: {
  filters: Record<string, string>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
  suggestionItems?: string[];
  departmentOptions?: FilterOption[];
  fileTypeOptions?: FilterOption[];
  statusOptions?: FilterOption[];
}) => {
  const activeFiltersCount = [
    filters.department,
    filters.sort,
    filters.quickTag,
    filters.fileType,
    filters.uploadDateFrom,
    filters.uploadDateTo,
    filters.expiryDateFrom,
    filters.expiryDateTo,
    filters.status,
    searchValue,
  ].filter(Boolean).length;

  const uniqueSuggestions = Array.from(
    new Set(
      suggestionItems
        .map((item) => item.trim())
        .filter((item) => item.length >= 2),
    ),
  ).slice(0, 6);

  return (
    <div className="mb-5 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_48px_-36px_rgba(15,23,42,0.35)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white sm:flex">
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-all duration-200 focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/10">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors duration-200 group-focus-within:text-blue-600">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchValue}
                list="document-search-suggestions"
                placeholder="Search documents, metadata..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 w-full bg-transparent pl-10 pr-16 text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-400 shadow-sm">
                  Ctrl K
                </span>
              </div>
            </div>

            {uniqueSuggestions.length > 0 && (
              <datalist id="document-search-suggestions">
                {uniqueSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-600">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{activeFiltersCount}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onSearchChange("");
              onFilterChange("reset", "");
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
            title="Clear all filters"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-5">
        <div className="relative">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className={selectClassName}
            title="Department"
          >
            <option value="">Department</option>
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="relative">
          <select
            value={filters.fileType}
            onChange={(e) => onFilterChange("fileType", e.target.value)}
            className={selectClassName}
            title="File type"
          >
            {fileTypeOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className={selectClassName}
            title="Status"
          >
            {statusOptions.map((option) => (
              <option key={option.value || "all"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange("sort", e.target.value)}
            className={selectClassName}
            title="Sort"
          >
            <option value="">Relevance</option>
            <option value="relevance">Relevance</option>
            <option value="created_desc">Latest</option>
            <option value="created_asc">Oldest</option>
            <option value="name_asc">Name A-Z</option>
            <option value="name_desc">Name Z-A</option>
            <option value="size_desc">Largest</option>
            <option value="size_asc">Smallest</option>
            <option value="expiry_asc">Expiring soonest</option>
            <option value="expiry_desc">Expiry latest</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="min-w-0">
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Upload From
            </label>
            <input
              type="date"
              value={filters.uploadDateFrom}
              onChange={(e) => onFilterChange("uploadDateFrom", e.target.value)}
              className={dateClassName}
              title="Upload date from"
            />
          </div>
          <div className="min-w-0">
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
              Upload To
            </label>
            <input
              type="date"
              value={filters.uploadDateTo}
              onChange={(e) => onFilterChange("uploadDateTo", e.target.value)}
              className={dateClassName}
              title="Upload date to"
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default Filters;

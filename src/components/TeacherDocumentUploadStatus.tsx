import { useState, useMemo } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type { TeacherDocument } from "@/models/TeacherDocument";

interface TeacherUploadStatus {
  userId: string;
  name: string;
  department: string;
  email: string;
  employeeId: string;
  documentCount: number;
  lastUploadDate: string | null;
  hasCompleted: boolean;
}

interface Filters {
  searchQuery: string;
  department: string;
  statusFilter: "all" | "completed" | "pending";
}

const TeacherDocumentUploadStatus = () => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getTeacherInformation } =
    useResourceLocked<PersonalInformation>("personalinformation");
  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");

  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    department: "",
    statusFilter: "all",
  });

  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [sortBy, setSortBy] = useState<"name" | "department" | "date">("name");

  // API Data
  const usersData = getUsers();
  const teachersInfoData = getTeacherInformation();
  const documentsData = getDocuments();

  // Loading and error states
  const isLoading =
    usersData.isLoading ||
    teachersInfoData.isLoading ||
    documentsData.isLoading;
  const hasError =
    usersData.error || teachersInfoData.error || documentsData.error;

  // Get unique departments from teacher data
  const availableDepartments = useMemo(() => {
    const depts = new Set(
      (teachersInfoData.data ?? []).map((ti) => ti.department).filter(Boolean),
    );
    return Array.from(depts).sort();
  }, [teachersInfoData.data]);

  // Process and enrich teacher data with upload status
  const processedTeachers = useMemo(() => {
    const users = usersData.data ?? [];
    const teachersInfo = teachersInfoData.data ?? [];
    const documents = documentsData.data ?? [];

    const teacherMap = new Map<string, TeacherUploadStatus>();

    // Create entries for all teachers
    users.forEach((user) => {
      const info = teachersInfo.find((ti) => ti.user === user.id);

      if (info) {
        const userDocuments = documents.filter(
          (doc) => doc.user_id === user.id,
        );
        const sortedDocs = userDocuments.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

        teacherMap.set(user.id, {
          userId: user.id,
          name: `${info.first_name} ${info.middle_name} ${info.last_name}`.trim(),
          department: info.department || "Unknown",
          email: info.email || "—",
          employeeId: info.employee_id || "—",
          documentCount: userDocuments.length,
          lastUploadDate:
            sortedDocs.length > 0 ? sortedDocs[0].created_at : null,
          hasCompleted: userDocuments.length > 0,
        });
      }
    });

    return Array.from(teacherMap.values());
  }, [usersData.data, teachersInfoData.data, documentsData.data]);

  // Filter teachers based on search and filters
  const filteredTeachers = useMemo(() => {
    return processedTeachers.filter((teacher) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          teacher.name.toLowerCase().includes(query) ||
          teacher.employeeId.toLowerCase().includes(query) ||
          teacher.email.toLowerCase().includes(query);

        if (!matchesSearch) return false;
      }

      // Department filter
      if (filters.department && teacher.department !== filters.department) {
        return false;
      }

      // Status filter
      if (filters.statusFilter === "completed" && !teacher.hasCompleted) {
        return false;
      }
      if (filters.statusFilter === "pending" && teacher.hasCompleted) {
        return false;
      }

      return true;
    });
  }, [processedTeachers, filters]);

  // Sort teachers
  const sortedTeachers = useMemo(() => {
    const teachers = [...filteredTeachers];
    switch (sortBy) {
      case "name":
        return teachers.sort((a, b) => a.name.localeCompare(b.name));
      case "department":
        return teachers.sort((a, b) =>
          a.department.localeCompare(b.department),
        );
      case "date":
        return teachers.sort((a, b) => {
          const dateA = a.lastUploadDate
            ? new Date(a.lastUploadDate).getTime()
            : 0;
          const dateB = b.lastUploadDate
            ? new Date(b.lastUploadDate).getTime()
            : 0;
          return dateB - dateA;
        });
      default:
        return teachers;
    }
  }, [filteredTeachers, sortBy]);

  // Split teachers by upload status
  const completedTeachers = sortedTeachers.filter((t) => t.hasCompleted);
  const pendingTeachers = sortedTeachers.filter((t) => !t.hasCompleted);

  // Statistics
  const stats = {
    total: processedTeachers.length,
    completed: processedTeachers.filter((t) => t.hasCompleted).length,
    pending: processedTeachers.filter((t) => !t.hasCompleted).length,
    completionRate:
      processedTeachers.length > 0
        ? Math.round(
            (processedTeachers.filter((t) => t.hasCompleted).length /
              processedTeachers.length) *
              100,
          )
        : 0,
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (hasError) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <i className="fas fa-exclamation-circle text-red-600"></i>
            </div>
            <div>
              <h3 className="font-medium text-red-900">Error Loading Data</h3>
              <p className="mt-1 text-sm text-red-700">
                Failed to fetch teacher and document information. Please try
                refreshing the page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Upload Status
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Track teacher document submissions and upload completion
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Teachers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <i className="fas fa-users text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {stats.completed}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <i className="fas fa-check-circle text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <i className="fas fa-hourglass-half text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="mt-1 text-2xl font-bold text-blue-600">
                {stats.completionRate}%
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <i className="fas fa-chart-pie text-blue-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="font-medium text-gray-900">Filters & Search</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("table")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Table view"
              >
                <i className="fas fa-table mr-2"></i>
                Table
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === "cards"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title="Card view"
              >
                <i className="fas fa-grip mr-2"></i>
                Cards
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Search by Name, ID, or Email
              </label>
              <input
                type="text"
                placeholder="Type to search..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    searchQuery: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              >
                <option value="">All Departments</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload Status
              </label>
              <select
                value={filters.statusFilter}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    statusFilter: e.target.value as Filters["statusFilter"],
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              >
                <option value="name">Name (A-Z)</option>
                <option value="department">Department</option>
                <option value="date">Last Upload Date</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.searchQuery ||
            filters.department ||
            filters.statusFilter !== "all") && (
            <button
              onClick={() =>
                setFilters({
                  searchQuery: "",
                  department: "",
                  statusFilter: "all",
                })
              }
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <i className="fas fa-times mr-1"></i>
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">
              Loading teacher documents...
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && sortedTeachers.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <i className="fas fa-search text-2xl text-gray-400"></i>
            </div>
            <h3 className="mt-4 font-medium text-gray-900">No Results Found</h3>
            <p className="mt-1 text-sm text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      )}

      {/* Content Views */}
      {!isLoading && sortedTeachers.length > 0 && (
        <>
          {/* Table View */}
          {viewMode === "table" && (
            <div className="space-y-6">
              {/* Completed Section */}
              {completedTeachers.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-white px-6 py-4">
                    <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                        <i className="fas fa-check text-green-600"></i>
                      </div>
                      Completed ({completedTeachers.length})
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Employee ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Documents
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Last Upload
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedTeachers.map((teacher) => (
                          <tr
                            key={teacher.userId}
                            className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {teacher.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {teacher.employeeId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {teacher.department}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                                <i className="fas fa-file"></i>
                                {teacher.documentCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {formatDate(teacher.lastUploadDate)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pending Section */}
              {pendingTeachers.length > 0 && (
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <div className="border-b border-gray-200 bg-gradient-to-r from-yellow-50 to-white px-6 py-4">
                    <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                        <i className="fas fa-hourglass-half text-yellow-600"></i>
                      </div>
                      Pending ({pendingTeachers.length})
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Employee ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingTeachers.map((teacher) => (
                          <tr
                            key={teacher.userId}
                            className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              {teacher.name}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {teacher.employeeId}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {teacher.department}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {teacher.email}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                                <i className="fas fa-clock"></i>
                                Awaiting Upload
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cards View */}
          {viewMode === "cards" && (
            <div className="space-y-8">
              {/* Completed Cards */}
              {completedTeachers.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                      <i className="fas fa-check text-green-600"></i>
                    </div>
                    Completed ({completedTeachers.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {completedTeachers.map((teacher) => (
                      <div
                        key={teacher.userId}
                        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {teacher.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {teacher.employeeId}
                            </p>
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                            <i className="fas fa-check text-green-600"></i>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-gray-100 pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Department</span>
                            <span className="font-medium text-gray-900">
                              {teacher.department}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Documents</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              <i className="fas fa-file"></i>
                              {teacher.documentCount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Last Upload</span>
                            <span className="font-medium text-gray-900">
                              {formatDate(teacher.lastUploadDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending Cards */}
              {pendingTeachers.length > 0 && (
                <div>
                  <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100">
                      <i className="fas fa-hourglass-half text-yellow-600"></i>
                    </div>
                    Pending ({pendingTeachers.length})
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pendingTeachers.map((teacher) => (
                      <div
                        key={teacher.userId}
                        className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm transition-all hover:shadow-md"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {teacher.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {teacher.employeeId}
                            </p>
                          </div>
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                            <i className="fas fa-clock text-yellow-600"></i>
                          </div>
                        </div>

                        <div className="space-y-2 border-t border-yellow-100 pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Department</span>
                            <span className="font-medium text-gray-900">
                              {teacher.department}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Email</span>
                            <span className="text-xs text-gray-600">
                              {teacher.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Status</span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                              <i className="fas fa-exclamation-circle"></i>
                              Awaiting
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TeacherDocumentUploadStatus;

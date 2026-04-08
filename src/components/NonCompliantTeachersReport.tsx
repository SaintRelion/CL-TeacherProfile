import { useState, useMemo } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { User } from "@/models/user";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type { TeacherDocument } from "@/models/TeacherDocument";

interface NonCompliantTeacher {
  userId: string;
  name: string;
  department: string;
  email: string;
  employeeId: string;
  position: string;
  dateHired: string;
  daysWithoutSubmission: number;
  lastActivityDate: string | null;
}

interface Filters {
  searchQuery: string;
  department: string;
  daysSinceHire: "all" | "30" | "60" | "90";
}

const NonCompliantTeachersReport = () => {
  const { useList: getUsers } = useResourceLocked<User>("user");
  const { useList: getTeacherInformation } =
    useResourceLocked<PersonalInformation>("personalinformation");
  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");

  const [filters, setFilters] = useState<Filters>({
    searchQuery: "",
    department: "",
    daysSinceHire: "all",
  });

  const [sortBy, setSortBy] = useState<
    "name" | "department" | "daysWithoutSubmission"
  >("daysWithoutSubmission");

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

  // Get unique departments
  const availableDepartments = useMemo(() => {
    const depts = new Set(
      (teachersInfoData.data ?? []).map((ti) => ti.department).filter(Boolean),
    );
    return Array.from(depts).sort();
  }, [teachersInfoData.data]);

  // Calculate days since date
  const calculateDaysSince = (dateString: string) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get non-compliant (non-submitting) teachers
  const nonCompliantTeachers = useMemo(() => {
    const users = usersData.data ?? [];
    const teachersInfo = teachersInfoData.data ?? [];
    const documents = documentsData.data ?? [];

    const nonCompliant: NonCompliantTeacher[] = [];

    users.forEach((user) => {
      const info = teachersInfo.find((ti) => ti.user === user.id);

      if (info) {
        const userDocuments = documents.filter(
          (doc) => doc.user_id === user.id,
        );

        // Only include teachers with NO documents (non-compliant)
        if (userDocuments.length === 0) {
          nonCompliant.push({
            userId: user.id,
            name: `${info.first_name} ${info.middle_name} ${info.last_name}`.trim(),
            department: info.department || "Unknown",
            email: info.email || "—",
            employeeId: info.employee_id || "—",
            position: info.position || "—",
            dateHired: info.date_hired || "—",
            daysWithoutSubmission: calculateDaysSince(info.date_hired),
            lastActivityDate: null,
          });
        }
      }
    });

    return nonCompliant;
  }, [usersData.data, teachersInfoData.data, documentsData.data]);

  // Apply filters
  const filteredTeachers = useMemo(() => {
    return nonCompliantTeachers.filter((teacher) => {
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

      // Days since hire filter
      if (filters.daysSinceHire !== "all") {
        const days = parseInt(filters.daysSinceHire);
        if (teacher.daysWithoutSubmission < days) {
          return false;
        }
      }

      return true;
    });
  }, [nonCompliantTeachers, filters]);

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
      case "daysWithoutSubmission":
        return teachers.sort(
          (a, b) => b.daysWithoutSubmission - a.daysWithoutSubmission,
        );
      default:
        return teachers;
    }
  }, [filteredTeachers, sortBy]);

  // Statistics
  const stats = {
    total: nonCompliantTeachers.length,
    criticalPriority: nonCompliantTeachers.filter(
      (t) => t.daysWithoutSubmission >= 90,
    ).length,
    highPriority: nonCompliantTeachers.filter(
      (t) => t.daysWithoutSubmission >= 60 && t.daysWithoutSubmission < 90,
    ).length,
    mediumPriority: nonCompliantTeachers.filter(
      (t) => t.daysWithoutSubmission >= 30 && t.daysWithoutSubmission < 60,
    ).length,
  };

  // Get priority level
  const getPriorityLevel = (days: number) => {
    if (days >= 90)
      return {
        label: "Critical",
        color: "red",
        bg: "bg-red-50",
        badge: "bg-red-100 text-red-700",
      };
    if (days >= 60)
      return {
        label: "High",
        color: "orange",
        bg: "bg-orange-50",
        badge: "bg-orange-100 text-orange-700",
      };
    if (days >= 30)
      return {
        label: "Medium",
        color: "yellow",
        bg: "bg-yellow-50",
        badge: "bg-yellow-100 text-yellow-700",
      };
    return {
      label: "Low",
      color: "blue",
      bg: "bg-blue-50",
      badge: "bg-blue-100 text-blue-700",
    };
  };

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "—") return "—";
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
                Failed to fetch compliance data. Please try refreshing the page.
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Compliance Status Report
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Teachers who have not submitted required documents
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-600">Non-Compliant Teachers</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stats.total}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <i className="fas fa-exclamation text-gray-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-red-700">Critical Priority</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {stats.criticalPriority}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <i className="fas fa-exclamation-triangle text-red-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-orange-700">High Priority</p>
              <p className="mt-1 text-2xl font-bold text-orange-600">
                {stats.highPriority}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
              <i className="fas fa-hourglass-half text-orange-600"></i>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-yellow-700">Medium Priority</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {stats.mediumPriority}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <i className="fas fa-clock text-yellow-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Filters & Search</h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Days Since Hire */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Days Without Submission
              </label>
              <select
                value={filters.daysSinceHire}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    daysSinceHire: e.target
                      .value as typeof filters.daysSinceHire,
                  }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              >
                <option value="all">All</option>
                <option value="30">30+ days</option>
                <option value="60">60+ days</option>
                <option value="90">90+ days (Critical)</option>
              </select>
            </div>
          </div>

          {/* Sort Control */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
              >
                <option value="daysWithoutSubmission">
                  Days Without Submission
                </option>
                <option value="name">Name (A-Z)</option>
                <option value="department">Department</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.searchQuery ||
              filters.department ||
              filters.daysSinceHire !== "all") && (
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: "",
                    department: "",
                    daysSinceHire: "all",
                  })
                }
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                <i className="fas fa-times mr-1"></i>
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="rounded-lg border border-gray-200 bg-white p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            <p className="mt-4 text-sm text-gray-600">
              Loading compliance data...
            </p>
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && sortedTeachers.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <h3 className="mt-4 font-medium text-green-900">
              All Teachers Compliant!
            </h3>
            <p className="mt-1 text-sm text-green-700">
              All teachers have submitted their required documents.
            </p>
          </div>
        </div>
      )}

      {/* Teachers Table */}
      {!isLoading && sortedTeachers.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
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
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Date Hired
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Days Without Submission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                    Priority
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTeachers.map((teacher) => {
                  const priority = getPriorityLevel(
                    teacher.daysWithoutSubmission,
                  );
                  return (
                    <tr
                      key={teacher.userId}
                      className={`border-b border-gray-100 transition-colors hover:bg-gray-50 ${priority.bg}`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div>
                          <p>{teacher.name}</p>
                          <p className="text-xs text-gray-500">
                            {teacher.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.employeeId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.department}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {teacher.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(teacher.dateHired)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <span className="inline-flex items-center gap-1">
                          <i className="fas fa-calendar-times text-gray-500"></i>
                          {teacher.daysWithoutSubmission} days
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${priority.badge}`}
                        >
                          <i className={`fas fa-circle text-xs`}></i>
                          {priority.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
            <p className="text-sm text-gray-600">
              Showing <strong>{sortedTeachers.length}</strong> of{" "}
              <strong>{nonCompliantTeachers.length}</strong> non-compliant
              teachers
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      {!isLoading && nonCompliantTeachers.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 font-medium text-gray-900">Priority Levels</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-600"></div>
              <span className="text-sm text-gray-600">Critical (90+ days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-600"></div>
              <span className="text-sm text-gray-600">High (60-89 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-600"></div>
              <span className="text-sm text-gray-600">Medium (30-59 days)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-600">Low (&lt;30 days)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NonCompliantTeachersReport;

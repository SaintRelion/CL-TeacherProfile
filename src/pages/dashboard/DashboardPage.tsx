import KPICard from "@/components/dashboard/KPICard";
import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import ViewComplianceReport from "@/components/dashboard/ViewComplianceReport";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DOCUMENT_TYPES } from "@/constants";
import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/user";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  // Welcome message state - shows on login, fades after 3 seconds
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    return !hasSeenWelcome;
  });

  // Teacher selection state
  const [showTeacherSelection, setShowTeacherSelection] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [filteredTeachers, setFilteredTeachers] = useState<User[]>([]);

  useEffect(() => {
    if (showWelcome) {
      // Mark as seen in session storage
      sessionStorage.setItem("hasSeenWelcome", "true");

      // Remove element after 3 seconds
      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);

      return () => {
        clearTimeout(hideTimer);
      };
    }
  }, [showWelcome]);

  const { useSelect: selectUsers } = useDBOperationsLocked<User>("User");
  const { data: teachers } = selectUsers();

  // Filter teachers based on search
  useEffect(() => {
    const filtered = teachers?.filter((teacher) => {
      if (!teacherSearch.trim()) return true;
      const searchLower = teacherSearch.toLowerCase();
      return teacher.username.toLowerCase().includes(searchLower);
    }) || [];
    setFilteredTeachers(filtered);
  }, [teachers, teacherSearch]);

  const { useSelect: documentsSelect } =
    useDBOperationsLocked<TeacherDocument>("TeacherDocument");
  const { data: documents } = documentsSelect();

  const complianceMapping = React.useMemo(() => {
    const map = new Map<
      string,
      { total: number; expired: number; expiring: number; valid: number }
    >();

    DOCUMENT_TYPES.forEach((type) =>
      map.set(type, { total: 0, expired: 0, expiring: 0, valid: 0 }),
    );

    if (documents && documents.length > 0) {
      documents.forEach((doc) => {
        const type = doc.documentType || "Uncategorized";
        if (!map.has(type)) {
          map.set(type, { total: 0, expired: 0, expiring: 0, valid: 0 });
        }

        const state = getExpiryState(doc.expiryDate);
        const bucket = map.get(type)!;

        bucket.total++;
        bucket[
          state === "expired"
            ? "expired"
            : state === "expiring"
              ? "expiring"
              : "valid"
        ]++;
      });
    }

    return map;
  }, [documents]);

  const complianceStatus = React.useMemo(() => {
    return Array.from(complianceMapping.entries()).map(([title, bucket]) => {
      const { total, expired, expiring, valid } = bucket;
      const compliancePercent =
        total === 0 ? 100 : Math.round((valid / total) * 100);

      let wrapperColor = "";
      let iconClassName = "";
      let valueClassName = "";
      let description = "";

      if (expired > 0) {
        wrapperColor = "bg-error-50";
        iconClassName = "fas fa-times-circle text-white";
        valueClassName = "text-error-600 font-semibold";
        description = `${expired} expired documents`;
      } else if (expiring > 0) {
        wrapperColor = "bg-warning-50";
        iconClassName = "fas fa-exclamation-triangle text-white";
        valueClassName = "text-warning-600 font-semibold";
        description = `${expiring} expiring within 30 days`;
      } else {
        wrapperColor = "bg-success-50";
        iconClassName = "fas fa-check text-white";
        valueClassName = "text-success-600 font-semibold";
        description = "All current and valid";
      }

      return {
        wrapperColor,
        iconClassName,
        title,
        description,
        value: `${compliancePercent}%`,
        valueClassName,
      };
    });
  }, [complianceMapping]);

  const { globalComplianceRate, globalPendingActions } = React.useMemo(() => {
    if (!complianceMapping || complianceMapping.size === 0) {
      return { globalComplianceRate: "100%", globalPendingActions: "0" };
    }

    let totalDocs = 0;
    let totalValid = 0;
    let totalPending = 0;

    complianceMapping.forEach((bucket) => {
      const { expired = 0, expiring = 0, valid = 0, total = 0 } = bucket;
      totalDocs += total;
      totalValid += valid;
      totalPending += expired + expiring;
    });

    return {
      globalComplianceRate:
        totalDocs === 0
          ? "100%"
          : ((totalValid / totalDocs) * 100).toFixed(1) + "%",
      globalPendingActions: totalPending.toString(),
    };
  }, [complianceMapping]);

  const handleNavigateToTeacherProfile = () => {
    if (!selectedTeacherId) {
      alert("Please select a teacher");
      return;
    }
    // Navigate to teacher profile inspect page with the selected teacher ID
    navigate(`/teacherprofileinspect?teacherId=${selectedTeacherId}`);
    setShowTeacherSelection(false);
    setSelectedTeacherId(null);
    setTeacherSearch("");
  };

  const kpi = [
    {
      title: "Total Teachers",
      value: teachers == undefined ? "0" : teachers.length.toString(),
      kpiIcon:
        "fas fa-chalkboard-teacher text-primary-600 text-xl bg-primary-100 p-3 rounded-lg",
      path: "/teacherdirectory",
    },
    {
      title: "Documents Processed",
      value: documents == undefined ? "0" : documents.length.toString(),
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
      path: "/documentrepository",
    },
    {
      title: "Compliance Rate",
      value: globalComplianceRate,
      kpiIcon:
        "fas fa-shield-alt text-success-600 text-xl bg-success-100 p-3 rounded-lg",
      path: "/documentrepository",
    },
    {
      title: "Pending Actions",
      value: globalPendingActions,
      kpiIcon:
        "fas fa-tasks text-error-600 text-xl bg-error-100 p-3 rounded-lg",
      path: "/documentrepository",
    },
  ];

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">Welcome back! Here's your compliance overview.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className="fas fa-calendar-alt"></i>
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {kpi.map((value, index) => (
            <KPICard key={index} kvp={value} index={index} />
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Compliance Status - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
            {/* Card Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                    <i className="fas fa-clipboard-check text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-secondary-900 text-lg font-semibold">
                      Compliance Status
                    </h3>
                    <p className="text-sm text-slate-500">
                      Document compliance by category
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-semibold text-blue-600">
                    {complianceStatus.length} Categories
                  </span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-3">
                {complianceStatus.map((card) => (
                  <ComplianceStatusCard
                    key={card.title}
                    wrapperColor={card.wrapperColor}
                    iconClassName={card.iconClassName}
                    title={card.title}
                    description={card.description}
                    value={card.value}
                    valueClassName={card.valueClassName}
                  />
                ))}
              </div>

              {/* View Report Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5">
                    <i className="fas fa-chart-bar"></i>
                    View Detailed Compliance Report
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-4xl">
                  {documents && teachers && (
                    <ViewComplianceReport
                      documents={documents}
                      teachers={teachers}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                  <i className="fas fa-bolt text-xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-secondary-900 text-lg font-semibold">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-slate-500">Common tasks</p>
                </div>
              </div>
            </div>
            <div className="space-y-2 p-4">
              <Link
                to="/teacherdirectory"
                className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-blue-50 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">
                    Add New Teacher
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Register faculty
                  </p>
                </div>
                <i className="fas fa-arrow-right ml-auto text-slate-300 text-sm transition-all duration-300 group-hover:text-blue-500 group-hover:translate-x-1"></i>
              </Link>

              <Link
                to="/documentrepository"
                className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-amber-50 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-all duration-300 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110">
                  <i className="fas fa-folder-plus"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">
                    Upload Documents
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    Add teacher docs
                  </p>
                </div>
                <i className="fas fa-arrow-right ml-auto text-slate-300 text-sm transition-all duration-300 group-hover:text-amber-500 group-hover:translate-x-1"></i>
              </Link>

              <Dialog open={showTeacherSelection} onOpenChange={setShowTeacherSelection}>
                <DialogTrigger asChild>
                  <button className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-emerald-50 hover:shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110">
                      <i className="fas fa-user-edit"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm">Update Profile</p>
                      <p className="text-xs text-slate-500 truncate">
                        Edit teacher profile
                      </p>
                    </div>
                    <i className="fas fa-arrow-right ml-auto text-slate-300 text-sm transition-all duration-300 group-hover:text-emerald-500 group-hover:translate-x-1"></i>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Teacher to Update</DialogTitle>
                    <DialogDescription>
                      Search and select a teacher whose profile you want to update.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Search Input */}
                    <div>
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={teacherSearch}
                        onChange={(e) => setTeacherSearch(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Teacher List */}
                    <div className="max-h-64 space-y-2 overflow-y-auto">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <button
                            key={teacher.id}
                            onClick={() => setSelectedTeacherId(teacher.id)}
                            className={`w-full rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                              selectedTeacherId === teacher.id
                                ? "border-emerald-500 bg-emerald-50"
                                : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                            }`}
                          >
                            <p className="font-semibold text-slate-800">{teacher.username}</p>
                            {selectedTeacherId === teacher.id && (
                              <div className="mt-2 flex items-center gap-1 text-emerald-600">
                                <i className="fas fa-check text-sm"></i>
                                <span className="text-xs font-medium">Selected</span>
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-sm text-slate-500">No teachers found</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setShowTeacherSelection(false);
                          setSelectedTeacherId(null);
                          setTeacherSearch("");
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNavigateToTeacherProfile}
                        disabled={!selectedTeacherId}
                        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* System Status Card */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
                  <i className="fas fa-server text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">
                    System Status
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-emerald-600">
                      All systems operational
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-2xl font-bold text-slate-800">
                    {teachers?.length || 0}
                  </p>
                  <p className="text-xs text-slate-500">Active Users</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-2xl font-bold text-slate-800">
                    {documents?.length || 0}
                  </p>
                  <p className="text-xs text-slate-500">Total Docs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;

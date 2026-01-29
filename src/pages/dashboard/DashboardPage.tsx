import KPICard from "@/components/dashboard/KPICard";
import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import ViewComplianceReport from "@/components/dashboard/ViewComplianceReport";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DOCUMENT_TYPES } from "@/constants";
import type { DocumentFolder } from "@/models/DocumentFolder";
import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/User";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createImpersonationToken,
  useCurrentUser,
} from "@saintrelion/auth-lib";

const DashboardPage = () => {
  const user = useCurrentUser();

  const navigate = useNavigate();

  // Welcome message state - shows on login, fades after 3 seconds
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    return !hasSeenWelcome;
  });

  // Teacher selection state
  const [showTeacherSelection, setShowTeacherSelection] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null,
  );
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

  const { useList: getUsers } = useResourceLocked<User>("user");
  const teachers = getUsers().data;

  const nonAdminTeachers = React.useMemo(() => {
    if (!teachers) return [];
    return teachers.filter((t: any) => {
      // `roles` may be an array or undefined; exclude users with 'admin' role
      if (!t.roles) return true;
      return !t.roles.includes("admin");
    });
  }, [teachers]);

  // Filter teachers based on search
  useEffect(() => {
    const filtered =
      teachers?.filter((teacher) => {
        if (!teacherSearch.trim()) return true;
        const searchLower = teacherSearch.toLowerCase();
        return teacher.username.toLowerCase().includes(searchLower);
      }) || [];
    setFilteredTeachers(filtered);
  }, [teachers, teacherSearch]);

  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");
  const documents = getDocuments().data;
  const liveDocuments = React.useMemo(() => {
    if (!documents) return [];
    return documents.filter((d) => !d.archived);
  }, [documents]);

  const { useList: getDocumentFolders } =
    useResourceLocked<DocumentFolder>("documentfolder");
  const documentFolders = getDocumentFolders().data;

  const complianceMapping = React.useMemo(() => {
    const map = new Map<
      string,
      {
        total: number;
        expired: number;
        expiring: number;
        valid: number;
        compliantTeachers: Set<string>;
      }
    >();

    // Initialize map with folders (use folder name); fallback to DOCUMENT_TYPES if no folders
    if (documentFolders && documentFolders.length > 0) {
      documentFolders.forEach((f) => {
        map.set(f.name, {
          total: 0,
          expired: 0,
          expiring: 0,
          valid: 0,
          compliantTeachers: new Set<string>(),
        });
      });
    } else {
      DOCUMENT_TYPES.forEach((type) =>
        map.set(type, {
          total: 0,
          expired: 0,
          expiring: 0,
          valid: 0,
          compliantTeachers: new Set<string>(),
        }),
      );
    }

    if (liveDocuments && liveDocuments.length > 0) {
      liveDocuments.forEach((doc) => {
        const folderName =
          (documentFolders &&
            documentFolders.find((f) => f.id === doc.folderId)?.name) ||
          "Uncategorized";

        if (!map.has(folderName)) {
          map.set(folderName, {
            total: 0,
            expired: 0,
            expiring: 0,
            valid: 0,
            compliantTeachers: new Set<string>(),
          });
        }

        const state = getExpiryState(doc.expiryDate);
        const bucket = map.get(folderName)!;

        bucket.total++;
        const key =
          state === "expired"
            ? "expired"
            : state === "expiring"
              ? "expiring"
              : "valid";
        (bucket as any)[key]++;

        // Count teacher as compliant for this folder only when they have at least one VALID document
        if (state === "valid") {
          bucket.compliantTeachers.add(doc.userId);
        }
      });
    }

    return map;
  }, [liveDocuments, documentFolders]);

  const complianceStatus = React.useMemo(() => {
    const totalTeachers = nonAdminTeachers?.length || 0;
    return Array.from(complianceMapping.entries()).map(([title, bucket]) => {
      const { expired, expiring, compliantTeachers } = bucket as any;

      const compliantCount = compliantTeachers ? compliantTeachers.size : 0;
      const compliancePercent =
        totalTeachers === 0
          ? 100
          : Math.round((compliantCount / totalTeachers) * 100);

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
        description = ` ${compliantCount} of ${totalTeachers} teachers compliant`;
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
  }, [complianceMapping, nonAdminTeachers]);

  const { globalPendingActions } = React.useMemo(() => {
    if (!complianceMapping || complianceMapping.size === 0) {
      return { globalComplianceRate: "100%", globalPendingActions: "0" };
    }

    let totalPending = 0;
    let sumFolderPercents = 0;
    let folderCount = 0;

    const totalTeachers = nonAdminTeachers?.length || 0;

    complianceMapping.forEach((bucket) => {
      const {
        expired = 0,
        expiring = 0,
        compliantTeachers = new Set(),
      } = bucket as any;
      totalPending += expired + expiring;

      if (totalTeachers > 0) {
        sumFolderPercents += (compliantTeachers.size / totalTeachers) * 100;
        folderCount++;
      }
    });

    const avgPercent =
      folderCount === 0 ? 100 : sumFolderPercents / folderCount;

    return {
      globalComplianceRate: avgPercent.toFixed(1) + "%",
      globalPendingActions: totalPending.toString(),
    };
  }, [complianceMapping, nonAdminTeachers]);

  const handleNavigateToTeacherProfile = async () => {
    if (!selectedTeacherId) {
      alert("Please select a teacher");
      return;
    }

    const token = await createImpersonationToken(user.id, selectedTeacherId);
    // Navigate to teacher profile inspect page with the selected teacher ID
    navigate(`/teacherprofileinspect?token=${token}`);
    setShowTeacherSelection(false);
    setSelectedTeacherId(null);
    setTeacherSearch("");
  };

  const kpi = [
    {
      title: "Total Teachers",
      value:
        nonAdminTeachers == undefined
          ? "0"
          : nonAdminTeachers.length.toString(),
      kpiIcon:
        "fas fa-chalkboard-teacher text-primary-600 text-xl bg-primary-100 p-3 rounded-lg",
      path: "/admin/teacherdirectory",
    },
    {
      title: "Documents Processed",
      value: liveDocuments == undefined ? "0" : liveDocuments.length.toString(),
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
      path: "/admin/documentrepository",
    },

    {
      title: "Pending Actions",
      value: globalPendingActions,
      kpiIcon:
        "fas fa-tasks text-error-600 text-xl bg-error-100 p-3 rounded-lg",
      path: "/admin/documentrepository",
    },
  ];

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-600">
              Welcome back! Here's your compliance overview.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <i className="fas fa-calendar-alt"></i>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6 lg:grid-cols-3">
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
                      Document compliance by folder
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
                  <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-2xl hover:shadow-blue-500/40">
                    <i className="fas fa-chart-bar"></i>
                    View Expiry Document Reports
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-w-4xl">
                  {liveDocuments && teachers && (
                    <ViewComplianceReport
                      documents={liveDocuments}
                      teachers={teachers}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>{" "}
        {/* Quick Actions Sidebar */}
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
                to="/admin/teacherdirectory"
                className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-blue-50 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white">
                  <i className="fas fa-user-plus"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Add New Teacher
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Register faculty
                  </p>
                </div>
                <i className="fas fa-arrow-right ml-auto text-sm text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-blue-500"></i>
              </Link>

              <Link
                to="/admin/documentrepository"
                className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-amber-50 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-600 group-hover:text-white">
                  <i className="fas fa-folder-plus"></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">
                    Upload Documents
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Add teacher docs
                  </p>
                </div>
                <i className="fas fa-arrow-right ml-auto text-sm text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-500"></i>
              </Link>

              <Dialog
                open={showTeacherSelection}
                onOpenChange={setShowTeacherSelection}
              >
                <DialogTrigger asChild>
                  <button className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-300 hover:bg-emerald-50 hover:shadow-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white">
                      <i className="fas fa-user-edit"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        Update Profile
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Edit teacher profile
                      </p>
                    </div>
                    <i className="fas fa-arrow-right ml-auto text-sm text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-emerald-500"></i>
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Teacher to Update</DialogTitle>
                    <DialogDescription>
                      Search and select a teacher whose profile you want to
                      update.
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
                            <p className="font-semibold text-slate-800">
                              {teacher.username}
                            </p>
                            {selectedTeacherId === teacher.id && (
                              <div className="mt-2 flex items-center gap-1 text-emerald-600">
                                <i className="fas fa-check text-sm"></i>
                                <span className="text-xs font-medium">
                                  Selected
                                </span>
                              </div>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="py-4 text-center">
                          <p className="text-sm text-slate-500">
                            No teachers found
                          </p>
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
                        className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
                    {nonAdminTeachers?.length || 0}
                  </p>
                  <p className="text-xs text-slate-500">Active Users</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-2xl font-bold text-slate-800">
                    {liveDocuments?.length || 0}
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

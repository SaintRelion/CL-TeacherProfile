import KPICard from "@/components/dashboard/KPICard";
import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import ViewComplianceReport from "@/components/dashboard/ViewComplianceReport";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DocumentFolder } from "@/models/DocumentFolder";
import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/user";
import {
  BadgeCheck,
  Bolt,
  ChartColumnBig,
  ChevronRight,
  FolderUp,
  Search,
  ServerCog,
  UserPlus,
  UserRoundPen,
} from "lucide-react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const COMPLIANCE_PAGE_SIZE = 5;

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
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null,
  );
  const [filteredTeachers, setFilteredTeachers] = useState<User[]>([]);
  const [compliancePage, setCompliancePage] = useState(1);

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
  const teachers = getUsers({
    filters: {
      groups: 2,
    },
  }).data;

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

  useEffect(() => {
    setCompliancePage(1);
  }, [teacherSearch]);

  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");
  const activeDocuments = getDocuments({
    filters: { is_archived: "False" },
  }).data;

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
        submittedTeachers: Set<string>;
        compliantTeachers: Set<string>;
      }
    >();

    // 1. Initialize map with folder names
    if (documentFolders && documentFolders.length > 0) {
      documentFolders.forEach((f) => {
        map.set(f.name, {
          total: 0,
          expired: 0,
          expiring: 0,
          valid: 0,
          submittedTeachers: new Set<string>(),
          compliantTeachers: new Set<string>(),
        });
      });
    }

    if (activeDocuments && activeDocuments.length > 0) {
      activeDocuments.forEach((doc) => {
        // FIX: Changed doc.folder to doc.folder_id to match your JSON
        const folder = documentFolders?.find((f) => f.id === doc.folder_id);
        const folderName = folder ? folder.name : "Uncategorized";

        if (!map.has(folderName)) {
          map.set(folderName, {
            total: 0,
            expired: 0,
            expiring: 0,
            valid: 0,
            submittedTeachers: new Set<string>(),
            compliantTeachers: new Set<string>(),
          });
        }

        const state = getExpiryState(doc.expiry_date);
        const bucket = map.get(folderName)!;

        // FIX: Changed doc.user to doc.user_id to match your JSON
        const userIdStr = String(doc.user_id);

        bucket.total++;
        bucket.submittedTeachers.add(userIdStr);

        const key =
          state === "expired"
            ? "expired"
            : state === "expiring"
              ? "expiring"
              : "valid";
        bucket[key]++;

        if (state === "valid") {
          bucket.compliantTeachers.add(userIdStr);
        }
      });
    }

    return map;
  }, [activeDocuments, documentFolders]);

  const complianceStatus = React.useMemo(() => {
    const totalTeachers =
      filteredTeachers.length || (teachers && teachers.length) || 0;
    return Array.from(complianceMapping.entries()).map(([title, bucket]) => {
      const { expired, expiring, submittedTeachers, compliantTeachers } =
        bucket;

      const compliantCount = compliantTeachers ? compliantTeachers.size : 0;
      const compliancePercent =
        totalTeachers === 0
          ? 0
          : Math.round((submittedTeachers.size / totalTeachers) * 100);

      let description = "";
      let tone: "danger" | "warning" | "success" = "success";

      if (expired > 0) {
        tone = "danger";
        description = `${expired} expired documents`;
      } else if (expiring > 0) {
        tone = "warning";
        description = `${expiring} expiring within 30 days`;
      } else {
        tone = "success";
        description = ` ${compliantCount} of ${totalTeachers} teachers compliant`;
      }

      // Find the folder ID for this title
      const folderId = documentFolders?.find((f) => f.name === title)?.id;

      return {
        title,
        description,
        value: `${compliancePercent}%`,
        tone,
        redirectPath: `/admin/documentrepository?folder=${folderId}`,
      };
    });
  }, [complianceMapping, documentFolders, filteredTeachers.length, teachers]);

  const complianceTotalPages = Math.max(
    1,
    Math.ceil(complianceStatus.length / COMPLIANCE_PAGE_SIZE),
  );
  const paginatedComplianceStatus = complianceStatus.slice(
    (compliancePage - 1) * COMPLIANCE_PAGE_SIZE,
    compliancePage * COMPLIANCE_PAGE_SIZE,
  );

  console.log(paginatedComplianceStatus);
  const complianceStart =
    complianceStatus.length === 0
      ? 0
      : (compliancePage - 1) * COMPLIANCE_PAGE_SIZE + 1;
  const complianceEnd = Math.min(
    compliancePage * COMPLIANCE_PAGE_SIZE,
    complianceStatus.length,
  );

  const handleNavigateToTeacherProfile = (): void => {
    if (!selectedTeacherId) return;

    navigate(`/admin/teacherprofileinspect?teacher=${selectedTeacherId}`);

    setShowTeacherSelection(false);
    setSelectedTeacherId(null);
    setTeacherSearch("");
  };

  const kpi = [
    {
      title: "Total Teachers",
      value: teachers ? teachers.length.toString() : "0",
      kpiIcon:
        "fas fa-chalkboard-teacher text-primary-600 text-xl bg-primary-100 p-3 rounded-lg",
      path: "/admin/teacherdirectory",
    },
    {
      title: "Documents Processed",
      value:
        activeDocuments == undefined ? "0" : activeDocuments.length.toString(),
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
      path: "/admin/documentrepository",
    },

    {
      title: "Total Folders",
      value: documentFolders ? documentFolders.length.toString() : "0",
      kpiIcon:
        "fas fa-folder text-error-600 text-xl bg-error-100 p-3 rounded-lg",
      path: "/admin/documentrepository",
    },
  ];

  return (
    <main className="min-h-screen flex-1 bg-slate-50 p-4 md:p-6 lg:p-8">
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
          <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/15">
            {/* Card Header */}
            <div className="border-b border-slate-200/70 bg-white px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                    <BadgeCheck
                      className="h-6 w-6 text-blue-600"
                      strokeWidth={2}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Compliance Status
                    </h3>
                    <p className="text-sm text-slate-500">
                      Document compliance by folder
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-blue-500/10 px-3 py-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span className="text-xs font-semibold text-blue-700">
                    {complianceStatus.length} Categories
                  </span>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <div className="space-y-3">
                {paginatedComplianceStatus.map((card) => (
                  <ComplianceStatusCard
                    key={card.title}
                    title={card.title}
                    description={card.description}
                    value={card.value}
                    tone={card.tone}
                    redirectPath={card.redirectPath}
                  />
                ))}
              </div>

              {complianceStatus.length > COMPLIANCE_PAGE_SIZE && (
                <div className="mt-5 flex flex-col gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {complianceStart}-{complianceEnd} of{" "}
                    {complianceStatus.length} folders
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCompliancePage((page) => Math.max(1, page - 1))
                      }
                      disabled={compliancePage === 1}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    <span className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-700">
                      {compliancePage} / {complianceTotalPages}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setCompliancePage((page) =>
                          Math.min(complianceTotalPages, page + 1),
                        )
                      }
                      disabled={compliancePage === complianceTotalPages}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/15">
                    <ChartColumnBig className="h-4 w-4" />
                    View Expiry Document Reports
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/70 bg-white shadow-2xl sm:max-w-4xl">
                  {activeDocuments && teachers && (
                    <ViewComplianceReport
                      documents={activeDocuments}
                      teachers={teachers}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200/50 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/15">
            <div className="border-b border-slate-200/70 bg-white px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10">
                  <Bolt className="h-6 w-6 text-amber-600" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-slate-500">Common tasks</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-4">
              <Link
                to="/admin/teacherdirectory"
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-blue-500/15"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <UserPlus className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Add New Teacher
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Register faculty
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-500" />
              </Link>

              <Link
                to="/admin/documentrepository"
                className="group flex items-center gap-3 rounded-2xl border border-slate-200/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-amber-500/15"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                  <FolderUp className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Upload Documents
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    Add teacher docs
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-500" />
              </Link>

              <Dialog
                open={showTeacherSelection}
                onOpenChange={setShowTeacherSelection}
              >
                <DialogTrigger asChild>
                  <button className="group flex w-full items-center gap-3 rounded-2xl border border-slate-200/50 p-3 text-left transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-sky-500/15">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600">
                      <UserRoundPen className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Update Profile
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Edit teacher profile
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-slate-500" />
                  </button>
                </DialogTrigger>

                <DialogContent className="rounded-2xl border border-slate-200/70 bg-white shadow-2xl sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Select Teacher to Update</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={teacherSearch}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setTeacherSearch(e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 text-sm outline-none focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>

                    <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map((teacher) => (
                          <button
                            key={teacher.id}
                            onClick={() => setSelectedTeacherId(teacher.id)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3 transition-all duration-200 ${
                              selectedTeacherId === teacher.id
                                ? "border-blue-300 bg-blue-50/80 shadow-sm"
                                : "border-transparent bg-white hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`text-sm font-medium ${
                                  selectedTeacherId === teacher.id
                                    ? "text-blue-700"
                                    : "text-slate-700"
                                }`}
                              >
                                {teacher.username}
                              </span>
                              {selectedTeacherId === teacher.id && (
                                <BadgeCheck className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="py-4 text-center text-sm text-slate-500">
                          No teachers found
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setShowTeacherSelection(false);
                          setSelectedTeacherId(null);
                        }}
                        className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleNavigateToTeacherProfile}
                        disabled={!selectedTeacherId}
                        className="flex-1 rounded-xl bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:bg-blue-700 disabled:opacity-50"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DashboardPage;

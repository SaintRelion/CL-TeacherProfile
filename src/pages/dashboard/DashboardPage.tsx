import ComplianceStatusCard from "@/components/dashboard/ComplianceStatusCard";
import KPICard from "@/components/dashboard/KPICard";
import ViewComplianceReport from "@/components/dashboard/ViewComplianceReport";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DOCUMENT_TYPES, NO_FACE_IMAGE } from "@/constants";
import { getExpiryState, resolveImageSource } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/User";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import React, { useState, useEffect } from "react";

const DashboardPage = () => {
  const { user } = useAuth();
  
  // Welcome message state - shows on login, fades after 3 seconds
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    return !hasSeenWelcome;
  });
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      // Mark as seen in session storage
      sessionStorage.setItem('hasSeenWelcome', 'true');
      
      // Start fade out after 2.5 seconds
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2500);
      
      // Remove element after fade completes (3 seconds total)
      const hideTimer = setTimeout(() => {
        setShowWelcome(false);
      }, 3000);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [showWelcome]);

  const { useSelect: selectUsers } = useDBOperationsLocked<User>("User");
  const { data: teachers } = selectUsers();

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
        iconClassName =
          "fas fa-times-circle text-white bg-error-500 rounded-lg p-2";
        valueClassName = "text-error-600 font-semibold";
        description = `${expired} expired documents`;
      } else if (expiring > 0) {
        wrapperColor = "bg-warning-50";
        iconClassName =
          "fas fa-exclamation-triangle text-white bg-warning-500 rounded-lg p-2";
        valueClassName = "text-warning-600 font-semibold";
        description = `${expiring} expiring within 30 days`;
      } else {
        wrapperColor = "bg-success-50";
        iconClassName = "fas fa-check text-white bg-success-500 rounded-lg p-2";
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

  const kpi: Record<string, string>[] = [
    {
      title: "Total Teachers",
      value: teachers == undefined ? "0" : teachers.length.toString(),
      kpiIcon:
        "fas fa-chalkboard-teacher text-primary-600 text-xl bg-primary-100 p-3 rounded-lg",
      path: "/teacher-directory",
    },
    {
      title: "Documents Processed",
      value: documents == undefined ? "0" : documents.length.toString(),
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
      path: "/document-repository",
    },
    {
      title: "Compliance Rate",
      value: globalComplianceRate,
      kpiIcon:
        "fas fa-shield-alt text-success-600 text-xl bg-success-100 p-3 rounded-lg",
      path: "/document-repository",
    },
    {
      title: "Pending Actions",
      value: globalPendingActions,
      kpiIcon:
        "fas fa-tasks text-error-600 text-xl bg-error-100 p-3 rounded-lg",
      path: "/document-repository",
    },
  ];

  return (
    <main className="min-h-screen flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Welcome Banner */}
      

      {/* KPI Cards */}
      <div className="mb-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
          {kpi.map((value, index) => (
            <KPICard key={index} kvp={value} index={index} />
          ))}
        </div>
      </div>



      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Compliance Status - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* Card Header */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                    <i className="fas fa-clipboard-check text-white"></i>
                  </div>
                  <div>
                    <h3 className="text-secondary-900 text-lg font-semibold">
                      Compliance Status
                    </h3>
                    <p className="text-sm text-slate-500">Document compliance by category</p>
                  </div>
                </div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {complianceStatus.length} Categories
                </span>
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
                  <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/30">
                    <i className="fas fa-chart-bar"></i>
                    View Detailed Compliance Report
                  </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl sm:max-w-4xl">
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
        </div>

        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/25">
                  <i className="fas fa-bolt text-white"></i>
                </div>
                <div>
                  <h3 className="text-secondary-900 text-lg font-semibold">Quick Actions</h3>
                  <p className="text-sm text-slate-500">Common tasks</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <a href="/teacher-directory" className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-blue-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <i className="fas fa-user-plus"></i>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Add New Teacher</p>
                    <p className="text-xs text-slate-500">Register a new faculty member</p>
                  </div>
                  <i className="fas fa-chevron-right ml-auto text-slate-300 group-hover:text-blue-500"></i>
                </a>
                
                <a href="/document-repository" className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-amber-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                    <i className="fas fa-folder-plus"></i>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Upload Documents</p>
                    <p className="text-xs text-slate-500">Add new teacher documents</p>
                  </div>
                  <i className="fas fa-chevron-right ml-auto text-slate-300 group-hover:text-amber-500"></i>
                </a>
                
                <a href="/teacher-profile" className="group flex items-center gap-3 rounded-xl p-3 transition-all duration-200 hover:bg-emerald-50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                    <i className="fas fa-user-edit"></i>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">Update Profile</p>
                    <p className="text-xs text-slate-500">Edit your teacher profile</p>
                  </div>
                  <i className="fas fa-chevron-right ml-auto text-slate-300 group-hover:text-emerald-500"></i>
                </a>
              </div>
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
                  <h4 className="font-semibold text-slate-800">System Status</h4>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
                    <span className="text-sm text-emerald-600">All systems operational</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-2xl font-bold text-slate-800">{teachers?.length || 0}</p>
                  <p className="text-xs text-slate-500">Active Users</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-2xl font-bold text-slate-800">{documents?.length || 0}</p>
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

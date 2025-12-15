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
import React from "react";

const DashboardPage = () => {
  const { user } = useAuth();

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
    },
    {
      title: "Documents Processed",
      value: documents == undefined ? "0" : documents.length.toString(),
      kpiIcon:
        "fas fa-file-alt text-accent-600 text-xl bg-accent-100 p-3 rounded-lg",
    },

    {
      title: "Compliance Rate",
      value: globalComplianceRate,
      kpiIcon:
        "fas fa-shield-alt text-success-600 text-xl bg-success-100 p-3 rounded-lg",
    },

    {
      title: "Pending Actions",
      value: globalPendingActions,
      kpiIcon:
        "fas fa-tasks text-error-600 text-xl bg-error-100 p-3 rounded-lg",
    },
  ];

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div className="from-primary-800 to-primary-600 rounded-xl bg-gradient-to-r p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-2xl font-bold">
                Welcome back, {user.username}!
              </h2>
              <p className="text-primary-100">
                Here's what's happening at your school today
              </p>
            </div>
            <div className="hidden md:block">
              <img
                src={resolveImageSource(NO_FACE_IMAGE)}
                alt="School Administration"
                className="border-primary-400 h-24 w-24 rounded-full border-4 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpi.map((value, index) => (
          <KPICard key={index} kvp={value} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-secondary-900 text-lg font-semibold">
                  Compliance Status
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
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
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-primary-600 hover:bg-primary-700 mt-4 w-full rounded-lg px-4 py-2 font-medium text-white transition-colors">
                    View Detailed Compliance Report
                  </button>
                </DialogTrigger>
                <DialogContent className="rounded-xl border border-slate-200 bg-white shadow-sm">
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
      </div>
    </main>
  );
};
export default DashboardPage;

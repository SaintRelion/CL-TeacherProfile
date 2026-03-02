import KpiCard from "@/components/document-repository/KpiCard";
import DocumentExplorer from "@/components/document-repository/DocumentExplorer";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { type TeacherDocument } from "@/models/TeacherDocument";
import React from "react";
import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";
import { RenderForm } from "@saintrelion/forms";

const DocumentRepositoryPage = () => {
  const user = useCurrentUser<User>();
  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");
  const liveDocuments = getDocuments({filters: {is_archived: "False"}}).data;

  const totalStorageGB = React.useMemo(() => {
    if (liveDocuments.length === 0) return 0;

    const totalMB = liveDocuments.reduce((sum, doc) => {
      const size = parseFloat(doc.file_size_in_mb) || 0; // convert string MB to number
      return sum + size;
    }, 0);

    const totalGB = totalMB / 1024; // MB → GB
    return totalGB.toFixed(5);
  }, [liveDocuments]);

  const kpi: Record<string, string>[] = [
    {
      title: "Total Documents",
      value: liveDocuments.length.toString(),
      iconClassName:
        "fas fa-file-alt text-primary-600 bg-primary-100 rounded-lg p-2",
    },
    {
      title: "Storage Used",
      value: `${totalStorageGB} GB`,
      iconClassName: "fas fa-hdd text-accent-600 bg-accent-100 rounded-lg p-2",
    },
    {
      title: "Recent Uploads",
      value: liveDocuments.length.toString(),
      iconClassName:
        "fas fa-upload text-success-600 bg-success-100 rounded-lg p-2",
    },
  ];

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") ?? "";

  return (
    <RenderForm wrapperClassName="flex-1 p-6">
      <div className="mb-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mt-4 flex items-center space-x-3 md:mt-0"></div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {kpi.map((value, index) => (
            <KpiCard key={index} kvp={value} />
          ))}
        </div>
      </div>

      <DocumentExplorer user={user} initialSearch={q} />
    </RenderForm>
  );
};
export default DocumentRepositoryPage;

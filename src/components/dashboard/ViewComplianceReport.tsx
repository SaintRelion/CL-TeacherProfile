import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/User";
import React from "react";

const ViewComplianceReport = ({
  documents,
  teachers,
}: {
  documents: TeacherDocument[];
  teachers: User[];
}) => {
  // Map teacherId => expired/expiring documents
  const complianceMapping = React.useMemo(() => {
    const map = new Map<
      string,
      { expired: TeacherDocument[]; expiring: TeacherDocument[] }
    >();

    teachers.forEach((teacher) => {
      map.set(teacher.id, { expired: [], expiring: [] });
    });

    documents.forEach((doc) => {
      const bucket = map.get(doc.userId);
      if (!bucket) return;

      const state = getExpiryState(doc.expiryDate);
      if (state === "expired") bucket.expired.push(doc);
      else if (state === "expiring") bucket.expiring.push(doc);
    });

    return map;
  }, [documents, teachers]);

  // Only show teachers with expired or expiring docs
  const teachersWithIssues = teachers.filter((t) => {
    const bucket = complianceMapping.get(t.id);
    return (
      bucket &&
      t.role != "admin" &&
      (bucket.expired.length > 0 || bucket.expiring.length > 0)
    );
  });

  if (teachersWithIssues.length === 0) {
    return <p className="text-sm text-slate-600">All documents are valid.</p>;
  }

  return (
    <div className="max-h-[500px] space-y-6 overflow-y-auto pr-2">
      {teachersWithIssues.map((teacher) => {
        const bucket = complianceMapping.get(teacher.id)!;

        return (
          <div key={teacher.id} className="">
            <div className="flex items-center justify-between border-b border-slate-200 p-4">
              <h3 className="text-secondary-900 text-lg font-semibold">
                {teacher.username}
              </h3>
              <span className="text-sm font-medium text-slate-700">
                {bucket.expired.length + bucket.expiring.length} pending
              </span>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto p-4">
              {bucket.expired.length > 0 && (
                <div>
                  <h4 className="text-error-600 mb-1 text-sm font-semibold">
                    Expired
                  </h4>
                  <ul className="list-inside list-disc text-sm text-slate-700">
                    {bucket.expired.map((doc) => (
                      <li key={doc.id}>
                        {doc.documentTitle} ({doc.documentType}) -{" "}
                        {doc.expiryDate}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bucket.expiring.length > 0 && (
                <div>
                  <h4 className="text-warning-600 mb-1 text-sm font-semibold">
                    Expiring Soon
                  </h4>
                  <ul className="list-inside list-disc text-sm text-slate-700">
                    {bucket.expiring.map((doc) => (
                      <li key={doc.id}>
                        {doc.documentTitle} ({doc.documentType}) -{" "}
                        {doc.expiryDate}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewComplianceReport;

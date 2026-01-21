import { getExpiryState } from "@/lib/utils";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/User";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ViewComplianceReport = ({
  documents,
  teachers,
}: {
  documents: TeacherDocument[];
  teachers: User[];
}) => {
  const [selectedDoc, setSelectedDoc] = useState<TeacherDocument | null>(null);
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

  const DocumentPreviewDialog = ({ doc }: { doc: TeacherDocument }) => (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex-1 text-left">
          <i className="fas fa-eye text-slate-400 transition-colors hover:text-slate-600"></i>
        </button>
      </DialogTrigger>
      <DialogContent className="flex h-[95vh] flex-col bg-white p-0">
        {/* Header */}
        <DialogHeader className="text-md truncate border-b border-slate-200 px-4 py-3 font-medium">
          <DialogTitle>{doc.documentTitle}</DialogTitle>
          <DialogDescription className="mt-1 text-xs text-slate-500">
            {doc.documentType} • {doc.extension.toUpperCase()} •{" "}
            {doc.fileSizeInMB} MB
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-auto">
          {doc.extension === "pdf" && (
            <iframe src={doc.fileBase64} className="h-full w-full" />
          )}

          {["png", "jpg", "jpeg", "webp"].includes(doc.extension) && (
            <div className="flex h-full items-center justify-center bg-slate-50">
              <img
                src={doc.fileBase64}
                className="max-h-full max-w-full"
                alt={doc.documentTitle}
              />
            </div>
          )}

          {!["pdf", "png", "jpg", "jpeg", "webp"].includes(doc.extension) && (
            <div className="text-muted-foreground flex items-center justify-center p-8">
              <div className="text-center">
                <i className="fas fa-file-alt mb-3 block text-4xl text-slate-300"></i>
                <p className="text-sm text-slate-600">
                  Preview not supported for {doc.extension.toUpperCase()} files
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Issued: {doc.issueDate}</span>
            <span>Expires: {doc.expiryDate}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      {teachersWithIssues.map((teacher) => {
        const bucket = complianceMapping.get(teacher.id)!;
        const totalIssues = bucket.expired.length + bucket.expiring.length;

        return (
          <div
            key={teacher.id}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            {/* Teacher Header */}
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-secondary-900 font-semibold">
                  {teacher.username}
                </h3>
              </div>
              <span className="bg-error-50 text-error-700 rounded-full px-3 py-1 text-xs font-medium">
                {totalIssues} issue{totalIssues !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Issues List */}
            <div className="space-y-3">
              {bucket.expired.length > 0 && (
                <div>
                  <h4 className="text-error-600 mb-2 flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                    <i className="fas fa-exclamation-circle"></i>
                    Expired ({bucket.expired.length})
                  </h4>
                  <ul className="space-y-1">
                    {bucket.expired.map((doc) => (
                      <li
                        key={doc.id}
                        className="bg-error-50 flex items-start gap-3 rounded p-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 flex-shrink-0">
                          <i className="fas fa-file-alt text-error-600"></i>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{doc.documentTitle}</p>
                          <p className="text-xs text-slate-600">
                            {doc.documentType} • Expired on {doc.expiryDate}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <DocumentPreviewDialog doc={doc} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {bucket.expiring.length > 0 && (
                <div>
                  <h4 className="text-warning-600 mb-2 flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                    <i className="fas fa-clock"></i>
                    Expiring Soon ({bucket.expiring.length})
                  </h4>
                  <ul className="space-y-1">
                    {bucket.expiring.map((doc) => (
                      <li
                        key={doc.id}
                        className="bg-warning-50 flex items-start gap-3 rounded p-2 text-sm text-slate-700"
                      >
                        <span className="mt-1 flex-shrink-0">
                          <i className="fas fa-file-alt text-warning-600"></i>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{doc.documentTitle}</p>
                          <p className="text-xs text-slate-600">
                            {doc.documentType} • Expires {doc.expiryDate}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <DocumentPreviewDialog doc={doc} />
                        </div>
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

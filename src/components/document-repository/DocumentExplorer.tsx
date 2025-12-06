import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import { DOCUMENT_TYPES } from "@/constants";
import type { TeacherDocument } from "@/models/teacher-document";
import { useAuth } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { toDate } from "@saintrelion/time-functions";
import React from "react";
import { useState } from "react";

const DocumentExplorer = () => {
  const { user } = useAuth();

  const [selectedFolder, setSelectedFolder] = useState("");

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    sort: "",
    quickTag: "",
  });

  const { useSelect: documentSelect } =
    useDBOperationsLocked<TeacherDocument>("TeacherDocument");
  const { data: documents } = documentSelect(
    user.role != "admin"
      ? {
          firebaseOptions: {
            filterField: "userId",
            value: user.id,
          },
        }
      : {},
  );

  const folders = React.useMemo(() => {
    const map = new Map<string, number>();

    DOCUMENT_TYPES.forEach((type) => map.set(type, 0));

    if (documents && documents.length > 0) {
      documents.forEach((doc) => {
        const type = doc.documentType || "Uncategorized";

        // Ensure type exists in map (just in case)
        if (!map.has(type)) {
          map.set(type, 0);
        }

        map.set(type, (map.get(type) ?? 0) + 1);
      });
    }

    return Array.from(map.entries()).map(([title, count]) => ({
      title,
      value: String(count),
    }));
  }, [documents]);

  const filteredDocuments =
    documents != undefined
      ? documents.filter((document) => {
          const searchTerm = search.toLowerCase();

          // Search by fileName, fileType
          if (
            searchTerm &&
            !(
              document.documentTitle.toLowerCase().includes(searchTerm) ||
              document.documentType.toLowerCase().includes(searchTerm)
            )
          ) {
            return false;
          }

          // Folder filter
          if (selectedFolder != "") {
            if (
              !selectedFolder
                .toLowerCase()
                .includes(document.documentType.toLowerCase())
            )
              return false;
          }

          // Quick tag filters
          if (filters.quickTag) {
            switch (filters.quickTag) {
              case "none":
                // e.g., last 3 files
                if (
                  new Date(document.createdAt) <
                  new Date(
                    Math.max(
                      ...documents.map((f) => new Date(f.createdAt).getTime()),
                    ),
                  )
                )
                  return true;
                break;
              case "recent":
                // e.g., last 3 files
                if (
                  new Date(document.createdAt) <
                  new Date(
                    Math.max(
                      ...documents.map((f) => new Date(f.createdAt).getTime()),
                    ),
                  )
                )
                  return false;
                break;
              //   case "expiring":
              //     if (!document.status.toLowerCase().includes("expires")) return false;
              //     break;
              case "large":
                if (parseFloat(document.fileSizeInMB) < 2) return false;
                break;
            }
          }

          return true;
        })
      : [];

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (filters.sort) {
      case "created": {
        const aDate = toDate(a.createdAt);
        const bDate = toDate(b.createdAt);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "modified": {
        const aDate = toDate(a.updatedAt);
        const bDate = toDate(b.updatedAt);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "name":
        return a.documentTitle.localeCompare(b.documentTitle);
      case "size":
        return parseFloat(a.fileSizeInMB) - parseFloat(b.fileSizeInMB);
      default:
        return 0;
    }
  });

  return (
    <>
      <Filters
        filters={filters}
        onSearchChange={(value) => setSearch(value)}
        onFilterChange={(filterType, value) => {
          if (filterType === "reset") {
            setFilters({
              category: "",
              sort: "",
              quickTag: "",
            });
            return;
          }

          setFilters((prev) => ({ ...prev, [filterType]: value }));
        }}
      />

      <div className="text-secondary-600 mb-6 flex items-center space-x-2 text-sm">
        <i className="fas fa-home"></i>
        <span
          className="cursor-pointer hover:opacity-60"
          onClick={() => setSelectedFolder("")}
        >
          Repository
        </span>
        {selectedFolder != "" && (
          <>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>{selectedFolder}</span>
          </>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h3 className="text-secondary-900 mb-4 text-lg font-semibold">
            Folders
          </h3>
          <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
            {folders.map((value, index) => (
              <FolderCard
                key={index}
                kvp={value}
                selectedFolder={selectedFolder}
                onFolderClicked={(value) => setSelectedFolder(value)}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-secondary-900 text-lg font-semibold">
              {selectedFolder == "" ? "Recent Documents" : selectedFolder}
            </h3>
            {/* <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button> */}
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDocuments.map((doc, index) => (
              <FileCard key={index} doc={doc} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DocumentExplorer;

import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { toDate } from "@saintrelion/time-functions";
import React, { useEffect } from "react";
import { useState } from "react";
import type { DocumentFolder } from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type { User } from "@/models/user";
import formatFolderName from "@/hooks/useFolderNameFormat";

const DocumentExplorer = ({
  user,
  initialSearch,
  initialFolder,
}: {
  user: User;
  initialSearch?: string;
  initialFolder?: string;
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");

  const [search, setSearch] = useState(initialSearch ?? "");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    sort: "",
    quickTag: "",
    department: "",
  });

  // Set selected folder when initialFolder prop changes
  useEffect(() => {
    if (initialFolder) {
      setSelectedFolderId(initialFolder);
    }
  }, [initialFolder]);

  const { useList: getFolders } =
    useResourceLocked<DocumentFolder>("documentfolder");

  const { useList: getDocuments, useUpdate: updateDocument } =
    useResourceLocked<TeacherDocument, never, UpdateTeacherDocument>(
      "teacherdocument",
    );

  const { useList: getPersonalInfo } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );

  const role = user.roles ? user.roles[0] : "";

  const personalInfos = getPersonalInfo().data;
  const documentFolders = getFolders().data;

  const documents = getDocuments({
    filters: {
      is_archived: "True",
    },
  }).data;

  const foldersWithDocs = React.useMemo(() => {
    if (documentFolders == undefined) return [];

    const map = new Map<
      string,
      { folder: string; folder_name: string; count: number }
    >();

    documentFolders.forEach((folder) => {
      map.set(folder.id, {
        folder: folder.id,
        folder_name: formatFolderName(folder.name),
        count: 0,
      });
    });

    documents?.forEach((doc) => {
      if (!doc.folder) return;

      const entry = map.get(doc.folder);
      if (entry) {
        entry.count += 1;
      }
    });

    return Array.from(map.values()).map((f) => ({
      folder_name: f.folder_name,
      files_count: String(f.count),
      folder: f.folder,
    }));
  }, [documentFolders, documents]);

  const folderName =
    foldersWithDocs.find((f) => f.folder == selectedFolderId)?.folder_name ??
    "";

  const filteredDocuments = documents.filter((document) => {
    const searchTerm = search.toLowerCase();

    // Search by fileName, fileType
    if (
      searchTerm &&
      !document.document_title.toLowerCase().includes(searchTerm)
    ) {
      return false;
    }

    // Folder filter
    if (selectedFolderId != "" && document.folder != selectedFolderId) {
      return false;
    }

    // Quick tag filters
    if (filters.quickTag) {
      switch (filters.quickTag) {
        case "none":
          // e.g., last 3 files
          if (
            new Date(document.created_at) <
            new Date(
              Math.max(
                ...documents.map((f) => new Date(f.created_at).getTime()),
              ),
            )
          )
            return true;
          break;
        case "recent":
          // e.g., last 3 files
          if (
            new Date(document.created_at) <
            new Date(
              Math.max(
                ...documents.map((f) => new Date(f.created_at).getTime()),
              ),
            )
          )
            return false;
          break;
        //   case "expiring":
        //     if (!document.status.toLowerCase().includes("expires")) return false;
        //     break;
        case "large":
          if (parseFloat(document.file_size_in_mb) < 2) return false;
          break;
      }
    }

    // Department filter: compare document owner department
    if (filters.department) {
      const ownerInfo = personalInfos?.find((p) => p.user === document.user);
      const dept = (ownerInfo?.department ?? "").toLowerCase();
      const filterDept = filters.department.toLowerCase().replaceAll("-", " ");

      if (!dept.includes(filterDept)) return false;
    }

    return true;
  });

  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (filters.sort) {
      case "created": {
        const aDate = toDate(a.created_at);
        const bDate = toDate(b.created_at);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "modified": {
        const aDate = toDate(a.updated_at);
        const bDate = toDate(b.updated_at);

        if (aDate != null && bDate != null)
          return aDate.getTime() - bDate.getTime();
        else return -1;
      }
      case "name":
        return a.document_title.localeCompare(b.document_title);
      case "size":
        return parseFloat(a.file_size_in_mb) - parseFloat(b.file_size_in_mb);
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

      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
        <i className="fas fa-home text-blue-600"></i>
        <span
          className="cursor-pointer hover:opacity-60"
          onClick={() => {
            setSelectedFolderId("");
          }}
        >
          Repository
        </span>
        {selectedFolderId != "" && (
          <>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>{folderName}</span>
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-md">
        <div className="border-b border-gray-100 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Folders</h3>
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
            {foldersWithDocs.map((value) => {
              return (
                <FolderCard
                  key={value.folder}
                  userRole={role}
                  folderInfo={value}
                  selectedFolderId={selectedFolderId}
                  onFolderClicked={(value) => setSelectedFolderId(value)}
                />
              );
            })}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedFolderId == "" ? "Recent Documents" : folderName}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDocuments.map((doc, index) => (
              <FileCard
                key={index}
                doc={doc}
                onRestore={() => {
                  if (!updateDocument.isLocked)
                    updateDocument.run({
                      id: doc.id,
                      payload: { is_archived: false },
                    });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default DocumentExplorer;

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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FolderPlus } from "lucide-react";
import { RenderFormButton, RenderFormField } from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import type {
  CreateDocumentFolder,
  DocumentFolder,
  UpdateDocumentFolder,
} from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type { User } from "@/models/user";
import formatFolderName from "@/hooks/useFolderNameFormat";
import { NO_FACE_IMAGE } from "@/constants";

const DocumentExplorer = ({
  user,
  initialSearch,
  initialFolder,
}: {
  user: User;
  initialSearch?: string;
  initialFolder?: string;
}) => {
  const [showArchive, setShowArchive] = useState(false);

  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [folderIdToRename, setFolderIdToRename] = useState<string>("");

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

  const {
    useList: getFolders,
    useInsert: insertFolder,
    useDelete: deleteFolder,
    useUpdate: updateFolder,
  } = useResourceLocked<
    DocumentFolder,
    CreateDocumentFolder,
    UpdateDocumentFolder
  >("documentfolder");

  const { useList: getDocuments, useUpdate: updateDocument } =
    useResourceLocked<TeacherDocument, never, UpdateTeacherDocument>(
      "teacherdocument",
    );

  const { useList: getPersonalInfo } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );

  const { useList: getUsers } = useResourceLocked<User>("user");

  const role = user.roles ? user.roles[0] : "";
  const allUsers = getUsers().data;

  const personalInfos = getPersonalInfo().data;
  const documentFolders = getFolders().data;

  const documents = getDocuments({
    filters:
      role === "admin"
        ? showArchive
          ? {}
          : {
              is_archived: "False",
            }
        : {
            user: user.id,
            is_archived: "False",
          },
  }).data;

  // Get teachers who haven't submitted for selected folder
  const nonSubmittingTeachers = React.useMemo(() => {
    if (!selectedFolderId || !personalInfos || !documents) return [];

    // Get IDs of teachers who have submitted to this folder
    const submittedUserIds = new Set(
      documents
        .filter((doc) => doc.folder === selectedFolderId)
        .map((doc) => doc.user)
    );

    // Get all teachers (those in personalInfos)
    const allTeachers = personalInfos.map((info) => ({
      userId: info.user,
      name: `${info.first_name} ${info.middle_name} ${info.last_name}`.trim(),
      photo: info.photo_base64 || NO_FACE_IMAGE,
      department: info.department,
    }));

    // Return teachers who have NOT submitted to this folder
    return allTeachers.filter((teacher) => !submittedUserIds.has(teacher.userId));
  }, [selectedFolderId, personalInfos, documents]);

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

  async function handleNewFolder(data: Record<string, string>) {
    const formattedName = formatFolderName(data.folder_name);

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) => formatFolderName(value.name).toLowerCase().trim() == formattedName.toLowerCase().trim(),
        ).length > 0;

      if (alreadyExist) {
        toast.error(`${formattedName} already exist`);
        return;
      }
    }

    await insertFolder.run({
      name: formattedName,
      user: user.id,
    });
  }

  const handleFolderRename = async (data: Record<string, string>) => {
    if (!data.folder_rename.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    const newName = formatFolderName(data.folder_rename);

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) => formatFolderName(value.name).toLowerCase().trim() === newName.toLowerCase().trim(),
        ).length > 0;

      if (alreadyExist) {
        toast.error(`${newName} already exists`);
        return;
      }
    }

    try {
      await updateFolder.run({
        id: selectedFolderId,
        payload: {
          name: newName,
        },
      });

      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Failed to rename folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folder: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this folder? Documents in this folder will not be deleted.",
      )
    ) {
      await deleteFolder.run(folder);
      toast.success("Folder deleted successfully");
    }
  };

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
        showArchive={showArchive}
        onShowArchive={setShowArchive}
      />

      <div className="text-gray-600 mb-6 flex items-center space-x-2 text-sm">
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
            <h3 className="text-gray-900 text-lg font-semibold">
              Folders
            </h3>

            {role == "admin" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                  >
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-gray-900">Create Folder</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Folder name
                    </label>
                    <RenderFormField
                      field={{
                        name: "folder_name",
                        type: "text",
                        placeholder: "e.g. Project Files",
                      }}
                    />
                  </div>

                  <DialogFooter>
                    <RenderFormButton
                      buttonLabel="Create"
                      onSubmit={handleNewFolder}
                      isDisabled={insertFolder.isLocked}
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
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
                  onRenameFolder={(folderId) => {
                    setFolderIdToRename(folderId);
                  }}
                  onDeleteFolder={handleDeleteFolder}
                />
              );
            })}
          </div>

          {/* Rename Folder Dialog */}
          <Dialog
            open={folderIdToRename != ""}
            onOpenChange={(state) => {
              if (!state) setFolderIdToRename("");
            }}
          >
            <DialogContent className="bg-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-gray-900">Rename Folder</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  New folder name
                </label>
                <RenderFormField
                  field={{
                    name: "folder_rename",
                    type: "text",
                    placeholder: "Enter new folder name",
                  }}
                  inputClassName="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <DialogFooter>
                <RenderFormButton
                  buttonLabel="Rename"
                  onSubmit={handleFolderRename}
                  isDisabled={updateFolder.isLocked}
                  buttonClassName="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-gray-900 text-lg font-semibold">
              {selectedFolderId == "" ? "Recent Documents" : folderName}
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedDocuments.map((doc, index) => (
              <FileCard
                key={index}
                doc={doc}
                onArchive={() => {
                  if (!updateDocument.isLocked)
                    updateDocument.run({
                      id: doc.id,
                      payload: { is_archived: true },
                    });
                }}
              />
            ))}
          </div>

          {/* Non-Submitting Teachers Section */}
          {selectedFolderId !== "" && nonSubmittingTeachers.length > 0 && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  Teachers Not Yet Submitted
                </h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-yellow-100 text-xs font-bold text-yellow-700">
                  {nonSubmittingTeachers.length}
                </span>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                The following teachers have not submitted documents to this folder
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nonSubmittingTeachers.map((teacher) => (
                  <div
                    key={teacher.userId}
                    className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 transition-all hover:shadow-md"
                  >
                    <div className="shrink-0 overflow-hidden rounded-full border-2 border-yellow-200">
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900">
                        {teacher.name}
                      </p>
                      <p className="truncate text-xs text-gray-600">
                        {teacher.department || "No Department"}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200">
                        <i className="fas fa-exclamation-circle text-xs text-yellow-700"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default DocumentExplorer;

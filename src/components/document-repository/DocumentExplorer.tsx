import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { toDate } from "@saintrelion/time-functions";
import React from "react";
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

const DocumentExplorer = ({ user, initialSearch }: { user: User; initialSearch?: string }) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string>("");
  const [folderIdToRename, setFolderIdToRename] = useState<string>("");

  const [search, setSearch] = useState(initialSearch ?? "");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    sort: "",
    quickTag: "",
    department: "",
  });

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

  const { useList: getPersonalInfo } =
    useResourceLocked<PersonalInformation>("personalinformation");

  const role = user.roles ? user.roles[0] : "";

  const personalInfos = getPersonalInfo().data;
  const documentFolders = getFolders().data;

  const documents = getDocuments({
    filters:
      role === "admin"
        ? {
            is_archived: "False",
          }
        : {
            user: user.id,
            is_archived: "False",
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
        folder_name: folder.name,
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
      !(
        document.document_title.toLowerCase().includes(searchTerm) 
      )
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
    const folderName = data.folder_name.toLowerCase().trim();

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) => value.name.toLowerCase().trim() == folderName,
        ).length > 0;

      if (alreadyExist) {
        toast.error(`${folderName} already exist`);
        return;
      }
    }

    await insertFolder.run({
      name: folderName,
      user: user.id,
    });
  }

  const handleFolderRename = async (data: Record<string, string>) => {
    if (!data.folder_rename.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    const newName = data.folder_rename.toLowerCase().trim();

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) => value.name.toLowerCase().trim() === newName,
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
          name: data.folder_rename,
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
      />

      <div className="text-secondary-600 mb-6 flex items-center space-x-2 text-sm">
        <i className="fas fa-home"></i>
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

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-secondary-900 text-lg font-semibold">
              Folders
            </h3>

            {role == "admin" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>

                <DialogContent className="bg-white sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Folder</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
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
                <DialogTitle>Rename Folder</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
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
            <h3 className="text-secondary-900 text-lg font-semibold">
              {selectedFolderId == "" ? "Recent Documents" : folderName}
            </h3>
            {/* <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View all
            </button> */}
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
        </div>
      </div>
    </>
  );
};
export default DocumentExplorer;

import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import type { DocumentTypes } from "@/models/DocumentTypes";
import type { TeacherDocument } from "@/models/TeacherDocument";
import type { User } from "@/models/user";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { toDate } from "@saintrelion/time-functions";
import React from "react";
import { useState, useRef, useEffect } from "react";
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
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";

const DocumentExplorer = ({ user }: { user: User }) => {
  const [selectedFolder, setSelectedFolder] = useState("");
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState("");
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({
    category: "",
    sort: "",
    quickTag: "",
  });

  // Auto-focus input when rename dialog opens
  useEffect(() => {
    if (renamingFolderId && renameInputRef.current) {
      setTimeout(() => {
        renameInputRef.current?.focus();
        renameInputRef.current?.select();
      }, 0);
    }
  }, [renamingFolderId]);

  const { useSelect: documentFolderSelect, useInsert: documentFolderInsert, useUpdate: documentFolderUpdate, useDelete: documentFolderDelete } =
    useDBOperationsLocked<DocumentTypes>("DocumentTypes");

  const { useSelect: documentSelect, useArchive: documentArchive } =
    useDBOperationsLocked<TeacherDocument>("TeacherDocument");
  const { data: documents } = documentSelect(
    user.role != "admin"
      ? {
          firebaseOptions: {
            filterField: ["userId", "archived"],
            value: [user.id, "false"],
          },
        }
      : {
          firebaseOptions: {
            filterField: ["archived"],
            value: ["false"],
          },
        },
  );

  const { data: documentFolders } = documentFolderSelect();
  const structuredFolders = React.useMemo(() => {
    if (documentFolders == undefined) return [];

    const map = new Map<string, number>();

    documentFolders.forEach((v) => map.set(v.documentType, 0));

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
  }, [documentFolders, documents]);

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

  async function handleNewFolder(data: Record<string, string>) {
    const documentType = data.documentType.toLowerCase().trim();

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) => value.documentType.toLowerCase().trim() == documentType,
        ).length > 0;

      if (alreadyExist) {
        toast.error(`${documentType} already exist`);
        return;
      }
    }

    await documentFolderInsert.run(data);
  }

  const handleRenameFolder = (folderId: string, currentName: string) => {
    setRenamingFolderId(folderId);
    setRenamingFolderName(currentName);
  };

  const handleConfirmRename = async () => {
    if (!renamingFolderId || !renamingFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    const newName = renamingFolderName.toLowerCase().trim();

    if (documentFolders) {
      const alreadyExist =
        documentFolders.filter(
          (value) =>
            value.documentType.toLowerCase().trim() === newName &&
            value.id !== renamingFolderId,
        ).length > 0;

      if (alreadyExist) {
        toast.error(`${newName} already exists`);
        return;
      }
    }

    try {
      console.log("Updating folder with ID:", renamingFolderId, "New name:", newName);
      
      await documentFolderUpdate.run({
        field: "id",
        value: renamingFolderId,
        updates: {
          documentType: newName,
        },
      } as any);

      setRenamingFolderId(null);
      setRenamingFolderName("");
      toast.success("Folder renamed successfully");
    } catch (error) {
      console.error("Failed to rename folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this folder? Documents in this folder will not be deleted.",
      )
    ) {
      await documentFolderDelete.run(folderId);
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-secondary-900 text-lg font-semibold">
              Folders
            </h3>

            <RenderForm>
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
                        name: "documentType",
                        type: "text",
                        placeholder: "e.g. Project Files",
                      }}
                    />
                  </div>

                  <DialogFooter>
                    <RenderFormButton
                      buttonLabel="Create"
                      onSubmit={handleNewFolder}
                      isDisabled={documentFolderInsert.isLocked}
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </RenderForm>
          </div>

          <div className="grid grid-cols-3 gap-4 md:grid-cols-5">
            {structuredFolders.map((value, index) => {
              // Find the original folder data to get the ID
              const folderData = documentFolders?.find(
                (f) => f.documentType.toLowerCase() === value.title.toLowerCase(),
              );

              return (
                <FolderCard
                  key={index}
                  kvp={{ ...value, id: folderData?.id, isCustom: true }}
                  selectedFolder={selectedFolder}
                  onFolderClicked={(value) => setSelectedFolder(value)}
                  onDeleteFolder={handleDeleteFolder}
                  onRenameFolder={handleRenameFolder}
                />
              );
            })}
          </div>

          {/* Rename Folder Dialog */}
          <Dialog open={!!renamingFolderId} onOpenChange={(open) => {
            if (!open) {
              setRenamingFolderId(null);
              setRenamingFolderName("");
            }
          }}>
            <DialogContent className="bg-white sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Rename Folder</DialogTitle>
              </DialogHeader>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  New folder name
                </label>
                <input
                  ref={renameInputRef}
                  type="text"
                  value={renamingFolderName}
                  onChange={(e) => setRenamingFolderName(e.target.value)}
                  placeholder="Enter new folder name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !documentFolderUpdate.isLocked) {
                      e.preventDefault();
                      handleConfirmRename();
                    }
                    if (e.key === "Escape") {
                      setRenamingFolderId(null);
                      setRenamingFolderName("");
                    }
                  }}
                />
              </div>

              <DialogFooter>
                <button
                  onClick={() => {
                    setRenamingFolderId(null);
                    setRenamingFolderName("");
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRename}
                  disabled={documentFolderUpdate.isLocked || !renamingFolderName.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Rename
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <FileCard
                key={index}
                doc={doc}
                onArchive={() => {
                  if (documentArchive && !documentArchive.isLocked)
                    documentArchive.run(doc.id);
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

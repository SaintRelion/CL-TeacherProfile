import KpiCard from "@/components/document-repository/KpiCard";
import DocumentExplorer from "@/components/document-repository/DocumentExplorer";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { type TeacherDocument } from "@/models/TeacherDocument";
import React, { useState } from "react";
import { useAuth } from "@saintrelion/auth-lib";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentFolder {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

const DocumentRepositoryPage = () => {
  const { user } = useAuth();
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Rename folder state
  const [showRenameFolderDialog, setShowRenameFolderDialog] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState("");
  const [renameFolderName, setRenameFolderName] = useState("");
  const [isRenamingFolder, setIsRenamingFolder] = useState(false);

  // Custom folders from database
  const {
    useSelect: selectFolders,
    useInsert: insertFolder,
    useDelete: deleteFolder,
    useUpdate: updateFolder,
  } = useDBOperationsLocked<DocumentFolder>("DocumentFolder");

  const { data: customFolders } = selectFolders({
    firebaseOptions:
      user.role === "admin" ? {} : { filterField: "userId", value: user.id },
  });

  const { useSelect: selectDocuments } =
    useDBOperationsLocked<TeacherDocument>("TeacherDocument");
  const { data: documents } = selectDocuments();

  const totalStorageGB = React.useMemo(() => {
    if (!documents || documents.length === 0) return 0;

    const totalMB = documents.reduce((sum, doc) => {
      const size = parseFloat(doc.fileSizeInMB) || 0; // convert string MB to number
      return sum + size;
    }, 0);

    const totalGB = totalMB / 1024; // MB → GB
    return totalGB.toFixed(5);
  }, [documents]);

  const kpi: Record<string, string>[] = [
    {
      title: "Total Documents",
      value: documents == undefined ? "0" : documents.length.toString(),
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
      value: documents == undefined ? "0" : documents.length.toString(),
      iconClassName:
        "fas fa-upload text-success-600 bg-success-100 rounded-lg p-2",
    },
  ];

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await insertFolder.run({
        name: newFolderName.trim(),
        userId: user.id,
      });
      setNewFolderName("");
    } catch (error) {
      console.error("Failed to create folder:", error);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Delete folder
  const handleDeleteFolder = async (folderId: string) => {
    try {
      await deleteFolder.run(folderId);
    } catch (error) {
      console.error("Failed to delete folder:", error);
    }
  };

  // Open rename dialog
  const handleOpenRenameDialog = (folderId: string, currentName: string) => {
    setRenameFolderId(folderId);
    setRenameFolderName(currentName);
    setShowRenameFolderDialog(true);
  };

  // Rename folder
  const handleRenameFolder = async () => {
    if (!renameFolderName.trim() || !renameFolderId) return;

    setIsRenamingFolder(true);
    try {
      await updateFolder.run({
        field: "id",
        value: renameFolderId,
        updates: {
          name: renameFolderName.trim(),
        },
      });
      setRenameFolderName("");
      setRenameFolderId("");
      setShowRenameFolderDialog(false);
    } catch (error) {
      console.error("Failed to rename folder:", error);
    } finally {
      setIsRenamingFolder(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="mb-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        
          <div className="mt-4 flex items-center space-x-3 md:mt-0">
           
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {kpi.map((value, index) => (
            <KpiCard key={index} kvp={value} />
          ))}
        </div>
      </div>

      <DocumentExplorer
        user={{ id: user.id, role: user.role, username: user.username }}
        customFolders={customFolders || []}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleOpenRenameDialog}
      />

      {/* Rename Folder Dialog */}
      <Dialog open={showRenameFolderDialog} onOpenChange={setShowRenameFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <i className="fas fa-edit text-white"></i>
              </div>
              Rename Folder
            </DialogTitle>
            <DialogDescription>
              Enter a new name for this folder.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Folder Name
              </label>
              <input
                type="text"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRenameFolder();
                }}
                placeholder="Enter folder name..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowRenameFolderDialog(false);
                  setRenameFolderName("");
                  setRenameFolderId("");
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameFolder}
                disabled={!renameFolderName.trim() || isRenamingFolder}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isRenamingFolder ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Renaming...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i>
                    Rename
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-blue-600">
                <i className="fas fa-folder-plus text-white"></i>
              </div>
              Create New Folder
            </DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Folder Name
              </label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateFolder();
                }}
                placeholder="Enter folder name..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowNewFolderDialog(false);
                  setNewFolderName("");
                }}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim() || isCreatingFolder}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreatingFolder ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-plus"></i>
                    Create
                  </>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};
export default DocumentRepositoryPage;

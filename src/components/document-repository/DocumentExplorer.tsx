import FileCard from "@/components/document-repository/FileCard";
import Filters from "@/components/document-repository/Filters";
import FolderCard from "@/components/document-repository/FolderCard";
import {
  buildDepartmentOptions,
  defaultDocumentRepositoryFilters,
  filterAndSortDocuments,
  getSearchSuggestions,
  type DocumentRepositoryFilters,
} from "@/components/document-repository/search-utils";
import { NO_FACE_IMAGE } from "@/constants";
import formatFolderName from "@/hooks/useFolderNameFormat";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { RenderFormButton, RenderFormField } from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { formatReadableDate } from "@saintrelion/time-functions";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronRight,
  FileSearch,
  FolderPlus,
  Home,
  Layers3,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import type {
  CreateDocumentFolder,
  DocumentFolder,
  UpdateDocumentFolder,
} from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import type { User } from "@/models/user";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const PAGE_SIZE = 8;

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
  const [folderIdToRename, setFolderIdToRename] = useState<string>("");
  const [search, setSearch] = useState(initialSearch ?? "");
  const [filters, setFilters] = useState<DocumentRepositoryFilters>(
    defaultDocumentRepositoryFilters,
  );
  const [currentPage, setCurrentPage] = useState(1);

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

  const role = user.roles ? user.roles[0] : "";
  const personalInfos = getPersonalInfo().data;
  const documentFolders = getFolders().data;
  const documents = getDocuments({
    filters:
      role === "admin"
        ? { is_archived: "False" }
        : {
            user: user.id,
            is_archived: "False",
          },
  }).data;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, selectedFolderId]);

  const nonSubmittingTeachers = useMemo(() => {
    if (!selectedFolderId || !documents || !personalInfos) return [];

    const submittedUserIds = new Set(
      documents
        .filter((doc) => doc.folder_id === selectedFolderId)
        .map((doc) => doc.user_id),
    );

    return personalInfos
      .map((info) => ({
        userId: info.user,
        name: `${info.first_name} ${info.middle_name} ${info.last_name}`.trim(),
        photo: info.photo_base64 || NO_FACE_IMAGE,
        department: info.department,
      }))
      .filter((teacher) => !submittedUserIds.has(teacher.userId));
  }, [selectedFolderId, personalInfos, documents]);

  const foldersWithDocs = useMemo(() => {
    const map = new Map<
      string,
      { folder: string; folder_name: string; count: number }
    >();

    if (!documentFolders || !documents) return [];

    documentFolders.forEach((folder) => {
      map.set(folder.id, {
        folder: folder.id,
        folder_name: formatFolderName(folder.name),
        count: 0,
      });
    });

    documents.forEach((doc) => {
      if (!doc.folder_id) return;
      const entry = map.get(doc.folder_id);
      if (entry) entry.count += 1;
    });

    return Array.from(map.values()).map((folder) => ({
      folder_name: folder.folder_name,
      files_count: String(folder.count),
      folder: folder.folder,
    }));
  }, [documentFolders, documents]);

  const folderName =
    foldersWithDocs.find((folder) => folder.folder === selectedFolderId)
      ?.folder_name ?? "";

  const searchResults = useMemo(
    () =>
      documents
        ? filterAndSortDocuments({
            documents,
            search,
            filters,
            selectedFolderId,
            personalInfos,
            documentFolders,
          })
        : [],
    [
      documents,
      search,
      filters,
      selectedFolderId,
      personalInfos,
      documentFolders,
    ],
  );

  const totalPages = Math.max(1, Math.ceil(searchResults.length / PAGE_SIZE));
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const paginationStart =
    searchResults.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const paginationEnd = Math.min(currentPage * PAGE_SIZE, searchResults.length);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  ).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1));
  const departmentOptions = useMemo(
    () => buildDepartmentOptions(personalInfos),
    [personalInfos],
  );
  const searchSuggestions = useMemo(
    () =>
      documents
        ? getSearchSuggestions({
            documents,
            personalInfos,
            folders: documentFolders,
          })
        : [],
    [documents, personalInfos, documentFolders],
  );

  async function handleNewFolder(data: Record<string, string>) {
    const formattedName = formatFolderName(data.folder_name);
    const alreadyExists = documentFolders
      ? documentFolders.some(
          (folder) =>
            formatFolderName(folder.name).toLowerCase().trim() ===
            formattedName.toLowerCase().trim(),
        )
      : [];

    if (alreadyExists) {
      toast.error(`${formattedName} already exist`);
      return;
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
    const alreadyExists = documentFolders
      ? documentFolders.some(
          (folder) =>
            formatFolderName(folder.name).toLowerCase().trim() ===
            newName.toLowerCase().trim(),
        )
      : [];

    if (alreadyExists) {
      toast.error(`${newName} already exists`);
      return;
    }

    try {
      await updateFolder.run({
        id: folderIdToRename || selectedFolderId,
        payload: { name: newName },
      });
      setFolderIdToRename("");
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
      if (selectedFolderId === folder) {
        setSelectedFolderId("");
      }
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "reset") {
      setFilters(defaultDocumentRepositoryFilters);
      return;
    }

    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  return (
    <>
      <Filters
        filters={filters}
        searchValue={search}
        onSearchChange={setSearch}
        onFilterChange={handleFilterChange}
        suggestionItems={searchSuggestions}
        departmentOptions={departmentOptions}
      />

      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Home className="h-4 w-4 text-blue-600" />
        <span
          className="cursor-pointer font-medium transition-opacity hover:opacity-60"
          onClick={() => setSelectedFolderId("")}
        >
          Repository
        </span>
        {selectedFolderId !== "" && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{folderName}</span>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200/50 bg-white/60 shadow-sm backdrop-blur-sm">
        <div className="border-b border-slate-200/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Folders</h3>
              <p className="mt-1 text-sm text-slate-500">
                Filter results by repository structure and ownership scope.
              </p>
            </div>

            {role === "admin" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 rounded-2xl border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50"
                  >
                    <FolderPlus className="h-4 w-4" />
                    New Folder
                  </Button>
                </DialogTrigger>

                <DialogContent className="rounded-2xl border border-slate-200/70 bg-white shadow-2xl sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-slate-900">
                      Create Folder
                    </DialogTitle>
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

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5"
          >
            {foldersWithDocs.map((value) => (
              <motion.div
                key={value.folder}
                variants={{
                  hidden: { opacity: 0, y: 18, scale: 0.96 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <FolderCard
                  userRole={role}
                  folderInfo={value}
                  selectedFolderId={selectedFolderId}
                  onFolderClicked={(folderValue) =>
                    setSelectedFolderId((current) =>
                      current === folderValue ? "" : folderValue,
                    )
                  }
                  onRenameFolder={(folderId) => setFolderIdToRename(folderId)}
                  onDeleteFolder={handleDeleteFolder}
                />
              </motion.div>
            ))}
          </motion.div>

          <Dialog
            open={folderIdToRename !== ""}
            onOpenChange={(state) => {
              if (!state) setFolderIdToRename("");
            }}
          >
            <DialogContent className="rounded-2xl border border-slate-200/70 bg-white shadow-2xl sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-slate-900">
                  Rename Folder
                </DialogTitle>
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
                  inputClassName="w-full rounded-2xl border border-slate-200 px-3 py-3 focus:border-transparent focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <DialogFooter>
                <RenderFormButton
                  buttonLabel="Rename"
                  onSubmit={handleFolderRename}
                  isDisabled={updateFolder.isLocked}
                  buttonClassName="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedFolderId === "" ? "Document Results" : folderName}
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                {searchResults.length} matching item
                {searchResults.length === 1 ? "" : "s"} | Updated{" "}
                {formatReadableDate(new Date().toISOString())}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <FileSearch className="h-4 w-4 text-blue-600" />
                Dynamic search and metadata filtering
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <Layers3 className="h-4 w-4 text-blue-600" />
                Access scoped to{" "}
                {role === "admin" ? "admin visibility" : "your documents"}
              </div>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center">
              <h4 className="text-lg font-semibold text-slate-900">
                No documents found
              </h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Try broadening your search terms, adjusting metadata filters, or
                clearing the current filter set.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilters(defaultDocumentRepositoryFilters);
                  setSelectedFolderId("");
                }}
                className="mt-5 inline-flex h-11 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{
                    hidden: {},
                    show: {
                      transition: {
                        staggerChildren: 0.05,
                      },
                    },
                  }}
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                >
                  {paginatedResults.map((result) => {
                    const owner = personalInfos?.find(
                      (p) => p.user === result.doc.user_id,
                    );
                    const ownerName = owner
                      ? `${owner.first_name} ${owner.last_name}`
                      : "none";

                    return (
                      <motion.div
                        key={result.doc.id}
                        layout
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <FileCard
                          doc={result.doc}
                          ownerName={ownerName}
                          highlightTerms={result.searchTerms}
                          matchContext={result.matchContext}
                          onArchive={() => {
                            if (!updateDocument.isLocked) {
                              updateDocument.run({
                                id: result.doc.id,
                                payload: { is_archived: true },
                              });
                            }
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Showing {paginationStart}-{paginationEnd} of{" "}
                    {searchResults.length}
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.max(1, page - 1))
                      }
                      disabled={currentPage === 1}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {pageNumbers.map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border text-sm font-medium transition ${
                          currentPage === page
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((page) => Math.min(totalPages, page + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedFolderId !== "" && nonSubmittingTeachers.length > 0 && (
            <div className="mt-8 border-t border-slate-200/70 pt-8">
              <div className="mb-4 flex items-center gap-2">
                <h3 className="text-lg font-semibold text-slate-900">
                  Teachers Not Yet Submitted
                </h3>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
                  {nonSubmittingTeachers.length}
                </span>
              </div>
              <p className="mb-4 text-sm text-slate-500">
                The following teachers have not submitted documents to this
                folder.
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {nonSubmittingTeachers.map((teacher) => (
                  <div
                    key={teacher.userId}
                    className="flex items-center gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/70 p-4 transition-all hover:shadow-lg hover:shadow-amber-500/10"
                  >
                    <div className="shrink-0 overflow-hidden rounded-full border-2 border-amber-200">
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-900">
                        {teacher.name}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {teacher.department || "No Department"}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
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

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
import formatFolderName from "@/hooks/useFolderNameFormat";
import type { DocumentFolder } from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import type { User } from "@/models/user";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  FileStack,
  FolderArchive,
  Home,
  SearchX,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

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
  const [search, setSearch] = useState(initialSearch ?? "");
  const [filters, setFilters] = useState<DocumentRepositoryFilters>({
    ...defaultDocumentRepositoryFilters,
    status: "archived",
  });
  const [currentPage, setCurrentPage] = useState(1);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, selectedFolderId]);

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

  const totalArchivedDocuments = documents?.length ?? 0;
  const archivedFoldersCount = foldersWithDocs.filter(
    (folder) => Number(folder.files_count) > 0,
  ).length;

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "reset") {
      setFilters({
        ...defaultDocumentRepositoryFilters,
        status: "archived",
      });
      return;
    }

    if (filterType === "status" && value !== "" && value !== "archived") {
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [filterType]:
        filterType === "status" && value === "" ? "archived" : value,
    }));
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
        statusOptions={[{ label: "Archived", value: "archived" }]}
      />

      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Home className="h-4 w-4 text-blue-600" />
        <span
          className="cursor-pointer font-medium transition-opacity hover:opacity-60"
          onClick={() => setSelectedFolderId("")}
        >
          Archived Repository
        </span>
        {selectedFolderId !== "" && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{folderName}</span>
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 text-white">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Total Archived Files */}
            <div className="transition-hover rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                <FileStack className="h-4 w-4 text-blue-400" />
                Archived Files
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {totalArchivedDocuments.toLocaleString()}
              </p>
            </div>

            {/* Active Folders */}
            <div className="transition-hover rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                <FolderArchive className="h-4 w-4 text-emerald-400" />
                Active Folders
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {archivedFoldersCount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200/70 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Folders</h3>
              <p className="mt-1 text-sm text-slate-500">
                Browse archive volumes by repository folder.
              </p>
            </div>
          </div>

          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-5"
          >
            {foldersWithDocs.map((value) => (
              <motion.div
                key={value.folder}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.97 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
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
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="p-6">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedFolderId === "" ? "Archived Documents" : folderName}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {searchResults.length} archived item
                {searchResults.length === 1 ? "" : "s"} ready for review or
                restoration.
              </p>
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <SearchX className="h-7 w-7" />
              </div>
              <h4 className="mt-5 text-lg font-semibold text-slate-900">
                No documents found
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try adjusting your keywords, narrowing the date range
                differently, or clearing the current filters to expand the
                archive results.
              </p>
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
                          hidden: { opacity: 0, y: 18 },
                          show: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                      >
                        <FileCard
                          doc={result.doc}
                          ownerName={ownerName}
                          highlightTerms={result.searchTerms}
                          matchContext={result.matchContext}
                          onRestore={() => {
                            if (!updateDocument.isLocked) {
                              updateDocument.run({
                                id: result.doc.id,
                                payload: { is_archived: false },
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
        </div>
      </div>
    </>
  );
};

export default DocumentExplorer;

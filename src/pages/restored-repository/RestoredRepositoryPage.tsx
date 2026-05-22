import { useLocation } from "react-router-dom";
import { useCurrentUser } from "@saintrelion/auth-lib";
import type { User } from "@/models/user";
import { RenderForm } from "@saintrelion/forms";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type {
  TeacherDocument,
  UpdateTeacherDocument,
} from "@/models/TeacherDocument";
import type { DocumentFolder } from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
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
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronRight,
  Home,
  RotateCcw,
  FolderOpen,
  SearchX,
} from "lucide-react";

const PAGE_SIZE = 8;

const RestoredRepositoryPage = () => {
  const user = useCurrentUser<User>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") ?? "";
  const folder = params.get("folder") ?? "";

  const [selectedFolderId, setSelectedFolderId] = useState(folder);
  const [search, setSearch] = useState(q);
  const [filters, setFilters] = useState<DocumentRepositoryFilters>(
    defaultDocumentRepositoryFilters,
  );
  const [currentPage, setCurrentPage] = useState(1);

  const role = user?.roles ? user.roles[0] : "";

  const { useList: getFolders } =
    useResourceLocked<DocumentFolder>("documentfolder");
  const { useList: getDocuments } =
    useResourceLocked<TeacherDocument>("teacherdocument");
  const { useList: getPersonalInfo } = useResourceLocked<PersonalInformation>(
    "personalinformation",
  );

  const { useUpdate: updateDocument } = useResourceLocked<
    TeacherDocument,
    never,
    UpdateTeacherDocument
  >("teacherdocument");

  const documentFolders = getFolders().data;
  const personalInfos = getPersonalInfo().data;

  // Only restored docs: is_archived=False AND restored_at is not null
  // Backend should support restored=True filter — if not, filter client-side
  const allLive = getDocuments({
    filters:
      role === "admin"
        ? { is_archived: "False" }
        : { user: user?.id, is_archived: "False" },
  }).data;

  const documents = useMemo(
    () => allLive?.filter((doc) => doc.restored_at !== null) ?? [],
    [allLive],
  );

  console.log(documents);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, selectedFolderId]);

  const foldersWithDocs = useMemo(() => {
    const map = new Map<
      string,
      { folder: string; folder_name: string; count: number }
    >();
    if (!documentFolders || !documents) return [];
    documentFolders.forEach((f) =>
      map.set(f.id, { folder: f.id, folder_name: f.name, count: 0 }),
    );
    documents.forEach((doc) => {
      if (!doc.folder_id) return;
      const entry = map.get(doc.folder_id);
      if (entry) entry.count += 1;
    });
    return Array.from(map.values())
      .filter((f) => f.count > 0)
      .map((f) => ({
        folder_name: f.folder_name,
        files_count: String(f.count),
        folder: f.folder,
      }));
  }, [documentFolders, documents]);

  const folderName =
    foldersWithDocs.find((f) => f.folder === selectedFolderId)?.folder_name ??
    "";

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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(
    Math.max(0, currentPage - 2),
    Math.min(totalPages, currentPage + 1),
  );

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

  return (
    <RenderForm wrapperClassName="flex-1 bg-slate-50 p-4 md:p-6 lg:p-8">
      <Filters
        filters={filters}
        searchValue={search}
        onSearchChange={setSearch}
        onFilterChange={(type, value) => {
          if (type === "reset") {
            setFilters(defaultDocumentRepositoryFilters);
            return;
          }
          setFilters((prev) => ({ ...prev, [type]: value }));
        }}
        suggestionItems={searchSuggestions}
        departmentOptions={departmentOptions}
      />

      <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
        <Home className="h-4 w-4 text-emerald-600" />
        <span
          className="cursor-pointer font-medium transition-opacity hover:opacity-60"
          onClick={() => setSelectedFolderId("")}
        >
          Restored Repository
        </span>
        {selectedFolderId !== "" && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-slate-700">{folderName}</span>
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-sm">
        {/* Header stats */}
        <div className="border-b border-slate-200/70 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 p-6 text-white">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                <RotateCcw className="h-4 w-4 text-emerald-400" />
                Restored Files
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {documents.length.toLocaleString()}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
              <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-slate-400 uppercase">
                <FolderOpen className="h-4 w-4 text-sky-400" />
                Folders
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                {foldersWithDocs.length.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Folders */}
        <div className="border-b border-slate-200/70 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Folders</h3>
            <p className="mt-1 text-sm text-slate-500">
              Browse restored documents by folder.
            </p>
          </div>
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.06 } },
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

        {/* Documents */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {selectedFolderId === "" ? "Restored Documents" : folderName}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {searchResults.length} restored item
              {searchResults.length === 1 ? "" : "s"}.
            </p>
          </div>

          {searchResults.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <SearchX className="h-7 w-7" />
              </div>
              <h4 className="mt-5 text-lg font-semibold text-slate-900">
                No restored documents
              </h4>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Documents restored from the archive will appear here.
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
                    show: { transition: { staggerChildren: 0.05 } },
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
                    Showing {paginationStart}–{paginationEnd} of{" "}
                    {searchResults.length}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                            : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
    </RenderForm>
  );
};

export default RestoredRepositoryPage;

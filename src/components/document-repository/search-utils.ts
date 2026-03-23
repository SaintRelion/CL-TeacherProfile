import { getExpiryState } from "@/lib/utils";
import type { DocumentFolder } from "@/models/DocumentFolder";
import type { PersonalInformation } from "@/models/PersonalInformation";
import type { TeacherDocument } from "@/models/TeacherDocument";
import { toDate } from "@saintrelion/time-functions";

export type DocumentRepositoryFilters = {
  category: string;
  sort: string;
  quickTag: string;
  department: string;
  fileType: string;
  uploadDateFrom: string;
  uploadDateTo: string;
  expiryDateFrom: string;
  expiryDateTo: string;
  status: string;
  fileSize: string;
};

export type DocumentSearchResult = {
  doc: TeacherDocument;
  score: number;
  matchContext: string[];
  searchTerms: string[];
  authorName: string;
  department: string;
  folderName: string;
  status: string;
  fileSizeMb: number;
  createdAt: Date | null;
  updatedAt: Date | null;
  expiryAt: Date | null;
};

export const defaultDocumentRepositoryFilters: DocumentRepositoryFilters = {
  category: "",
  sort: "relevance",
  quickTag: "",
  department: "",
  fileType: "",
  uploadDateFrom: "",
  uploadDateTo: "",
  expiryDateFrom: "",
  expiryDateTo: "",
  status: "",
  fileSize: "",
};

const normalize = (value?: string | null) => (value ?? "").trim().toLowerCase();

const parseDateInput = (value: string, endOfDay = false) => {
  if (!value) return null;

  const date = new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const buildAuthorName = (info?: PersonalInformation) =>
  [info?.first_name, info?.middle_name, info?.last_name]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

const getFileSizeCategory = (sizeInMb: number) => {
  if (sizeInMb < 1) return "small";
  if (sizeInMb <= 5) return "medium";
  return "large";
};

const scoreField = (
  value: string,
  terms: string[],
  weight: number,
  label: string,
  context: string[],
) => {
  let score = 0;
  const normalizedValue = normalize(value);

  terms.forEach((term) => {
    if (!normalizedValue || !term) return;

    if (normalizedValue === term) {
      score += weight + 5;
    } else if (normalizedValue.startsWith(term)) {
      score += weight + 3;
    } else if (normalizedValue.includes(term)) {
      score += weight;
    }
  });

  if (score > 0 && value.trim()) {
    context.push(`${label}: ${value}`);
  }

  return score;
};

export const buildDepartmentOptions = (personalInfos: PersonalInformation[] = []) =>
  Array.from(
    new Set(
      personalInfos
        .map((info) => info.department?.trim())
        .filter((department): department is string => Boolean(department)),
    ),
  )
    .sort((a, b) => a.localeCompare(b))
    .map((department) => ({
      label: department,
      value: normalize(department).replace(/\s+/g, "-"),
    }));

export const getSearchSuggestions = ({
  documents,
  personalInfos,
  folders,
}: {
  documents: TeacherDocument[];
  personalInfos?: PersonalInformation[];
  folders?: DocumentFolder[];
}) => {
  const folderMap = new Map((folders ?? []).map((folder) => [folder.id, folder.name]));
  const infoMap = new Map((personalInfos ?? []).map((info) => [info.user, info]));

  return Array.from(
    new Set(
      documents.flatMap((doc) => {
        const info = infoMap.get(doc.user);
        return [
          doc.document_title,
          `${doc.document_title}.${doc.extension.toLowerCase()}`,
          doc.extension.toUpperCase(),
          buildAuthorName(info),
          info?.department ?? "",
          folderMap.get(doc.folder) ?? "",
        ].filter(Boolean);
      }),
    ),
  );
};

export const filterAndSortDocuments = ({
  documents,
  search,
  filters,
  selectedFolderId,
  personalInfos,
  documentFolders,
}: {
  documents: TeacherDocument[];
  search: string;
  filters: DocumentRepositoryFilters;
  selectedFolderId: string;
  personalInfos?: PersonalInformation[];
  documentFolders?: DocumentFolder[];
}) => {
  const infoMap = new Map((personalInfos ?? []).map((info) => [info.user, info]));
  const folderMap = new Map(
    (documentFolders ?? []).map((folder) => [folder.id, folder.name]),
  );
  const searchTerms = search
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
  const latestCreated = documents.reduce((latest, doc) => {
    const timestamp = new Date(doc.created_at).getTime();
    return Number.isNaN(timestamp) ? latest : Math.max(latest, timestamp);
  }, 0);

  const filtered = documents.reduce<DocumentSearchResult[]>((results, doc) => {
    const info = infoMap.get(doc.user);
    const authorName = buildAuthorName(info);
    const department = info?.department ?? "";
    const folderName = folderMap.get(doc.folder) ?? "";
    const status = doc.is_archived ? "archived" : getExpiryState(doc.expiry_date);
    const fileSizeMb = Number.parseFloat(doc.file_size_in_mb) || 0;
    const createdAt = toDate(doc.created_at);
    const updatedAt = toDate(doc.updated_at);
    const expiryAt = toDate(doc.expiry_date);
    const filename = `${doc.document_title}.${doc.extension.toLowerCase()}`;
    const contentProxy = [
      doc.document_title,
      filename,
      folderName,
      authorName,
      department,
      doc.extension,
      formatDateForSearch(createdAt),
      formatDateForSearch(expiryAt),
    ]
      .filter(Boolean)
      .join(" ");
    const matchContext: string[] = [];

    if (selectedFolderId && doc.folder !== selectedFolderId) return results;

    if (filters.department) {
      const filterDept = normalize(filters.department).replaceAll("-", " ");
      if (!normalize(department).includes(filterDept)) return results;
    }

    if (filters.fileType && normalize(doc.extension) !== normalize(filters.fileType)) {
      return results;
    }

    if (filters.status && normalize(status) !== normalize(filters.status)) {
      return results;
    }

    if (filters.fileSize && getFileSizeCategory(fileSizeMb) !== filters.fileSize) {
      return results;
    }

    const uploadDateFrom = parseDateInput(filters.uploadDateFrom);
    const uploadDateTo = parseDateInput(filters.uploadDateTo, true);
    const expiryDateFrom = parseDateInput(filters.expiryDateFrom);
    const expiryDateTo = parseDateInput(filters.expiryDateTo, true);

    if (uploadDateFrom && (!createdAt || createdAt < uploadDateFrom)) return results;
    if (uploadDateTo && (!createdAt || createdAt > uploadDateTo)) return results;
    if (expiryDateFrom && (!expiryAt || expiryAt < expiryDateFrom)) return results;
    if (expiryDateTo && (!expiryAt || expiryAt > expiryDateTo)) return results;

    switch (filters.quickTag) {
      case "recent":
        if (!createdAt || createdAt.getTime() < latestCreated - 1000 * 60 * 60 * 24 * 7) {
          return results;
        }
        break;
      case "expiring":
        if (status !== "expiring") return results;
        break;
      case "large":
        if (fileSizeMb <= 5) return results;
        break;
      case "none":
        if (searchTerms.length > 0) break;
        if (filters.department || filters.fileType || filters.status || filters.fileSize) {
          break;
        }
        break;
    }

    let score = 0;
    if (searchTerms.length > 0) {
      score += scoreField(doc.document_title, searchTerms, 12, "Title", matchContext);
      score += scoreField(filename, searchTerms, 10, "Filename", matchContext);
      score += scoreField(authorName, searchTerms, 9, "Author", matchContext);
      score += scoreField(department, searchTerms, 8, "Department", matchContext);
      score += scoreField(folderName, searchTerms, 7, "Folder", matchContext);
      score += scoreField(doc.extension.toUpperCase(), searchTerms, 6, "File Type", matchContext);
      score += scoreField(contentProxy, searchTerms, 4, "Content", matchContext);

      if (score === 0) return results;
    } else {
      matchContext.push(
        `Status: ${status === "expiring" ? "Expiring" : status.charAt(0).toUpperCase() + status.slice(1)}`,
      );
      if (department) matchContext.push(`Department: ${department}`);
      if (authorName) matchContext.push(`Author: ${authorName}`);
    }

    results.push({
      doc,
      score,
      matchContext: Array.from(new Set(matchContext)),
      searchTerms,
      authorName,
      department,
      folderName,
      status,
      fileSizeMb,
      createdAt,
      updatedAt,
      expiryAt,
    });

    return results;
  }, []);

  const sortKey = filters.sort || "relevance";

  return filtered.sort((a, b) => {
    switch (sortKey) {
      case "created_asc":
        return (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0);
      case "created_desc":
        return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
      case "name_asc":
        return a.doc.document_title.localeCompare(b.doc.document_title);
      case "name_desc":
        return b.doc.document_title.localeCompare(a.doc.document_title);
      case "size_asc":
        return a.fileSizeMb - b.fileSizeMb;
      case "size_desc":
        return b.fileSizeMb - a.fileSizeMb;
      case "expiry_asc":
        return (a.expiryAt?.getTime() ?? Number.MAX_SAFE_INTEGER) -
          (b.expiryAt?.getTime() ?? Number.MAX_SAFE_INTEGER);
      case "expiry_desc":
        return (b.expiryAt?.getTime() ?? 0) - (a.expiryAt?.getTime() ?? 0);
      case "relevance":
      default:
        return (
          b.score - a.score ||
          (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0) ||
          a.doc.document_title.localeCompare(b.doc.document_title)
        );
    }
  });
};

function formatDateForSearch(date: Date | null) {
  if (!date) return "";

  return [
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    date.toISOString().slice(0, 10),
  ].join(" ");
}

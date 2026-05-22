import { Upload, X } from "lucide-react";
import { RenderForm, RenderFormButton } from "@saintrelion/forms";
import { useState } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { fileToBase64 } from "@/lib/utils";
import type { CreateTeacherDocument } from "@/models/TeacherDocument";
import type { CreateNotification } from "@/models/Notification";
import { FolderSelect } from "../document-repository/FolderSelect";
import type { DocumentFolder } from "@/models/DocumentFolder";
import { toast } from "@saintrelion/notifications";

// Typical validity periods (in years) per folder name — 0 means no expiry
const EXPIRY_YEARS: Record<string, number> = {
  "Personal Data Sheet": 1,
  "Medical Certificate": 1,
  "Statements of Assets": 1,
  "Certificate of Eligibilities/Licences": 3,
  "NBI Clearance": 1,
  "Identification Card": 5,
  "Identification Cards": 5,
  "Prc Licences": 3,
  "Contract of Service": 1,
};

function computeExpiryDate(folderName: string, issueDate: string): string {
  const years = EXPIRY_YEARS[folderName];
  if (!years || !issueDate) return "";
  const d = new Date(issueDate);
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().split("T")[0];
}

function buildDocumentTitle(
  fullName: string,
  folderName: string,
  fileName: string,
): string {
  // Use folder name + full name as the standardized title, keeping it editable
  if (folderName) return `${folderName} - ${fullName}`;
  // Fallback: use the uploaded file name (without extension)
  return fileName.replace(/\.[^/.]+$/, "");
}

export default function DocumentForm({
  userId,
  fullName,
  onFileSelect,
}: {
  userId: string;
  fullName: string;
  onFileSelect?: (fileName: string) => void;
}) {
  const { useInsert: insertDocument } = useResourceLocked<
    never,
    CreateTeacherDocument
  >("teacherdocument", { showToast: false });

  const { useInsert: insertNotification } = useResourceLocked<
    never,
    CreateNotification
  >("notification", { showToast: false });

  const { useList: getFolders } =
    useResourceLocked<DocumentFolder>("documentfolder");
  const documentFolders = getFolders().data;

  const [timestamp, setTimestamp] = useState(() =>
    new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14),
  );

  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const selectedFolder = documentFolders?.find(
    (f) => f.id === selectedFolderId,
  );
  const showExpiry = selectedFolder?.has_expiry ?? false;

  // When folder changes, recompute title and expiry
  const handleFolderChange = (folderId: string) => {
    setSelectedFolderId(folderId);
    const folder = documentFolders?.find((f) => f.id === folderId);
    const folderName = folder?.name ?? "";
    setDocumentTitle(
      buildDocumentTitle(fullName, folderName, file?.name ?? ""),
    );
    if (folder?.has_expiry && issueDate) {
      setExpiryDate(computeExpiryDate(folderName, issueDate));
    } else {
      setExpiryDate("");
    }
  };

  // When issue date changes, recompute expiry
  const handleIssueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setIssueDate(date);
    if (showExpiry && selectedFolder?.name) {
      setExpiryDate(computeExpiryDate(selectedFolder.name, date));
    }
  };

  const maxKB = 5000;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (f.size > maxKB * 1024) {
      alert(`For testing, keep it (<${maxKB}KB)`);
      return;
    }

    setFile(f);
    onFileSelect?.(f.name);
    setTimestamp(
      new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14),
    );

    // Update title to reflect file name if no folder selected yet
    if (!selectedFolderId) {
      setDocumentTitle(f.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const removeFile = () => {
    setFile(null);
    onFileSelect?.("");
  };

  const handleSubmit = async (data: Record<string, string>) => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!selectedFolderId) {
      toast.error("Please select a folder");
      return;
    }
    if (showExpiry && !expiryDate) {
      toast.error("Please select an expiry date");
      return;
    }

    try {
      const extension = file.name.split(".").pop() ?? "";
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const fileBase64 = await fileToBase64(file);

      const payload: CreateTeacherDocument = {
        user: userId,
        folder: selectedFolderId,
        document_title: `${documentTitle}-${timestamp}`,
        issue_date: issueDate || data.issue_date,
        expiry_date: showExpiry && expiryDate ? expiryDate : null,
        extension,
        file_size_in_mb: fileSizeInMB,
        file_base64: fileBase64,
      };

      await insertDocument.run(payload);
      await insertNotification.run({
        user: userId,
        type: "upload",
        title: "Document uploaded",
        description: `${payload.document_title} - ${fullName}`,
        is_read: false,
      });

      toast.success("Document Uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Document Upload error");
    }
  };

  return (
    <RenderForm wrapperClassName="space-y-3">
      {/* Folder — select first so title can auto-populate */}
      <FolderSelect
        name="folderSelect"
        folders={documentFolders ?? []}
        onFolderChange={handleFolderChange}
      />

      {/* Document Title — pre-filled, still editable */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">
          Document Title *
        </label>
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => setDocumentTitle(e.target.value)}
          placeholder="Select a folder or upload a file to auto-fill"
          className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-[11px] text-gray-400">
          Will be saved as:{" "}
          <span className="font-mono text-gray-500">
            {documentTitle}-{timestamp}
          </span>
        </p>
      </div>

      {/* Dates */}
      <div
        className={`grid gap-4 ${showExpiry ? "grid-cols-2" : "grid-cols-1"}`}
      >
        {/* Date Issued (renamed from Issue Date) */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-700">
            Date Issued *
          </label>
          <input
            type="date"
            value={issueDate}
            onChange={handleIssueDateChange}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        {/* Expiry Date — auto-computed, still editable */}
        {showExpiry && (
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Expiry Date *
              {expiryDate && (
                <span className="ml-1 text-[10px] font-normal text-blue-500">
                  (auto-computed)
                </span>
              )}
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* File Upload */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-700">
          File Upload *
        </label>

        {!file ? (
          <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 transition hover:bg-gray-100">
            <Upload className="mb-1 h-8 w-8 text-gray-400" />
            <p className="text-xs text-gray-500">
              <span className="font-semibold">Click to upload</span>
            </p>
            <p className="mt-1 text-[10px] text-gray-400">
              PDF, DOC, JPG, PNG (MAX {maxKB}KB)
            </p>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100">
                <Upload className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="max-w-37.5 truncate text-sm font-medium text-gray-800">
                  {file.name}
                </p>
                <p className="text-[10px] text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 transition hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      <RenderFormButton
        buttonLabel="Submit Document"
        onSubmit={handleSubmit}
        isDisabled={insertDocument.isLocked || insertNotification.isLocked}
        buttonClassName="w-full rounded-md bg-blue-600 px-4 py-2.5 text-base font-medium text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

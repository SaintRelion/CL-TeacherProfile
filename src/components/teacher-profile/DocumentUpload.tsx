import { Upload, X } from "lucide-react";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useState } from "react";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { fileToBase64 } from "@/lib/utils";
import type { CreateTeacherDocument } from "@/models/TeacherDocument";
import type { CreateNotification } from "@/models/Notification";
import { FolderSelect } from "../document-repository/FolderSelect";
import type { DocumentFolder } from "@/models/DocumentFolder";
import { toast } from "@saintrelion/notifications";

export default function DocumentForm({
  userId,
  fullName,
}: {
  userId: string;
  fullName: string;
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

  const [selectedFolderId, setSelectedFolderId] = useState("");
  // const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [file, setFile] = useState<File | null>();

  const maxKB = 5000;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    const maxSize = maxKB * 1024;
    if (file && file.size > maxSize) {
      alert(`For testing, keep it (<${maxKB}KB)`);
      return;
    }

    setFile(file);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async (data: Record<string, string>) => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    try {
      const extension = file.name.split(".").pop() ?? "";
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      const base64 = await fileToBase64(file);

      data.extension = extension;
      data.file_size_in_mb = fileSizeInMB;
      data.file_base64 = base64;
      data.user = userId;

      await insertDocument.run({
        user: userId,
        folder: selectedFolderId,
        document_title: data.document_title,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        extension: data.extension,
        file_size_in_mb: data.file_size_in_mb,
        file_base64: data.file_base64,
      });

      await insertNotification.run({
        user: userId,
        type: "upload",
        title: "Document uploaded",
        description: `${data.document_title} - ${fullName}`,
        is_read: false
      });

      toast.success("Document Uploaded");
    } catch (err) {
      const error = err as Record<string, string>;
      console.log(error);
      toast.error("Document Upload error");
    }
  };

  return (
    <RenderForm wrapperClassName="space-y-3">
      {/* Document Title */}
      <RenderFormField
        field={{
          label: "Document Title *",
          type: "text",
          name: "document_title",
          placeholder: "Enter title",
        }}
        labelClassName="mb-1 block text-xs font-medium text-gray-700"
        inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
      />

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {/* Issue Date */}
        <RenderFormField
          field={{
            label: "Issue Date *",
            type: "date",
            name: "issue_date",
          }}
          labelClassName="mb-1 block text-xs font-medium text-gray-700"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />

        {/* Expiry Date */}
        <RenderFormField
          field={{
            label: "Expiry Date *",
            type: "date",
            name: "expiry_date",
          }}
          labelClassName="mb-1 block text-xs font-medium text-gray-700"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <FolderSelect
        name="folderSelect"
        folders={documentFolders} // from getFolders().data
        onFolderChange={setSelectedFolderId}
      />

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

      {/* Submit Button */}
      <RenderFormButton
        buttonLabel="Submit Document"
        onSubmit={handleSubmit}
        isDisabled={insertDocument.isLocked || insertNotification.isLocked}
        buttonClassName="w-full rounded-md bg-blue-600 px-4 py-2.5 text-base font-medium text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

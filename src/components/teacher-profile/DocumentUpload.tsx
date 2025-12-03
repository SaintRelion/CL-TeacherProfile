import { Upload, X } from "lucide-react";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { useState } from "react";

export default function DocumentForm() {
  const licenseTypes = [
    "Certificate",
    "License",
    "Permit",
    "Registration",
    "Accreditation",
  ];

  const [selectedLicense, setSelectedLicense] = useState("");
  const [file, setFile] = useState<File | null>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (data: Record<string, string>) => {
    if (!file) {
      alert("Please select an image to upload");
      return;
    }

    console.log("Form submitted:", data);
  };

  return (
    <RenderForm wrapperClass="space-y-3">
      {/* Document Title */}
      <RenderFormField
        field={{
          label: "Document Title *",
          type: "text",
          name: "title",
          placeholder: "Enter title",
        }}
        labelClassName="mb-1 block text-xs font-medium text-gray-700"
        inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
      />

      {/* License Type */}
      <RenderFormField
        field={{
          label: "License Type",
          type: "select",
          name: "licenseType",
          options: licenseTypes,
          onValueChange: (value) => {
            if (typeof value === "string") setSelectedLicense(value);
          },
        }}
        labelClassName="mb-1 block text-xs font-medium text-gray-700"
        inputClassName="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Conditional Certificate/License Number */}
      {selectedLicense !== "" && (
        <RenderFormField
          field={{
            label: `${selectedLicense} Number *`,
            type: "text",
            name: "licenseNumber",
            placeholder: `Enter ${selectedLicense.toLowerCase()} number`,
          }}
          labelClassName="mb-1 block text-xs font-medium text-gray-700"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Dates Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
        {/* Issue Date */}
        <RenderFormField
          field={{
            label: "Issue Date *",
            type: "date",
            name: "issueDate",
          }}
          labelClassName="mb-1 block text-xs font-medium text-gray-700"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />

        {/* Expiry Date */}
        <RenderFormField
          field={{
            label: "Expiry Date *",
            type: "date",
            name: "expiryDate",
          }}
          labelClassName="mb-1 block text-xs font-medium text-gray-700"
          inputClassName="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
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
              <span className="font-semibold">Click to upload</span> or drag
            </p>

            <p className="mt-1 text-[10px] text-gray-400">
              PDF, DOC, JPG, PNG (MAX 10MB)
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
                <p className="max-w-[150px] truncate text-sm font-medium text-gray-800">
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
        buttonClassName="w-full rounded-md bg-blue-600 px-4 py-2.5 text-base font-medium text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

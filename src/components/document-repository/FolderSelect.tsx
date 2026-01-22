import type { DocumentFolder } from "@/models/DocumentFolder";
import { RenderFormField } from "@saintrelion/forms";
import { useMemo } from "react";

interface FolderSelectProps {
  label?: string;
  name: string;
  folders: DocumentFolder[];
  onFolderChange?: (folderId: string) => void;
}

export function FolderSelect({
  label = "Select Folder",
  name,
  folders,
  onFolderChange,
}: FolderSelectProps) {
  // Keep local mapping of folderName -> folderId
  const folderMap = useMemo(() => {
    const map: Record<string, string> = {};
    folders.forEach((f) => {
      map[f.name] = f.id;
    });
    return map;
  }, [folders]);

  return (
    <RenderFormField
      field={{
        label,
        type: "select",
        name,
        options: folders.map((f) => f.name), // only string[]
        onValueChange: (value) => {
          if (typeof value === "string" && onFolderChange) {
            onFolderChange(folderMap[value]);
          }
        },
      }}
      labelClassName="mb-1 block text-xs font-medium text-gray-700"
      inputClassName="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  );
}

import type { DocumentFolder } from "@/models/DocumentFolder";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ScrollArea } from "../ui/scroll-area";

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
  const { setValue, watch, register } = useFormContext();

  // Manually register the field name into the form state on mount
  useEffect(() => {
    register(name);
  }, [register, name]);

  const selectedValue = watch(name);

  const folderMap = useMemo(() => {
    const map: Record<string, string> = {};
    folders.forEach((f: DocumentFolder) => {
      map[f.name] = f.id;
    });
    return map;
  }, [folders]);

  return (
    <div className="space-y-1">
      <label className="mb-1 block text-xs font-medium text-gray-700">
        {label}
      </label>

      <Select
        value={selectedValue}
        onValueChange={(value: string) => {
          // 1. Update the parent form instance manually
          setValue(name, value, { shouldValidate: true });

          // 2. Trigger your local logic for expiry visibility
          if (onFolderChange) {
            onFolderChange(folderMap[value]);
          }
        }}
      >
        <SelectTrigger className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500">
          <SelectValue placeholder="Choose a folder..." />
        </SelectTrigger>

        <SelectContent>
          <ScrollArea className="h-48">
            {folders.map((f: DocumentFolder) => (
              <SelectItem key={f.id} value={f.name}>
                {f.name}
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
}

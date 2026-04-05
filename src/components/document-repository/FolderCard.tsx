import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface FolderCardProps {
  userRole: string;
  folderInfo: {
    folder_name: string;
    files_count: string;
    folder: string;
  };
  selectedFolderId: string;
  onFolderClicked: (folder: string) => void;
  onRenameFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}

const FolderGlyph = ({ active }: { active: boolean }) => (
  <div className="relative h-16 w-20">
    <div
      className={`absolute top-0 left-3 h-4 w-9 rounded-t-xl bg-gradient-to-r from-blue-400 to-blue-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6 ${
        active ? "shadow-md shadow-blue-500/20" : ""
      }`}
    />
    <div className="absolute top-3 left-0 h-12 w-20 rounded-2xl rounded-tl-xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-md shadow-blue-500/10" />
    <div className="absolute inset-x-2 bottom-3 h-3 rounded-full bg-white/20 blur-sm" />
  </div>
);

const FolderCard = ({
  userRole,
  folderInfo,
  selectedFolderId,
  onFolderClicked,
  onRenameFolder,
  onDeleteFolder,
}: FolderCardProps) => {
  const active = selectedFolderId === folderInfo.folder;
  return (
    <motion.div
      role="button"
      tabIndex={0} // Makes the div focusable via keyboard
      onClick={(): void => onFolderClicked(folderInfo.folder)}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === "Enter" || e.key === " ") {
          onFolderClicked(folderInfo.folder);
        }
      }}
      whileHover={{ y: -4 }}
      className={`group relative flex w-full cursor-pointer flex-col items-start rounded-2xl border p-4 text-left transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
        active
          ? "border-blue-200 bg-blue-50/80 shadow-lg shadow-blue-500/10"
          : "border-slate-200/50 bg-white hover:shadow-lg hover:shadow-blue-500/10"
      }`}
    >
      {userRole === "admin" && (onDeleteFolder || onRenameFolder) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* Now this button is safe because its parent is a div */}
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>): void => {
                e.stopPropagation(); // Critical to prevent folder click
              }}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-slate-400 opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100 hover:bg-white hover:text-slate-700"
              title="Folder options"
            >
              <Ellipsis className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 rounded-2xl border border-slate-200/70 bg-white/95 p-1 shadow-xl shadow-slate-200/60"
          >
            {onRenameFolder && (
              <DropdownMenuItem
                onClick={(): void => onRenameFolder(folderInfo.folder)}
              >
                <Pencil className="h-4 w-4 text-amber-500" />
                <span>Rename</span>
              </DropdownMenuItem>
            )}
            {onDeleteFolder && (
              <DropdownMenuItem
                onClick={(): void => onDeleteFolder(folderInfo.folder)}
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <FolderGlyph active={active} />
      <span className="mt-3 line-clamp-2 text-sm font-semibold text-slate-800">
        {folderInfo.folder_name}
      </span>
      <span className="mt-1 text-xs text-slate-400">
        {folderInfo.files_count} files
      </span>
    </motion.div>
  );
};

export default FolderCard;

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
      className={`absolute left-3 top-0 h-4 w-9 rounded-t-xl bg-gradient-to-r from-blue-400 to-blue-300 transition-transform duration-300 group-hover:-rotate-6 group-hover:-translate-y-0.5 ${
        active ? "shadow-md shadow-blue-500/20" : ""
      }`}
    />
    <div className="absolute left-0 top-3 h-12 w-20 rounded-2xl rounded-tl-xl bg-gradient-to-br from-blue-500 to-blue-400 shadow-md shadow-blue-500/10" />
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
    <motion.button
      type="button"
      onClick={() => onFolderClicked(folderInfo.folder)}
      whileHover={{ y: -4 }}
      className={`group relative flex w-full flex-col items-start rounded-2xl border p-4 text-left transition-all duration-300 ${
        active
          ? "border-blue-200 bg-blue-50/80 shadow-lg shadow-blue-500/10"
          : "border-slate-200/50 bg-white hover:shadow-lg hover:shadow-blue-500/10"
      }`}
    >
      {userRole === "admin" && (onDeleteFolder || onRenameFolder) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              onClick={(e) => e.stopPropagation()}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-slate-400 opacity-0 shadow-sm transition-all duration-300 hover:bg-white hover:text-slate-700 group-hover:opacity-100"
              title="Folder options"
            >
              <Ellipsis className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-2xl border border-slate-200/70 bg-white/95 p-1 shadow-xl shadow-slate-200/60">
            {onRenameFolder && (
              <DropdownMenuItem onClick={() => onRenameFolder(folderInfo.folder)}>
                <Pencil className="h-4 w-4 text-amber-500" />
                Rename
              </DropdownMenuItem>
            )}
            {onDeleteFolder && (
              <DropdownMenuItem
                onClick={() => onDeleteFolder(folderInfo.folder)}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
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
    </motion.button>
  );
};

export default FolderCard;

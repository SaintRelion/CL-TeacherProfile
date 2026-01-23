import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  userRole: string;
  folderInfo: {
    folderName: string;
    filesCount: string;
    folderId: string;
  };
  selectedFolderId: string;
  onFolderClicked: (folder: string) => void;
  onRenameFolder?: (folderId: string) => void;
  onDeleteFolder?: (folderId: string) => void;
}

const FolderCard = ({
  userRole,
  folderInfo,
  selectedFolderId,
  onFolderClicked,
  onRenameFolder,
  onDeleteFolder,
}: FolderCardProps) => {
  return (
    <div
      onClick={() => onFolderClicked(folderInfo.folderId)}
      className={`group relative flex cursor-pointer flex-col items-center rounded-xl p-4 transition-all ${
        selectedFolderId === folderInfo.folderId
          ? "bg-blue-50 ring-2 ring-blue-500/20"
          : "hover:bg-slate-50"
      }`}
    >
      {/* Context menu for custom folders */}
      {userRole == "admin" && (onDeleteFolder || onRenameFolder) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 opacity-0 transition-all group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-700"
              title="Folder options"
            >
              <i className="fas fa-ellipsis-v text-xs"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white">
            {onRenameFolder && (
              <DropdownMenuItem
                onClick={() => onRenameFolder(folderInfo.folderId)}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <i className="fas fa-edit text-amber-500"></i>
                Rename
              </DropdownMenuItem>
            )}
            {onDeleteFolder && (
              <DropdownMenuItem
                onClick={() => onDeleteFolder(folderInfo.folderId)}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <i className="fas fa-trash"></i>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <div
        className={`bg-primary-100 group-hover:bg-primary-200 mb-2 rounded-xl p-3 transition-all`}
      >
        <i className={`fas fa-folder "text-primary-600" text-2xl`}></i>
      </div>
      <span className="text-center text-sm font-medium text-slate-900">
        {folderInfo.folderName}
      </span>
      <span className="text-xs text-slate-500">
        {folderInfo.filesCount} files
      </span>
    </div>
  );
};
export default FolderCard;

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderCardProps {
  kvp: {
    title: string;
    value: string;
    isCustom?: boolean;
    id?: string;
  };
  selectedFolder: string;
  onFolderClicked: (folder: string) => void;
  onDeleteFolder?: (folderId: string) => void;
  onRenameFolder?: (folderId: string, currentName: string) => void;
}

const FolderCard = ({
  kvp,
  selectedFolder,
  onFolderClicked,
  onDeleteFolder,
  onRenameFolder,
}: FolderCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (kvp.id && onDeleteFolder) {
      onDeleteFolder(kvp.id);
    }
  };

  const handleRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (kvp.id && onRenameFolder) {
      onRenameFolder(kvp.id, kvp.title);
    }
  };

  return (
    <div
      onClick={() => onFolderClicked(kvp.title)}
      className={`group relative flex cursor-pointer flex-col items-center rounded-xl p-4 transition-all ${
        selectedFolder === kvp.title
          ? "bg-blue-50 ring-2 ring-blue-500/20"
          : "hover:bg-slate-50"
      }`}
    >
      {/* Context menu for custom folders */}
      {kvp.isCustom && (onDeleteFolder || onRenameFolder) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 opacity-0 transition-all hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100"
              title="Folder options"
            >
              <i className="fas fa-ellipsis-v text-xs"></i>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 bg-white">
            {onRenameFolder && (
              <DropdownMenuItem
                onClick={handleRename}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <i className="fas fa-edit text-amber-500"></i>
                Rename
              </DropdownMenuItem>
            )}
            {onDeleteFolder && (
              <DropdownMenuItem
                onClick={handleDelete}
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
        className={`mb-2 rounded-xl p-3 transition-all ${
          kvp.isCustom
            ? "bg-gradient-to-br from-amber-100 to-orange-100 group-hover:from-amber-200 group-hover:to-orange-200"
            : "bg-primary-100 group-hover:bg-primary-200"
        }`}
      >
        <i
          className={`fas fa-folder text-2xl ${
            kvp.isCustom ? "text-amber-600" : "text-primary-600"
          }`}
        ></i>
      </div>
      <span className="text-center text-sm font-medium text-slate-900">
        {kvp.title}
      </span>
      <span className="text-xs text-slate-500">{kvp.value} files</span>
      {kvp.isCustom && (
        <span className="mt-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
          Custom
        </span>
      )}
    </div>
  );
};
export default FolderCard;

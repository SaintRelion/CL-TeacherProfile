const FolderCard = ({
  kvp,
  selectedFolder,
  onFolderClicked,
}: {
  kvp: Record<string, string>;
  selectedFolder: string;
  onFolderClicked: (folder: string) => void;
}) => {
  return (
    <div
      onClick={() => onFolderClicked(kvp.title)}
      className={`group flex cursor-pointer flex-col items-center rounded-lg p-4 transition-colors ${selectedFolder == kvp.title ? "bg-slate-100" : "hover:bg-slate-50"} `}
    >
      <div className="bg-primary-100 group-hover:bg-primary-200 mb-2 rounded-lg p-3 transition-colors">
        <i className="fas fa-folder text-primary-600 text-2xl"></i>
      </div>
      <span className="text-secondary-900 text-center text-sm font-medium">
        {kvp.title}
      </span>
      <span className="text-secondary-500 text-xs">{kvp.value} files</span>
    </div>
  );
};
export default FolderCard;

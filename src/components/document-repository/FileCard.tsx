const FileCard = ({ kvp }: { kvp: Record<string, string> }) => {
  return (
    <div className="group cursor-pointer rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between">
        <i className={kvp.iconClassName}></i>
        <div className="opacity-0 transition-opacity group-hover:opacity-100">
          <button className="text-secondary-400 hover:text-secondary-600 p-1">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>
      <h4 className="text-secondary-900 mb-1 truncate font-medium">
        {kvp.fileName}
      </h4>
      <p className="text-secondary-500 mb-2 text-xs">
        {kvp.fileType} •{kvp.fileSize} MB
      </p>
      <div className="text-secondary-500 flex items-center justify-between text-xs">
        <span>{kvp.createdAt}</span>
        <div className="flex items-center space-x-1">
          <i className="fas fa-eye"></i>
          <span>{kvp.views}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center space-x-1">
        <span
          className={`${kvp.statusClassName} rounded-full px-2 py-1 text-xs`}
        >
          {kvp.status}
        </span>
      </div>
    </div>
  );
};
export default FileCard;

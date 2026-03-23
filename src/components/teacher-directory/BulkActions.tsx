const BulkActions = ({
  teacherIds,
  onClear,
  onDelete,
}: {
  teacherIds: string[];
  onClear: () => void;
  onDelete?: (selectedIds: string[]) => void;
}) => {
  return (
    <div
      id="bulkActions"
      className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-medium text-blue-800">
            {teacherIds.length} teachers selected
          </span>
          <div className="h-4 w-px bg-blue-300"></div>
          {/* <button className="text-primary-700 hover:text-primary-800 text-sm font-medium">
            <i className="fas fa-envelope mr-1"></i>
            Send Notification
          </button>
          <button className="text-primary-700 hover:text-primary-800 text-sm font-medium">
            <i className="fas fa-edit mr-1"></i>
            Bulk Update
          </button>
          <button className="text-primary-700 hover:text-primary-800 text-sm font-medium">
            <i className="fas fa-download mr-1"></i>
            Export Selected
          </button> */}
          <button
            onClick={onDelete ? () => onDelete(teacherIds) : () => {}}
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            <i className="fas fa-trash mr-1"></i>
            Trash Selected
          </button>
        </div>
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onClear()}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};
export default BulkActions;

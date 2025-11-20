const BulkActions = ({
  teacherIds,
  onClear,
}: {
  teacherIds: string[];
  onClear: () => void;
}) => {
  return (
    <div
      id="bulkActions"
      className="bg-primary-50 border-primary-200 mb-6 rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-primary-800 font-medium">
            {teacherIds.length} teachers selected
          </span>
          <div className="bg-primary-300 h-4 w-px"></div>
          <button className="text-primary-700 hover:text-primary-800 text-sm font-medium">
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
          </button>
        </div>
        <button
          className="text-primary-600 hover:text-primary-800"
          onClick={() => onClear()}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};
export default BulkActions;

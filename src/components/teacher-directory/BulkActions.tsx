import type { User } from "@/models/user";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { toast } from "@saintrelion/notifications";

const BulkActions = ({
  teacherIds,
  onClear,
  onDeleteSuccess,
}: {
  teacherIds: string[];
  onClear: () => void;
  onDeleteSuccess?: (ids: string[]) => void;
}) => {
  const { useDelete: deleteUser } = useResourceLocked<User>("user");

  const handleDelete = async () => {
    if (teacherIds.length === 0) return;

    if (!window.confirm(`Delete ${teacherIds.length} selected teacher(s)?`)) {
      return;
    }

    let successCount = 0;

    for (const id of teacherIds) {
      try {
        await deleteUser.run(id);
        successCount++;
      } catch (err) {
        console.error("Failed to delete user", id, err);
      }
    }

    if (successCount === 0) {
      toast.error("Failed to delete selected teacher(s)");
      return;
    }

    toast.success(`${successCount} teacher(s) deleted`);
    onDeleteSuccess?.(teacherIds);
  };

  return (
    <div
      id="bulkActions"
      className="bg-blue-50 border-blue-200 mb-6 rounded-lg border p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-blue-800 font-medium">
            {teacherIds.length} teachers selected
          </span>
          <div className="bg-blue-300 h-4 w-px"></div>
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
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
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

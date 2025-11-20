const TeacherCard = ({
  kvp,
  isSelected,
  onTeacherSelect,
}: {
  kvp: Record<string, string>;
  isSelected: boolean;
  onTeacherSelect: (employeeID: string, checked: boolean) => void;
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={kvp.photoURL}
          alt={kvp.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`${kvp.statusColor} rounded-full px-2 py-1 text-xs text-white`}
          >
            {kvp.status}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            className="teacher-checkbox text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
            checked={isSelected}
            onChange={(e) => onTeacherSelect(kvp.employeeID, e.target.checked)}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-secondary-900 font-semibold">{kvp.name}</h3>
            <p className="text-secondary-600 text-sm">{kvp.department}</p>
          </div>
          <button
            className="text-secondary-400 hover:text-secondary-600"
            onClick={() => {}}
          >
            <i className="fas fa-eye"></i>
          </button>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Employee ID:</span>
            <span className="font-medium">{kvp.employeeID}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Years of Service:</span>
            <span className="font-medium">{kvp.yearOfService}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Performance:</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={
                    i < Number(kvp.rating)
                      ? "fas fa-star text-warning-500 text-xs"
                      : "far fa-star text-secondary-300 text-xs"
                  }
                ></i>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View Profile
          </button>
          <div className="flex items-center space-x-2">
            <button className="text-secondary-400 hover:text-secondary-600">
              <i className="fas fa-envelope"></i>
            </button>
            <button className="text-secondary-400 hover:text-secondary-600">
              <i className="fas fa-phone"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherCard;

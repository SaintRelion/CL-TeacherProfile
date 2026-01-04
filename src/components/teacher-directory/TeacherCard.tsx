import { getYearsOfService } from "@/lib/utils";
import { createImpersonationToken, useAuth } from "@saintrelion/auth-lib";
import { useState } from "react";

const TeacherCard = ({
  info,
  isSelected,
  onTeacherSelect,
}: {
  info: Record<string, string> | null;
  isSelected: boolean;
  onTeacherSelect: (employeeID: string, checked: boolean) => void;
}) => {
  const { user } = useAuth();
  const [isTokenGenerating, setIsTokenGenerating] = useState(false);

  if (info == null) return <p>This shouldn't happen, null</p>;

  const handleViewProfile = async () => {
    setIsTokenGenerating(true);
    const token = await createImpersonationToken(user.id, info.userId);
    setIsTokenGenerating(false);

    window.open(
      `/teacherprofileinspect?token=${token}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const complete = info.userId != "";

  const fullName = `${info.firstName} ${info.middleName} ${info.lastName}`;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={info.photoBase64}
          alt={fullName}
          className="h-48 w-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <input
            type="checkbox"
            className="teacher-checkbox text-primary-600 focus:ring-primary-500 h-4 w-4 rounded"
            checked={isSelected}
            onChange={(e) => onTeacherSelect(info.employeeId, e.target.checked)}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-secondary-900 font-semibold">{fullName}</h3>
            <p className="text-secondary-600 text-sm">{info.department}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Employee ID:</span>
            <span className="font-medium">{info.employeeId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Years of Service:</span>
            <span className="font-medium">
              {getYearsOfService(info.dateHired)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-secondary-600">Performance:</span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={
                    i < Number(info.rating)
                      ? "fas fa-star text-warning-500 text-xs"
                      : "far fa-star text-secondary-300 text-xs"
                  }
                ></i>
              ))}
            </div>
          </div>
        </div>
        {complete && (
          <div
            className={`${isTokenGenerating && "opacity-30"} mt-4 flex items-center justify-between border-t border-slate-200 pt-3`}
          >
            <button
              onClick={() => handleViewProfile()}
              disabled={isTokenGenerating}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default TeacherCard;

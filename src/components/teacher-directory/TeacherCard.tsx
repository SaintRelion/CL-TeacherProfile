import { getYearsOfService } from "@/lib/utils";
import type { User } from "@/models/User";
import {
  createImpersonationToken,
  useCurrentUser,
} from "@saintrelion/auth-lib";
import { useState } from "react";

const TeacherCard = ({
  info,
  isSelected,
  onTeacherSelect,
}: {
  info: Record<string, string> | null;
  isSelected: boolean;
  onTeacherSelect: (userId: string, checked: boolean) => void;
}) => {
  const user = useCurrentUser<User>();
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
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50">
      {/* Image Container */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={info.photoBase64}
          alt={fullName}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Checkbox */}
        <div className="absolute top-3 left-3">
          <label className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg bg-white/90 shadow-sm backdrop-blur-sm transition-colors hover:bg-white">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              checked={isSelected}
              onChange={(e) => onTeacherSelect(info.userId, e.target.checked)}
            />
          </label>
        </div>

        {/* Rating Badge */}
        {/* <div className="absolute top-3 right-3">
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            <i className="fas fa-star text-amber-500"></i>
            <span className="text-slate-700">{info.rating || "0"}</span>
          </div>
        </div> */}

        {/* Name on Image */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="text-lg font-bold text-white drop-shadow-lg">
            {fullName}
          </h3>
          <p className="text-sm text-white/80">
            {info.department || "No Department"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100">
              <i className="fas fa-id-badge text-sm text-blue-600"></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Employee ID</p>
              <p className="truncate font-medium text-slate-900">
                {info.employeeId || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <i className="fas fa-clock text-sm text-emerald-600"></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-slate-500">Years of Service</p>
              <p className="truncate font-medium text-slate-900">
                {getYearsOfService(info.dateHired)}
              </p>
            </div>
          </div>
        </div>

        {/* View Profile Button */}
        {complete && (
          <button
            onClick={() => handleViewProfile()}
            disabled={isTokenGenerating}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg disabled:opacity-50"
          >
            {isTokenGenerating ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <i className="fas fa-user"></i>
                <span>View Profile</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
export default TeacherCard;

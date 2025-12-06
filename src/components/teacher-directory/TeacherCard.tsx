import { DialogDescription } from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import TeacherFullPreviewCard from "./TeacherFullPreviewCard";
import { getYearsOfService } from "@/lib/utils";

const TeacherCard = ({
  info,
  isSelected,
  onTeacherSelect,
}: {
  info: Record<string, string> | null;
  isSelected: boolean;
  onTeacherSelect: (employeeID: string, checked: boolean) => void;
}) => {
  if (info == null) return <p>This shouldn't happen, null</p>;

  const complete = info.userId != "";

  const fullName = `${info.firstName} ${info.middleName} ${info.lastName}`;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative">
        <img
          src={info.photoBase64} // Currently a link
          alt={fullName}
          className="h-48 w-full object-cover"
        />
        {/* <div className="absolute top-3 right-3">
          <span
            className={`${kvp.statusColor} rounded-full px-2 py-1 text-xs text-white`}
          >
            {kvp.status}
          </span>
        </div> */}
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

          {complete && (
            <Dialog>
              <DialogTrigger>
                <i className="fas fa-eye text-secondary-400 hover:text-secondary-600"></i>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
                <div className="border-b border-slate-200 p-2">
                  <DialogHeader>
                    <div className="flex items-center justify-between">
                      <h3 className="text-secondary-900 text-xl font-semibold">
                        Teacher Profile Preview
                      </h3>
                    </div>
                  </DialogHeader>
                </div>
                <DialogDescription></DialogDescription>
                <TeacherFullPreviewCard info={info} />
              </DialogContent>
            </Dialog>
          )}
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
        )}
      </div>
    </div>
  );
};
export default TeacherCard;

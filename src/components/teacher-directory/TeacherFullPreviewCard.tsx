import { NO_FACE_IMAGE } from "@/constants";
import { getYearsOfService } from "@/lib/utils";

const TeacherFullPreviewCard = ({ info }: { info: Record<string, string> }) => {
  if (info.photoBase64 == "") info.photoBase64 = NO_FACE_IMAGE;

  const fullName = `${info.firstName} ${info.middleName} ${info.lastName}`;
  return (
    <div className="px-3">
      <div className="mb-6 flex items-start space-x-6">
        <img
          src={info.photoBase64}
          alt="Teacher Photo"
          className="h-24 w-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h4 className="text-secondary-900 mb-1 text-xl font-semibold">
            {fullName}
          </h4>
          <p className="text-secondary-600 mb-2">{info.department}</p>
          <div className="text-secondary-600 flex items-center space-x-4 text-sm">
            <span>
              <i className="fas fa-envelope mr-1"></i> {info.emailAddress}
            </span>
            <span>
              <i className="fas fa-phone mr-1"></i> {info.mobileNumber}
            </span>
          </div>
        </div>
        <span className="bg-success-100 text-success-800 rounded-full px-3 py-1 text-sm font-medium">
          Valid
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h5 className="text-secondary-900 mb-3 font-semibold">
            Basic Information
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary-600">Employee ID:</span>
              <span className="font-medium">{info.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Department:</span>
              <span className="font-medium">{info.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Hire Date:</span>
              <span className="font-medium">{info.dateHired}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Years of Service:</span>
              <span className="font-medium">
                {getYearsOfService(info.dateHired)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h5 className="text-secondary-900 mb-3 font-semibold">
            Performance & Status
          </h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-secondary-600">Performance Rating:</span>
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
            
            {/* subject for changes */}
            <div className="flex justify-between">
              <span className="text-secondary-600">License Status:</span>
              <span className="text-success-600 font-medium">
                Valid until 2026
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">CPD Units:</span>
              <span className="font-medium">45/45 Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary-600">Last Evaluation:</span>
              <span className="font-medium">March 2025</span>
            </div>
          </div>
        </div>
      </div>
         {/* subject for changes */}



      <div className="mt-6 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          {/* <button className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-white transition-colors">
            View Full Profile
          </button> */}
          <div className="flex items-center space-x-2">
            {/* <button className="bg-secondary-100 text-secondary-700 hover:bg-secondary-200 rounded-lg px-4 py-2 transition-colors">
              <i className="fas fa-envelope mr-1"></i>
              Send Message
            </button> */}
            {/* <button className="bg-accent-100 text-accent-700 hover:bg-accent-200 rounded-lg px-4 py-2 transition-colors">
              <i className="fas fa-edit mr-1"></i>
              Edit Profile
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherFullPreviewCard;

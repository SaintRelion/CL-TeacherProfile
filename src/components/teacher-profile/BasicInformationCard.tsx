import {
  getYearsOfService,
  resizeImage,
  resolveImageSource,
} from "@/lib/utils";
import type { PersonalInformation } from "@/models/PersonalInformation";

const BasicInformationCard = ({
  myInformation,
  onProfilePicChanged,
}: {
  myInformation: PersonalInformation | undefined;
  onProfilePicChanged: (profilePic: string) => void;
}) => {
  const yearsOfService = getYearsOfService(myInformation?.dateHired ?? "");
  const fullName = myInformation 
    ? `${myInformation.firstName} ${myInformation.middleName} ${myInformation.lastName}`.trim()
    : "No Name";

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:mb-4 print:border print:border-slate-300">
      {/* Gradient Header Bar */}
      <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 print:hidden"></div>
      
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
          {/* Profile Photo Section */}
          <div className="flex flex-col items-center gap-3 print:items-start">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="profilePicInput"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const resizedBase64 = await resizeImage(file);
                onProfilePicChanged(resizedBase64);
              }}
            />
            <div className="group relative print:group-hover:scale-100">
              {/* Profile Image Container */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 opacity-20 blur-sm print:hidden"></div>
                <img
                  src={resolveImageSource(myInformation?.photoBase64)}
                  alt="Teacher Profile"
                  className="relative h-36 w-36 rounded-2xl border-4 border-white object-cover shadow-lg transition-transform duration-300 group-hover:scale-[1.02] md:h-44 md:w-44 print:h-32 print:w-32 print:border-2 print:border-slate-300 print:shadow-none"
                />
                {/* Status Badge */}
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-md print:hidden">
                  <i className="fas fa-check text-xs text-white"></i>
                </div>
              </div>
              {/* Hover Overlay */}
              <label
                htmlFor="profilePicInput"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-slate-900/60 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 print:hidden"
                title="Change Photo"
              >
                <div className="flex flex-col items-center gap-1 text-white">
                  <i className="fas fa-camera text-2xl"></i>
                  <span className="text-xs font-medium">Change Photo</span>
                </div>
              </label>
            </div>
            {/* Change Photo Link */}
            <label
              htmlFor="profilePicInput"
              className="group/link flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 print:hidden"
              title="Click to upload a new profile photo"
            >
              <i className="fas fa-camera text-xs"></i>
              <span className="border-b border-transparent group-hover/link:border-blue-600">Change Photo</span>
            </label>
          </div>

          {/* Profile Info Section */}
          <div className="flex-1 text-center md:text-left print:text-left">
            {/* Name and Status */}
            <div className="mb-4">
              <div className="flex flex-col items-center gap-3 md:flex-row md:items-center print:flex-row">
                <h3 className="text-secondary-900 text-2xl font-bold tracking-tight md:text-3xl print:text-xl">
                  {fullName}
                </h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 ring-1 ring-inset ring-green-600/20 print:bg-transparent print:text-green-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 print:hidden"></span>
                  Active
                </span>
              </div>
              <p className="text-secondary-500 mt-1.5 text-lg font-medium">
                {myInformation?.position || "No position specified"}
              </p>
            </div>

            {/* Quick Info Cards */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
              {/* Employee ID */}
              <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 transition-all duration-200 hover:from-blue-50 hover:to-blue-100/50 print:bg-transparent print:p-2 print:border print:border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-colors group-hover:bg-blue-100 print:hidden">
                    <i className="fas fa-id-badge text-slate-400 group-hover:text-blue-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400 print:text-slate-600">
                      Employee ID
                    </p>
                    <p className="text-secondary-900 text-base font-semibold print:text-sm">
                      {myInformation?.employeeId || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Department */}
              <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 transition-all duration-200 hover:from-purple-50 hover:to-purple-100/50 print:bg-transparent print:p-2 print:border print:border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-colors group-hover:bg-purple-100 print:hidden">
                    <i className="fas fa-building text-slate-400 group-hover:text-purple-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400 print:text-slate-600">
                      Department
                    </p>
                    <p className="text-secondary-900 text-base font-semibold print:text-sm">
                      {myInformation?.department || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Years of Service */}
              <div className="group rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 transition-all duration-200 hover:from-amber-50 hover:to-amber-100/50 print:bg-transparent print:p-2 print:border print:border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm transition-colors group-hover:bg-amber-100 print:hidden">
                    <i className="fas fa-award text-slate-400 group-hover:text-amber-500"></i>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400 print:text-slate-600">
                      Years of Service
                    </p>
                    <p className="text-secondary-900 text-base font-semibold print:text-sm">
                      {yearsOfService}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Quick Stats - Print Only */}
            <div className="hidden print:mt-4 print:grid print:grid-cols-2 print:gap-2">
              <div className="border border-slate-200 p-2 rounded">
                <p className="text-xs text-slate-600">Date Hired</p>
                <p className="text-sm font-medium">{myInformation?.dateHired || "—"}</p>
              </div>
              <div className="border border-slate-200 p-2 rounded">
                <p className="text-xs text-slate-600">Employment Status</p>
                <p className="text-sm font-medium">{myInformation?.employmentStatus || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInformationCard;

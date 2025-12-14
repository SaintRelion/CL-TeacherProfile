import {
  getYearsOfService,
  resizeImage,
  resolveImageSource,
} from "@/lib/utils";
import type { PersonalInformation } from "@/models/personal-information";

const BasicInformationCard = ({
  myInformation,
  onProfilePicChanged,
}: {
  myInformation: PersonalInformation | undefined;
  onProfilePicChanged: (profilePic: string) => void;
}) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-start space-x-6">
   {/* Profile Photo Section */}
        <div className="flex flex-col items-center gap-4">
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
          <div className="group relative">
            <img
              src={resolveImageSource(myInformation?.photoBase64)}
              alt="Teacher Profile"
              className="h-40 w-40 rounded-2xl border-4 border-slate-100 object-cover shadow-md transition-transform duration-200 group-hover:scale-105"
            />
            <label
              htmlFor="profilePicInput"
              className="bg-accent-500 hover:bg-accent-600 absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-90"
            >
              <i className="fas fa-camera text-2xl text-white"></i>
            </label>
          </div>
          <label
            htmlFor="profilePicInput"
            className="text-primary-600 hover:text-primary-700 cursor-pointer text-sm font-semibold"
          >
            Change Photo
          </label>
        </div>

          <div className="flex-1">
            <div className="mb-2 flex items-center space-x-3">
              <h3 className="text-secondary-900 text-2xl font-bold">
                {myInformation != undefined
                  ? `${myInformation.firstName} ${myInformation.middleName} ${myInformation.lastName}`
                  : "No Name"}
              </h3>
              <span className="bg-success-100 text-success-700 rounded-full px-3 py-1 text-sm font-medium">
           Active
              </span>
            </div>
            <p className="text-secondary-600 mb-3 text-lg">
              {myInformation != undefined
                ? myInformation.position
                : "No position"}
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-secondary-700 text-sm font-medium">
                  Employee ID
                </p>
                <p className="text-secondary-900">
                  {myInformation?.employeeId}
                </p>
              </div>
              <div>
                <p className="text-secondary-700 text-sm font-medium">
                  Department
                </p>
                <p className="text-secondary-900">
                  {myInformation?.department}
                </p>
              </div>
              <div>
                <p className="text-secondary-700 text-sm font-medium">
                  Years of Service
                </p>
                <p className="text-secondary-900">
                  {getYearsOfService(myInformation?.dateHired ?? "")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInformationCard;

import type { PersonalInformation } from "@/models/personal-information";

const BasicInformationCard = ({
  myInformation,
}: {
  myInformation: PersonalInformation | undefined;
}) => {
  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-start space-x-6">
          <div className="flex-shrink-0">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Teacher Profile"
                className="border-primary-100 h-32 w-32 rounded-xl border-4 object-cover"
              />
              <button className="bg-accent-500 hover:bg-accent-600 absolute -right-2 -bottom-2 rounded-full p-2 text-white transition-colors">
                <i className="fas fa-camera text-sm"></i>
              </button>
            </div>
            <button className="text-primary-600 hover:text-primary-700 mt-3 w-full text-sm font-medium">
              Change Photo
            </button>
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
                <p className="text-secondary-900">TCH-2024-0156</p>
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
                <p className="text-secondary-900">12 years</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default BasicInformationCard;

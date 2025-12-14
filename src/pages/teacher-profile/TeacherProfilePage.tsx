import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";
import { NO_FACE_IMAGE } from "@/constants";
import { type PersonalInformation } from "@/models/personal-information";
import { useAuth, useUpdateUser } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { RenderForm, RenderFormButton } from "@saintrelion/forms";

import { useState } from "react";

const TeacherProfilePage = () => {
  const { user } = useAuth();

  const [tabSelected, setTabSelected] = useState<"personal" | "documents">(
    "personal",
  );

  const updateUser = useUpdateUser();
  const {
    useSelect: informationSelect,
    useInsert: informationInsert,
    useUpdate: informationUpdate,
  } = useDBOperationsLocked<PersonalInformation>("PersonalInformation",  false, false);

  const { data: informations } = informationSelect({
    firebaseOptions: {
      filterField: "userId",
      value: user.id,
    },
  });

  const [selectedProfilePic, setSelectedProfilePic] = useState<string>("");

  const myInformation = informations != null ? informations[0] : undefined;
  if (myInformation != null) {
    if (selectedProfilePic != "")
      myInformation.photoBase64 = selectedProfilePic;
    else if (myInformation.photoBase64 == "")
      myInformation.photoBase64 = NO_FACE_IMAGE;
  }

  const handleInformationSaveChanges = (data: Record<string, string>) => {
    data.userId = user.id;
    if (selectedProfilePic != "") data.photoBase64 = selectedProfilePic;
    console.log(data);

    if (myInformation == undefined) {
      if (selectedProfilePic == "") data.photoBase64 = "";
      informationInsert.run(data);
    } else {
      informationUpdate.run({
        field: "userId",
        value: user.id,
        updates: data,
      });
    }

    if (data.emailAddress) {
      updateUser.run({ userId: user.id, info: { email: data.emailAddress } });
    }
  };

  return (
    <RenderForm>
      <div className="font-inter bg-slate-50">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-secondary-900 text-2xl font-bold">
                  Teacher Profile Management
                </h2>
                <p className="text-secondary-600 mt-1">
                  Manage comprehensive teacher profiles and documentation
                </p>
              </div>
              <RenderFormButton
                onSubmit={handleInformationSaveChanges}
                buttonLabel="Save Changes"
                buttonClassName="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-2 text-white transition-colors"
              />
            </div>
          </div>

          <BasicInformationCard
            myInformation={myInformation}
            onProfilePicChanged={(value) => setSelectedProfilePic(value)}
          />

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {/* Personal */}
                <button
                  onClick={() => setTabSelected("personal")}
                  className={`tab-button flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
                    tabSelected === "personal"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <i className="fas fa-user mr-2"></i>
                  Personal Information
                </button>

                {/* Documents */}
                <button
                  onClick={() => setTabSelected("documents")}
                  className={`tab-button flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
                    tabSelected === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  <i className="fas fa-folder mr-2"></i>
                  Documents
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* PERSONAL INFORMATION */}
              {tabSelected == "personal" && (
                <PersonalInformationForm myInformation={myInformation} />
              )}

              {/* DOCUMENTS */}
              {tabSelected == "documents" && <DocumentsTab />}
            </div>
          </div>
        </div>
      </div>
    </RenderForm>
  );
};
export default TeacherProfilePage;

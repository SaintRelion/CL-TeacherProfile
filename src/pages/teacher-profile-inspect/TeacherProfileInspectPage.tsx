import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";
import { NO_FACE_IMAGE } from "@/constants";
import { type PersonalInformation } from "@/models/PersonalInformation";
import {
  useUpdateUser,
  validateImpersonationToken,
} from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import { RenderForm, RenderFormButton } from "@saintrelion/forms";

import { useEffect, useState } from "react";

const TeacherProfileInspectPage = () => {
  const [tokenStatus, setTokenStatus] = useState<string>("");
  const [inspectUserId, setInspectUserId] = useState<string | null>(null);

  const [tabSelected, setTabSelected] = useState<"personal" | "documents">(
    "personal",
  );

  const updateUser = useUpdateUser();
  const {
    useSelect: informationSelect,
    useInsert: informationInsert,
    useUpdate: informationUpdate,
  } = useDBOperationsLocked<PersonalInformation>(
    "PersonalInformation",
    false,
    false,
  );

  const { data: informations } = informationSelect({
    firebaseOptions: {
      filterField: "userId",
      value: inspectUserId == null ? "-1" : inspectUserId,
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
    if (inspectUserId == null) return;

    data.userId = inspectUserId;
    if (selectedProfilePic != "") data.photoBase64 = selectedProfilePic;
    console.log(data);

    if (myInformation == undefined) {
      if (selectedProfilePic == "") data.photoBase64 = "";
      informationInsert.run(data);
    } else {
      informationUpdate.run({
        field: "userId",
        value: inspectUserId,
        updates: data,
      });
    }

    if (data.emailAddress) {
      updateUser.run({
        userId: inspectUserId,
        info: { email: data.emailAddress },
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const teacherId = params.get("teacherId");

      if (token) {
        try {
          const targetUserId = await validateImpersonationToken(token);
          setInspectUserId(targetUserId);
        } catch {
          setTokenStatus("expired");
        }
      } else if (teacherId) {
        // Direct teacher ID from dashboard
        setInspectUserId(teacherId);
        setTokenStatus("direct");
      } else {
        setTokenStatus("none");
      }
    };

    fetchUser();
  }, []);

  if (tokenStatus == "expired")
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <i className="fas fa-clock text-3xl text-red-500"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Session Expired</h2>
          <p className="mt-2 text-slate-500">Your inspection token has expired. Please request a new one.</p>
          <a href="/teacher-directory" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
            <i className="fas fa-arrow-left"></i>
            Back to Directory
          </a>
        </div>
      </div>
    );
  else if (tokenStatus == "none") return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
          <i className="fas fa-key text-3xl text-amber-500"></i>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Access Token</h2>
        <p className="mt-2 text-slate-500">Please access this page from the Teacher Directory.</p>
        <a href="/teacher-directory" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
          <i className="fas fa-arrow-left"></i>
          Go to Directory
        </a>
      </div>
    </div>
  );

  return (
    <RenderForm>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <a href="/teacher-directory" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50">
                    <i className="fas fa-arrow-left text-sm"></i>
                  </a>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    Admin View
                  </span>
                </div>
                <h1 className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                  Teacher Profile Inspection
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Viewing and editing teacher profile as administrator
                </p>
              </div>
              <RenderFormButton
                onSubmit={handleInformationSaveChanges}
                isDisabled={
                  informationInsert.isLocked || informationUpdate.isLocked
                }
                buttonLabel="Save Changes"
                buttonClassName="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-lg shadow-emerald-500/25 transition-all hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
              />
            </div>
          </div>

          <BasicInformationCard
            myInformation={myInformation}
            onProfilePicChanged={(value) => setSelectedProfilePic(value)}
          />

          {/* Tabs Card */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
              <nav className="flex gap-1 px-4" aria-label="Tabs">
                {/* Personal Tab */}
                <button
                  onClick={() => setTabSelected("personal")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                    tabSelected === "personal"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <i className={`fas fa-user ${tabSelected === "personal" ? "text-blue-500" : "text-slate-400"}`}></i>
                  Personal Information
                </button>

                {/* Documents Tab */}
                <button
                  onClick={() => setTabSelected("documents")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                    tabSelected === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <i className={`fas fa-folder ${tabSelected === "documents" ? "text-blue-500" : "text-slate-400"}`}></i>
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
              {tabSelected == "documents" && inspectUserId != null && (
                <DocumentsTab userId={inspectUserId} />
              )}
            </div>
          </div>
        </div>
      </div>
    </RenderForm>
  );
};
export default TeacherProfileInspectPage;

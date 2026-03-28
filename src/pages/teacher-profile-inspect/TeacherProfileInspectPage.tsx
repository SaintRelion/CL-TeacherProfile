import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";
import PDSWorkspace from "@/components/teacher-profile/PDSWorkspace";
import { NO_FACE_IMAGE } from "@/constants";
import {
  type CreatePersonalInformation,
  type PersonalInformation,
} from "@/models/PersonalInformation";
import type { UpdateUser } from "@/models/user";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { RenderForm, RenderFormButton } from "@saintrelion/forms";

import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const TeacherProfileInspectPage = () => {
  const [searchParams] = useSearchParams();
  const teacher = searchParams.get("teacher");

  const [tabSelected, setTabSelected] = useState<
    "personal" | "documents" | "pds"
  >("personal");

  const { useUpdate: updateUser } = useResourceLocked<never, never, UpdateUser>(
    "user",
  );

  const {
    useList: getInformation,
    useInsert: insertInformation,
    useUpdate: updateInformation,
  } = useResourceLocked<
    PersonalInformation,
    CreatePersonalInformation,
    CreatePersonalInformation
  >("inspect_personalinformation");

  const informations = getInformation({
    filters: {
      user: teacher,
    },
  }).data;

  const [selectedProfilePic, setSelectedProfilePic] = useState<string>("");

  const myInformation = informations.length > 0 ? informations[0] : null;
  if (myInformation != null) {
    if (selectedProfilePic != "")
      myInformation.photo_base64 = selectedProfilePic;
    else if (myInformation.photo_base64 == "")
      myInformation.photo_base64 = NO_FACE_IMAGE;
  }

  const handleInformationSaveChanges = (data: Record<string, string>) => {
    if (teacher == null) return;

    data.userId = teacher;
    if (selectedProfilePic != "") data.photo_base64 = selectedProfilePic;

    if (myInformation == undefined) {
      if (selectedProfilePic == "") data.photo_base64 = "";

      insertInformation.run({
        user: teacher,
        employee_id: data.employee_id,
        photo_base64: data.photo_base64,
        first_name: data.first_name,
        last_name: data.last_name,
        middle_name: data.middle_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        civil_status: data.civil_status,
        email: data.email,
        mobile_number: data.mobile_number,
        home_address: data.home_address,
        position: data.position,
        department: data.department,
        employment_status: data.employment_status,
        date_hired: data.date_hired,
        salary_grade: data.salary_grade,
        tin: data.tin,
      });
    } else {
      updateInformation.run({
        id: myInformation.id,
        payload: data,
      });
    }

    if (data.emailAddress) {
      updateUser.run({
        id: teacher,
        payload: { email: data.email },
      });
    }
  };

  return (
    <RenderForm>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <a
                    href="/admin/teacherdirectory"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50"
                  >
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
                  insertInformation.isLocked || updateInformation.isLocked
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
                  type="button"
                  onClick={() => setTabSelected("personal")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                    tabSelected === "personal"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <i
                    className={`fas fa-user ${tabSelected === "personal" ? "text-blue-500" : "text-slate-400"}`}
                  ></i>
                  Personal Information
                </button>

                {/* Documents Tab */}
                <button
                  type="button"
                  onClick={() => setTabSelected("documents")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                    tabSelected === "documents"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                  >
                    <i
                      className={`fas fa-folder ${tabSelected === "documents" ? "text-blue-500" : "text-slate-400"}`}
                    ></i>
                    Documents
                </button>

                <button
                  type="button"
                  onClick={() => setTabSelected("pds")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-4 text-sm font-medium transition-all ${
                    tabSelected === "pds"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <i
                    className={`fas fa-id-card-alt ${tabSelected === "pds" ? "text-blue-500" : "text-slate-400"}`}
                  ></i>
                  PDS
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* PERSONAL INFORMATION */}
              {tabSelected == "personal" && (
                <PersonalInformationForm myInformation={myInformation} />
              )}

              {/* DOCUMENTS */}
              {tabSelected == "documents" && teacher != null && (
                <DocumentsTab userId={teacher} />
              )}

              {/* PDS */}
              {tabSelected == "pds" && (
                <PDSWorkspace
                  myInformation={myInformation}
                  userId={teacher ?? "inspect"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </RenderForm>
  );
};
export default TeacherProfileInspectPage;

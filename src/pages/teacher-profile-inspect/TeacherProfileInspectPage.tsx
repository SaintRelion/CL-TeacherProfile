import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import { PDSWorkspace } from "@/components/teacher-profile/PDSWorkspace";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";
import { NO_FACE_IMAGE } from "@/constants";
import {
  type CreatePersonalInformation,
  type PersonalInformation,
} from "@/models/PersonalInformation";
import type { UpdateUser, User } from "@/models/user";
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

  const { useRetrieve: getUser, useUpdate: updateUser } = useResourceLocked<
    User,
    never,
    UpdateUser
  >("user");

  const {
    useList: getInformation,
    useInsert: insertInformation,
    useUpdate: updateInformation,
  } = useResourceLocked<
    PersonalInformation,
    CreatePersonalInformation,
    CreatePersonalInformation
  >("inspect_personalinformation");

  const teacherInstance = teacher ? getUser(teacher).data : undefined;
  const informations = getInformation({
    filters: {
      user: teacher,
    },
  }).data;

  const [selectedProfilePic, setSelectedProfilePic] = useState<string>("");

  const teacherInformation =
    informations && informations.length > 0 ? informations[0] : null;
  if (teacherInformation != null) {
    if (selectedProfilePic != "")
      teacherInformation.photo_base64 = selectedProfilePic;
    else if (teacherInformation.photo_base64 == "")
      teacherInformation.photo_base64 = NO_FACE_IMAGE;
  }

  const handleInformationSaveChanges = (data: Record<string, string>) => {
    if (teacher == null) return;

    data.userId = teacher;
    if (selectedProfilePic != "") data.photo_base64 = selectedProfilePic;

    if (teacherInformation == undefined) {
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
        id: teacherInformation.id,
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
    <div className="font-inter min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-50 to-slate-100">
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
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="print:hidden">
          <BasicInformationCard
            myInformation={teacherInformation}
            onProfilePicChanged={(value) => setSelectedProfilePic(value)}
          />

          {/* Tabs Container */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
            {/* Tab Navigation */}
            <div className="border-b border-slate-200 bg-slate-50/50 print:hidden">
              <nav className="flex gap-1 px-4 pt-2" aria-label="Tabs">
                {/* Personal Tab */}
                <button
                  type="button"
                  onClick={() => setTabSelected("personal")}
                  className={`group relative flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                    tabSelected === "personal"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      tabSelected === "personal"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                    }`}
                  >
                    <i className="fas fa-user text-sm"></i>
                  </div>
                  <span>Personal Information</span>
                  {tabSelected === "personal" && (
                    <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>

                {/* Documents Tab */}
                <button
                  type="button"
                  onClick={() => setTabSelected("documents")}
                  className={`group relative flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                    tabSelected === "documents"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      tabSelected === "documents"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                    }`}
                  >
                    <i className="fas fa-folder-open text-sm"></i>
                  </div>
                  <span>Documents</span>
                  {tabSelected === "documents" && (
                    <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setTabSelected("pds")}
                  className={`group relative flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-medium transition-all duration-200 ${
                    tabSelected === "pds"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      tabSelected === "pds"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500"
                    }`}
                  >
                    <i className="fas fa-id-card-alt text-sm"></i>
                  </div>
                  <span>PDS</span>
                  {tabSelected === "pds" && (
                    <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-blue-500"></div>
                  )}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 md:p-8">
              {tabSelected === "pds" && teacherInstance ? (
                <PDSWorkspace user={teacherInstance} />
              ) : (
                <RenderForm>
                  {tabSelected === "personal" && (
                    <>
                      <PersonalInformationForm
                        myInformation={teacherInformation}
                      />
                      <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end print:hidden">
                        <div className="group relative flex w-fit items-center justify-end">
                          {/* 1. THE TOOLTIP (Visual Only) */}
                          <div className="pointer-events-none absolute right-full mr-4 translate-x-4 scale-90 whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
                            <div className="rounded-xl bg-slate-900 px-5 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl ring-1 ring-white/10">
                              Update Teacher Profile
                            </div>
                          </div>

                          {/* 2. THE RENDERFORM BUTTON (The Actual Trigger) */}
                          <RenderFormButton
                            onSubmit={handleInformationSaveChanges}
                            isDisabled={
                              insertInformation.isLocked ||
                              updateInformation.isLocked
                            }
                            /* Passing the Unicode character for 'Save' directly as a string */
                            buttonLabel={"\uf0c7"}
                            buttonClassName={`
                              flex h-14 w-14 items-center justify-center rounded-full 
                              bg-white border-2 border-blue-100 text-blue-600 shadow-xl 
                              transition-all duration-300 animate-bounce-subtle
                              
                              /* Force FontAwesome styling on the label string */
                              font-['Font_Awesome_5_Free'] font-900 text-xl
                              
                              hover:border-blue-500 hover:bg-blue-50 hover:shadow-blue-500/20 hover:animate-none
                              active:scale-90 outline-none ring-0
                              
                              disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400
                            `}
                          />
                        </div>

                        <style>{`
                          @keyframes bounce-subtle {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-8px); }
                          }
                          .animate-bounce-subtle {
                            animation: bounce-subtle 3s ease-in-out infinite;
                          }
                        `}</style>
                      </div>
                    </>
                  )}
                  {tabSelected === "documents" && teacher && (
                    <DocumentsTab userId={teacher} />
                  )}
                </RenderForm>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherProfileInspectPage;

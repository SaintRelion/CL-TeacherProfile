import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";
import PDSPrintView from "@/components/teacher-profile/PDSPrintView";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { NO_FACE_IMAGE } from "@/constants";
import { resolveImageSource, getYearsOfService } from "@/lib/utils";
import type { CreateNotification } from "@/models/Notification";
import {
  type CreatePersonalInformation,
  type PersonalInformation,
} from "@/models/PersonalInformation";
import { useAuth, useCurrentUser } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import { RenderForm, RenderFormButton } from "@saintrelion/forms";

import { useState, useRef } from "react";
import type { User, UpdateUser } from "@/models/user";
import { toast } from "@saintrelion/notifications";

const TeacherProfilePage = () => {
  const user = useCurrentUser<User>();
  const auth = useAuth();
  const printRef = useRef<HTMLDivElement>(null);

  const [selectedProfilePic, setSelectedProfilePic] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [tabSelected, setTabSelected] = useState<"personal" | "documents">(
    "personal",
  );

  const { useUpdate: updateUser } = useResourceLocked<never, never, UpdateUser>(
    "user",
    { showToast: false },
  );

  const {
    useList: getInformation,
    useInsert: insertInformation,
    useUpdate: updateInformation,
  } = useResourceLocked<
    PersonalInformation,
    CreatePersonalInformation,
    CreatePersonalInformation
  >("personalinformation", { showToast: false });

  const informations = getInformation({
    filters: { user: user.id },
  }).data;

  const myInformation = informations.length > 0 ? informations[0] : null;
  if (myInformation != null) {
    if (selectedProfilePic != "")
      myInformation.photo_base64 = selectedProfilePic;
    else if (myInformation.photo_base64 == "")
      myInformation.photo_base64 = NO_FACE_IMAGE;
  }

  const { useInsert: insertNotification } = useResourceLocked<
    never,
    CreateNotification
  >("notification", { showToast: false });

  const handleInformationSaveChanges = async (data: Record<string, string>) => {
    try {
      data.user = user.id;
      if (selectedProfilePic != "") data.photo_base64 = selectedProfilePic;
      console.log(data);

      if (myInformation == undefined) {
        if (selectedProfilePic == "") data.photo_base64 = "";
        await insertInformation.run({
          user: user.id,
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

        await insertNotification.run({
          user: user.id,
          type: "profileNew",
          title: "New teacher profile created",
          description: `${data.first_name} ${data.middle_name} ${data.last_name} - ${data.department} Department`,
          is_read: false
        });
      } else {
        updateInformation.run({
          id: myInformation.id,
          payload: data,
        });

        await insertNotification.run({
          user: user.id,
          type: "profileUpdate",
          title: "Profile updated",
          description: `${data.fist_name} ${data.middle_name} ${data.last_name}`,
          is_read: false
        });
      }

      if (data.email) {
        await updateUser.run({
          id: user.id,
          payload: { email: data.email },
        });

        await auth.refreshUser();
      }

      toast.success("Profile Updated");
    } catch (err) {
      const error = err as Record<string, string>;
      console.log(error);
      toast.error("Something went wrong updating profile");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <RenderForm>
      <div className="font-inter min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="mb-8 print:hidden">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25">
                    <i className="fas fa-user-tie text-lg text-white"></i>
                  </div>
                  <div>
                    <h2 className="text-secondary-900 text-2xl font-bold tracking-tight md:text-3xl">
                      Teacher Profile Management
                    </h2>
                    <p className="text-secondary-500 mt-0.5 text-sm md:text-base">
                      Manage comprehensive teacher profiles and documentation
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* Profile Quick View Drawer Button */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button
                      className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                      title="Quick View Profile"
                    >
                      <i className="fas fa-id-card text-slate-500 transition-colors group-hover:text-blue-500"></i>
                      <span className="hidden sm:inline">Quick View</span>
                    </button>
                  </DrawerTrigger>
                  <DrawerContent side="right">
                    <DrawerHeader>
                      <div>
                        <DrawerTitle>Profile Summary</DrawerTitle>
                        <DrawerDescription>
                          Quick overview of your profile
                        </DrawerDescription>
                      </div>
                      <DrawerClose />
                    </DrawerHeader>
                    <DrawerBody>
                      {/* Profile Summary in Drawer */}
                      <div className="space-y-6">
                        {/* Profile Photo & Name */}
                        <div className="flex flex-col items-center text-center">
                          <div className="relative mb-4">
                            <img
                              src={resolveImageSource(
                                myInformation?.photo_base64 || NO_FACE_IMAGE,
                              )}
                              alt="Profile"
                              className="h-24 w-24 rounded-2xl border-4 border-slate-100 object-cover shadow-lg"
                            />
                            <div className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500">
                              <i className="fas fa-check text-xs text-white"></i>
                            </div>
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">
                            {myInformation
                              ? `${myInformation.first_name} ${myInformation.last_name}`
                              : "No Name"}
                          </h3>
                          <p className="text-slate-500">
                            {myInformation?.position || "No position"}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                            Active
                          </span>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="rounded-xl bg-blue-50 p-4 text-center">
                            <i className="fas fa-id-badge mb-2 text-2xl text-blue-500"></i>
                            <p className="text-xs font-medium text-blue-600 uppercase">
                              Employee ID
                            </p>
                            <p className="font-bold text-slate-900">
                              {myInformation?.employee_id || "—"}
                            </p>
                          </div>
                          <div className="rounded-xl bg-purple-50 p-4 text-center">
                            <i className="fas fa-building mb-2 text-2xl text-purple-500"></i>
                            <p className="text-xs font-medium text-purple-600 uppercase">
                              Department
                            </p>
                            <p className="font-bold text-slate-900">
                              {myInformation?.department || "—"}
                            </p>
                          </div>
                          <div className="rounded-xl bg-amber-50 p-4 text-center">
                            <i className="fas fa-award mb-2 text-2xl text-amber-500"></i>
                            <p className="text-xs font-medium text-amber-600 uppercase">
                              Years of Service
                            </p>
                            <p className="font-bold text-slate-900">
                              {getYearsOfService(
                                myInformation?.date_hired ?? "",
                              )}
                            </p>
                          </div>
                          <div className="rounded-xl bg-emerald-50 p-4 text-center">
                            <i className="fas fa-briefcase mb-2 text-2xl text-emerald-500"></i>
                            <p className="text-xs font-medium text-emerald-600 uppercase">
                              Status
                            </p>
                            <p className="font-bold text-slate-900">
                              {myInformation?.employment_status || "—"}
                            </p>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="rounded-xl border border-slate-200 p-4">
                          <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-900">
                            <i className="fas fa-address-book text-slate-400"></i>
                            Contact Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <i className="fas fa-envelope text-sm text-slate-500"></i>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Email</p>
                                <p className="text-sm font-medium text-slate-700">
                                  {myInformation?.email || "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <i className="fas fa-phone text-sm text-slate-500"></i>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">Mobile</p>
                                <p className="text-sm font-medium text-slate-700">
                                  {myInformation?.mobile_number || "—"}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                <i className="fas fa-map-marker-alt text-sm text-slate-500"></i>
                              </div>
                              <div>
                                <p className="text-xs text-slate-400">
                                  Address
                                </p>
                                <p className="line-clamp-2 text-sm font-medium text-slate-700">
                                  {myInformation?.home_address || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                          <h4 className="flex items-center gap-2 font-semibold text-slate-900">
                            <i className="fas fa-bolt text-amber-500"></i>
                            Quick Actions
                          </h4>
                          <button
                            onClick={() => {
                              setTabSelected("personal");
                              setDrawerOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                              <i className="fas fa-user-edit"></i>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                Edit Personal Info
                              </p>
                              <p className="text-xs text-slate-500">
                                Update your details
                              </p>
                            </div>
                            <i className="fas fa-chevron-right ml-auto text-slate-300"></i>
                          </button>
                          <button
                            onClick={() => {
                              setTabSelected("documents");
                              setDrawerOpen(false);
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-50"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                              <i className="fas fa-folder-open"></i>
                            </div>
                            <div>
                              <p className="font-medium text-slate-800">
                                View Documents
                              </p>
                              <p className="text-xs text-slate-500">
                                Manage your files
                              </p>
                            </div>
                            <i className="fas fa-chevron-right ml-auto text-slate-300"></i>
                          </button>
                        </div>
                      </div>
                    </DrawerBody>
                    <DrawerFooter>
                      <button
                        onClick={() => setDrawerOpen(false)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          handlePrint();
                          setDrawerOpen(false);
                        }}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-blue-700"
                      >
                        <i className="fas fa-print"></i>
                        Print Profile
                      </button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  className="group relative flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
                  title="Print Teacher Profile"
                >
                  <i className="fas fa-print text-slate-500 transition-colors group-hover:text-blue-500"></i>
                  <span className="hidden sm:inline">Print Profile</span>
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 rounded-lg bg-slate-900 px-3 py-1.5 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    Print teacher profile (A4)
                  </span>
                </button>

                {/* Save Changes Button */}
                <RenderFormButton
                  onSubmit={handleInformationSaveChanges}
                  isDisabled={
                    insertInformation.isLocked ||
                    updateInformation.isLocked ||
                    updateUser.isLocked ||
                    insertNotification.isLocked
                  }
                  buttonLabel="Save Changes"
                  buttonClassName="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div ref={printRef} className="print:hidden">
            <BasicInformationCard
              myInformation={myInformation}
              onProfilePicChanged={(value) => setSelectedProfilePic(value)}
            />

            {/* Tabs Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
              {/* Tab Navigation */}
              <div className="border-b border-slate-200 bg-slate-50/50 print:hidden">
                <nav className="flex gap-1 px-4 pt-2" aria-label="Tabs">
                  {/* Personal Tab */}
                  <button
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
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {/* PERSONAL INFORMATION */}
                {tabSelected == "personal" && (
                  <PersonalInformationForm myInformation={myInformation} />
                )}

                {/* DOCUMENTS */}
                {tabSelected == "documents" && (
                  <DocumentsTab userId={user.id} />
                )}
              </div>
            </div>
          </div>

          {/* PDS Print View - Only visible when printing */}
          <PDSPrintView myInformation={myInformation} />
        </div>
      </div>
    </RenderForm>
  );
};
export default TeacherProfilePage;

import BasicInformationCard from "@/components/teacher-profile/BasicInformationCard";
import DocumentsTab from "@/components/teacher-profile/DocumentsTab";
import PersonalInformationForm from "@/components/teacher-profile/PersonalInformationForm";

import { useState } from "react";

const TeacherProfilePage = () => {
  const [tabSelected, setTabSelected] = useState<"personal" | "documents">(
    "personal",
  );

  return (
    <>
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
              <button className="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-2 text-white transition-colors">
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>

          <BasicInformationCard />

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
                  data-tab="personal"
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
                  data-tab="documents"
                >
                  <i className="fas fa-folder mr-2"></i>
                  Documents
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* PERSONAL INFORMATION */}
              {tabSelected == "personal" && <PersonalInformationForm />}

              {/* DOCUMENTS */}
              {tabSelected == "documents" && <DocumentsTab />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TeacherProfilePage;

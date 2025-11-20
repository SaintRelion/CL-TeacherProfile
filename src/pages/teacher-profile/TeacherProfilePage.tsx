import CertificationAndLicensesCard from "@/components/teacher-profile/CertificationAndLicensesCard";
import { useState } from "react";

interface Certification {
  name: string;
  expiryDuration: number;
  records: Record<string, string>;
}

const TeacherProfilePage = () => {
  const [tabSelected, setTabSelected] = useState<
    "personal" | "certifications" | "documents"
  >("personal");

  const cerli: Certification[] = [
    {
      name: "Professional Teaching License",
      expiryDuration: -1,
      records: {
        "License Number": "PRC-123456789",
        "Issue Date": "June 15, 2012",
        "Expiry Date": "June 15, 2027",
      },
    },
    {
      name: "CPD Certificate - Advanced Mathematics",
      expiryDuration: -1,
      records: {
        "Certificate Number": "CPD-2023-MAT-456",
        "Issue Date": "January 10, 2023",
        "Expiry Date": "January 10, 2026",
      },
    },
    {
      name: "CPD Certificate - Educational Leadership",
      expiryDuration: -1,
      records: {
        "Certificate Number": "CPD-2022-LEAD-789",
        "Issue Date": "August 20, 2022",
        "Expiry Date": "August 20, 2025",
      },
    },
    {
      name: "First Aid and CPR Training",
      expiryDuration: 36, // in months (3 years)
      records: {
        "Certificate Number": "FA-2023-CPR-334",
        "Issue Date": "April 15, 2023",
        "Expiry Date": "April 15, 2026",
      },
    },
    {
      name: "TESOL Certification",
      expiryDuration: 60, // 5 years
      records: {
        "Certificate Number": "TESOL-2019-ENG-902",
        "Issue Date": "July 30, 2019",
        "Expiry Date": "July 30, 2024",
      },
    },
    {
      name: "Child Protection Training",
      expiryDuration: 24, // 2 years
      records: {
        "Certificate Number": "CPT-2024-SAFE-102",
        "Issue Date": "February 5, 2024",
        "Expiry Date": "February 5, 2026",
      },
    },
    {
      name: "Microsoft Certified Educator (MCE)",
      expiryDuration: 48,
      records: {
        "Certificate Number": "MCE-2020-TECH-321",
        "Issue Date": "November 12, 2020",
        "Expiry Date": "November 12, 2024",
      },
    },
    {
      name: "National Educators’ Conference Attendance",
      expiryDuration: -1,
      records: {
        "Certificate Number": "CONF-2023-EDU-555",
        "Issue Date": "March 18, 2023",
        "Expiry Date": "N/A",
      },
    },
  ];

  return (
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
            <div className="flex items-center space-x-3">
              <button className="bg-secondary-600 hover:bg-secondary-700 rounded-lg px-4 py-2 text-white transition-colors">
                <i className="fas fa-print mr-2"></i>
                Print Profile
              </button>
              <button className="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-2 text-white transition-colors">
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </button>
            </div>
          </div>
        </div>

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
                    Dr. Elena Rodriguez
                  </h3>
                  <span className="bg-success-100 text-success-700 rounded-full px-3 py-1 text-sm font-medium">
                    Active
                  </span>
                </div>
                <p className="text-secondary-600 mb-3 text-lg">
                  Senior Mathematics Teacher
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
                    <p className="text-secondary-900">Mathematics</p>
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

              {/* Certifications */}
              <button
                onClick={() => setTabSelected("certifications")}
                className={`tab-button flex items-center border-b-2 px-1 py-4 text-sm font-medium ${
                  tabSelected === "certifications"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
                data-tab="certifications"
              >
                <i className="fas fa-certificate mr-2"></i>
                Certifications
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
            {tabSelected == "personal" && (
              <div id="personal-tab" className="tab-content">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <div>
                    <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
                      Basic Information
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-secondary-700 mb-2 block text-sm font-medium">
                            First Name
                          </label>
                          <input type="text" value="" className="input-field" />
                        </div>
                        <div>
                          <label className="text-secondary-700 mb-2 block text-sm font-medium">
                            Last Name
                          </label>
                          <input type="text" value="" className="input-field" />
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-700 mb-2 block text-sm font-medium">
                          Middle Name
                        </label>
                        <input type="text" value="" className="input-field" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-secondary-700 mb-2 block text-sm font-medium">
                            Date of Birth
                          </label>
                          <input type="date" value="" className="input-field" />
                        </div>
                        <div>
                          <label className="text-secondary-700 mb-2 block text-sm font-medium">
                            Gender
                          </label>
                          <select className="input-field">
                            <option>Female</option>
                            <option>Male</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-700 mb-2 block text-sm font-medium">
                          Civil Status
                        </label>
                        <select className="input-field">
                          <option>Married</option>
                          <option>Single</option>
                          <option>Divorced</option>
                          <option>Widowed</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
                      Contact Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-secondary-700 mb-2 block text-sm font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value="elena.rodriguez@school.edu.ph"
                          className="input-field"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-secondary-700 mb-2 block text-sm font-medium">
                            Mobile Number
                          </label>
                          <input
                            type="tel"
                            value="+63 917 123 4567"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-secondary-700 mb-2 block text-sm font-medium">
                          Home Address
                        </label>
                        <textarea rows={3} className="input-field">
                          123 Sampaguita Street, Barangay San Antonio, Quezon
                          City, Metro Manila 1105
                        </textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
                    Employment Details
                  </h4>
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        Position
                      </label>
                      <input
                        type="text"
                        value="Senior Mathematics Teacher"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        Department
                      </label>
                      <select className="input-field">
                        <option>Mathematics</option>
                        <option>Science</option>
                        <option>English</option>
                        <option>Filipino</option>
                        <option>Social Studies</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        Employment Status
                      </label>
                      <select className="input-field">
                        <option>Permanent</option>
                        <option>Temporary</option>
                        <option>Contractual</option>
                        <option>Substitute</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        Date Hired
                      </label>
                      <input
                        type="date"
                        value="2012-06-15"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        Salary Grade
                      </label>
                      <input
                        type="text"
                        value="Grade 18"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="text-secondary-700 mb-2 block text-sm font-medium">
                        TIN
                      </label>
                      <input
                        type="text"
                        value="123-456-789-000"
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CERTIFICATIONS AND LICENSES */}
            {tabSelected == "certifications" && (
              <div id="certifications-tab">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="text-secondary-900 text-lg font-semibold">
                    Certifications & Licenses
                  </h4>
                  <button className="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-2 text-white transition-colors">
                    <i className="fas fa-plus mr-2"></i>
                    Add Certification
                  </button>
                </div>

                <div className="space-y-4">
                  {cerli.map((value, index) => (
                    <CertificationAndLicensesCard
                      key={index}
                      name={value.name}
                      expiryDuration={value.expiryDuration}
                      kvp={value.records}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* DOCUMENTS */}
            {tabSelected == "documents" && (
              <div id="documents-tab">
                <div className="mb-6 flex items-center justify-between">
                  <h4 className="text-secondary-900 text-lg font-semibold">
                    Document Repository
                  </h4>
                  <button className="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-2 text-white transition-colors">
                    <i className="fas fa-upload mr-2"></i>
                    Upload Document
                  </button>
                </div>

                <div
                  className="hover:border-primary-400 hover:bg-primary-50 mb-6 cursor-pointer rounded-lg border-2 border-dashed border-slate-300 p-8 text-center transition-colors"
                  id="dropZone"
                >
                  <div className="space-y-3">
                    <div className="bg-primary-100 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                      <i className="fas fa-cloud-upload-alt text-primary-600 text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-secondary-900 text-lg font-medium">
                        Drag and drop files here
                      </p>
                      <p className="text-secondary-600">
                        or click to browse files
                      </p>
                    </div>
                    <p className="text-secondary-500 text-sm">
                      Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="fileInput"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div>
                    <h5 className="text-secondary-900 mb-3 font-semibold">
                      Personal Documents
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="bg-error-100 rounded p-2">
                            <i className="fas fa-file-pdf text-error-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              Birth Certificate
                            </p>
                            <p className="text-secondary-600 text-sm">
                              Uploaded: Sept 15, 2025
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 rounded p-2">
                            <i className="fas fa-file-alt text-primary-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              Resume/CV
                            </p>
                            <p className="text-secondary-600 text-sm">
                              Updated: Sept 10, 2025
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="bg-success-100 rounded p-2">
                            <i className="fas fa-image text-success-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              2x2 ID Photo
                            </p>
                            <p className="text-secondary-600 text-sm">
                              Uploaded: Aug 28, 2025
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-secondary-900 mb-3 font-semibold">
                      Professional Documents
                    </h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="bg-accent-100 rounded p-2">
                            <i className="fas fa-certificate text-accent-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              Teaching License
                            </p>
                            <p className="text-secondary-600 text-sm">
                              Valid until: June 2027
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary-100 rounded p-2">
                            <i className="fas fa-graduation-cap text-primary-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              Master's Diploma
                            </p>
                            <p className="text-secondary-600 text-sm">
                              University of the Philippines
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>

                      <div className="border-warning-200 bg-warning-50 hover:bg-warning-100 flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-warning-100 rounded p-2">
                            <i className="fas fa-exclamation-triangle text-warning-600"></i>
                          </div>
                          <div>
                            <p className="text-secondary-900 font-medium">
                              CPD Certificate
                            </p>
                            <p className="text-warning-700 text-sm">
                              Expires: Jan 10, 2026
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="text-secondary-600 hover:text-primary-600 p-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="text-secondary-600 hover:text-accent-600 p-1">
                            <i className="fas fa-download"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default TeacherProfilePage;

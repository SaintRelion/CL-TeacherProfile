import { RenderFormField } from "@saintrelion/forms";

import { type PersonalInformation } from "@/models/PersonalInformation";

const SectionHeader = ({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) => (
  <div className="mb-5 flex items-center gap-3 print:mb-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 print:hidden">
      <i className={`${icon} text-blue-500`}></i>
    </div>
    <div>
      <h4 className="text-secondary-900 text-lg font-semibold print:text-base">{title}</h4>
      {subtitle && <p className="text-secondary-400 text-xs">{subtitle}</p>}
    </div>
  </div>
);

const FieldLabel = ({ label, isEditable = true }: { label: string; isEditable?: boolean }) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="text-secondary-700 block text-sm font-medium">{label}</span>
    {isEditable && (
      <span className="text-secondary-300 text-xs print:hidden">
        <i className="fas fa-pencil-alt text-[10px]"></i>
      </span>
    )}
  </div>
);

const PersonalInformationForm = ({
  myInformation,
}: {
  myInformation?: PersonalInformation;
}) => {
  return (
    <div className="space-y-8 print:space-y-4">
      {/* Basic & Contact Information Row */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 print:gap-4">
        {/* Basic Information Section */}
        <div className="rounded-xl bg-gradient-to-br from-slate-50/50 to-white p-6 ring-1 ring-slate-100 print:bg-transparent print:p-0 print:ring-0">
          <SectionHeader 
            icon="fas fa-user-circle" 
            title="Basic Information" 
            subtitle="Personal details"
          />
          <div className="space-y-4 print:space-y-2">
            <div className="grid grid-cols-2 gap-4 print:gap-2">
              <div>
                <FieldLabel label="First Name" />
                <RenderFormField
                  field={{
                    label: "",
                    type: "text",
                    name: "firstName",
                  }}
                  defaultValue={
                    myInformation == undefined ? "" : myInformation.firstName
                  }
                  labelClassName="hidden"
                  inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
                />
              </div>
              <div>
                <FieldLabel label="Last Name" />
                <RenderFormField
                  field={{
                    label: "",
                    type: "text",
                    name: "lastName",
                  }}
                  defaultValue={
                    myInformation == undefined ? "" : myInformation.lastName
                  }
                  labelClassName="hidden"
                  inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
                />
              </div>
            </div>
            <div>
              <FieldLabel label="Middle Name" />
              <RenderFormField
                field={{
                  label: "",
                  type: "text",
                  name: "middleName",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.middleName
                }
                labelClassName="hidden"
                inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 print:gap-2">
              <div>
                <FieldLabel label="Date of Birth" />
                <RenderFormField
                  field={{
                    label: "",
                    type: "date",
                    name: "dateOfBirth",
                  }}
                  defaultValue={
                    myInformation == undefined ? "" : myInformation.dateOfBirth
                  }
                  labelClassName="hidden"
                  inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
                />
              </div>
              <div>
                <FieldLabel label="Gender" />
                <RenderFormField
                  field={{
                    label: "",
                    type: "select",
                    name: "gender",
                    options: ["Female", "Male", "Other"],
                  }}
                  defaultValue={
                    myInformation == undefined ? "" : myInformation.gender
                  }
                  labelClassName="hidden"
                  inputClassName="input-field text-md !py-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
                />
              </div>
            </div>
            <div>
              <FieldLabel label="Civil Status" />
              <RenderFormField
                field={{
                  label: "",
                  type: "select",
                  name: "civilStatus",
                  options: ["Married", "Single", "Divorced", "Widowed"],
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.civilStatus
                }
                labelClassName="hidden"
                inputClassName="input-field text-md !py-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="rounded-xl bg-gradient-to-br from-slate-50/50 to-white p-6 ring-1 ring-slate-100 print:bg-transparent print:p-0 print:ring-0">
          <SectionHeader 
            icon="fas fa-address-book" 
            title="Contact Information" 
            subtitle="How to reach you"
          />
          <div className="space-y-4 print:space-y-2">
            <div>
              <FieldLabel label="Email Address" />
              <RenderFormField
                field={{
                  label: "",
                  type: "email",
                  name: "emailAddress",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.emailAddress
                }
                labelClassName="hidden"
                inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
              />
            </div>
            <div>
              <FieldLabel label="Mobile Number" />
              <RenderFormField
                field={{
                  label: "",
                  type: "text",
                  name: "mobileNumber",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.mobileNumber
                }
                labelClassName="hidden"
                inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
              />
            </div>
            <div>
              <FieldLabel label="Home Address" />
              <RenderFormField
                field={{
                  label: "",
                  type: "textarea",
                  name: "homeAddress",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.homeAddress
                }
                labelClassName="hidden"
                inputClassName="input-field min-h-[100px] print:border-0 print:bg-transparent print:p-0 print:shadow-none print:min-h-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Employment Details Section */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 print:border-0 print:p-0">
        <SectionHeader 
          icon="fas fa-briefcase" 
          title="Employment Details" 
          subtitle="Work-related information"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-4 print:gap-2">
          <div>
            <FieldLabel label="Employee ID" />
            <RenderFormField
              field={{
                label: "",
                type: "text",
                name: "employeeId",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.employeeId
              }
              labelClassName="hidden"
              inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="Position" />
            <RenderFormField
              field={{
                label: "",
                type: "text",
                name: "position",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.position
              }
              labelClassName="hidden"
              inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="Department" />
            <RenderFormField
              field={{
                label: "",
                type: "select",
                name: "department",
                options: [
                  "Mathematics",
                  "Science",
                  "English",
                  "Filipino",
                  "Social Studies",
                ],
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.department
              }
              labelClassName="hidden"
              inputClassName="input-field text-md !py-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="Employment Status" />
            <RenderFormField
              field={{
                label: "",
                type: "select",
                name: "employmentStatus",
                options: ["Permanent", "Temporary", "Contractual", "Substitute"],
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.employmentStatus
              }
              labelClassName="hidden"
              inputClassName="input-field text-md !py-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="Date Hired" />
            <RenderFormField
              field={{
                label: "",
                type: "date",
                name: "dateHired",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.dateHired
              }
              labelClassName="hidden"
              inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="Salary Grade" />
            <RenderFormField
              field={{
                label: "",
                type: "text",
                name: "salaryGrade",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.salaryGrade
              }
              labelClassName="hidden"
              inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
          <div>
            <FieldLabel label="TIN" />
            <RenderFormField
              field={{
                label: "",
                type: "text",
                name: "tin",
              }}
              defaultValue={myInformation == undefined ? "" : myInformation.tin}
              labelClassName="hidden"
              inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalInformationForm;

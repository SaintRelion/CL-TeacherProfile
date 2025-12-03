import { RenderFormField } from "@saintrelion/forms";

import { type PersonalInformation } from "@/models/personal-information";

const PersonalInformationForm = ({
  myInformation,
}: {
  myInformation?: PersonalInformation;
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
            Basic Information
          </h4>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <RenderFormField
                field={{
                  label: "First Name",
                  type: "text",
                  name: "firstName",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.firstName
                }
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field"
              />
              <RenderFormField
                field={{
                  label: "Last Name",
                  type: "text",
                  name: "lastName",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.lastName
                }
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field"
              />
            </div>
            <RenderFormField
              field={{
                label: "Middle Name",
                type: "text",
                name: "middleName",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.middleName
              }
              labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
              inputClassName="input-field"
            />
            <div className="grid grid-cols-2 gap-4">
              <RenderFormField
                field={{
                  label: "Date of Birth",
                  type: "date",
                  name: "dateOfBirth",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.dateOfBirth
                }
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field"
              />
              <RenderFormField
                field={{
                  label: "Gender",
                  type: "select",
                  name: "gender",
                  options: ["Female", "Male", "Other"],
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.gender
                }
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field text-md !py-6"
              />
            </div>
            <RenderFormField
              field={{
                label: "Civil Status",
                type: "select",
                name: "civilStatus",
                options: ["Married", "Single", "Divorced", "Widowed"],
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.civilStatus
              }
              labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
              inputClassName="input-field text-md !py-6"
            />
          </div>
        </div>

        <div>
          <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
            Contact Information
          </h4>
          <div className="space-y-4">
            <RenderFormField
              field={{
                label: "Email Address",
                type: "email",
                name: "emailAddress",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.emailAddress
              }
              labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
              inputClassName="input-field"
            />
            <div className="grid grid-cols-2 gap-4">
              <RenderFormField
                field={{
                  label: "Mobile Number",
                  type: "text",
                  name: "mobileNumber",
                }}
                defaultValue={
                  myInformation == undefined ? "" : myInformation.mobileNumber
                }
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field"
              />
            </div>
            <RenderFormField
              field={{
                label: "Home Address",
                type: "textarea",
                name: "homeAddress",
              }}
              defaultValue={
                myInformation == undefined ? "" : myInformation.homeAddress
              }
              labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
              inputClassName="input-field"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6">
        <h4 className="text-secondary-900 mb-4 text-lg font-semibold">
          Employment Details
        </h4>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RenderFormField
            field={{
              label: "Position",
              type: "text",
              name: "position",
            }}
            defaultValue={
              myInformation == undefined ? "" : myInformation.position
            }
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
          <RenderFormField
            field={{
              label: "Department",
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
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field text-md !py-6"
          />
          <RenderFormField
            field={{
              label: "Employment Status",
              type: "select",
              name: "employmentStatus",
              options: ["Permanent", "Temporary", "Contractual", "Substitute"],
            }}
            defaultValue={
              myInformation == undefined ? "" : myInformation.employmentStatus
            }
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field text-md !py-6"
          />
          <RenderFormField
            field={{
              label: "Date Hired",
              type: "date",
              name: "dateHired",
            }}
            defaultValue={
              myInformation == undefined ? "" : myInformation.dateHired
            }
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
          <RenderFormField
            field={{
              label: "Salary Grade",
              type: "text",
              name: "salaryGrade",
            }}
            defaultValue={
              myInformation == undefined ? "" : myInformation.salaryGrade
            }
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
          <RenderFormField
            field={{
              label: "TIN",
              type: "text",
              name: "tin",
            }}
            defaultValue={myInformation == undefined ? "" : myInformation.tin}
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
        </div>
      </div>
    </>
  );
};
export default PersonalInformationForm;

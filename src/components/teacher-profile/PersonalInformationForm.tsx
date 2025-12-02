import { useAuth } from "@saintrelion/auth-lib";
import { RenderForm, RenderFormField } from "@saintrelion/forms";

const PersonalInformationForm = () => {
  const { user } = useAuth();

  return (
    <RenderForm wrapperClass="tab-content">
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
                labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
                inputClassName="input-field"
              />
              <RenderFormField
                field={{
                  label: "Last Name",
                  type: "text",
                  name: "lastName",
                }}
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
              defaultValue={user.email}
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
                "123 Sampaguita Street, Barangay San Antonio, Quezon\nCity, Metro Manila 1105"
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
            defaultValue={"Senior Mathematics Teacher"}
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
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field text-md !py-6"
          />
          <RenderFormField
            field={{
              label: "Employment Status",
              type: "select",
              name: "employementStatus",
              options: ["Permanent", "Temporary", "Contractual", "Substitute"],
            }}
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field text-md !py-6"
          />
          <RenderFormField
            field={{
              label: "Date Hired",
              type: "date",
              name: "dateHired",
            }}
            defaultValue={"2012-06-15"}
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
          <RenderFormField
            field={{
              label: "Salary Grade",
              type: "text",
              name: "salaryGrade",
            }}
            defaultValue={"Grade 18"}
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
          <RenderFormField
            field={{
              label: "TIN",
              type: "text",
              name: "tin",
            }}
            defaultValue={"123-456-789-000"}
            labelClassName="text-secondary-700 mb-2 block text-sm font-medium"
            inputClassName="input-field"
          />
        </div>
      </div>
    </RenderForm>
  );
};
export default PersonalInformationForm;

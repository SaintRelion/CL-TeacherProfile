import { RenderFormField } from "@saintrelion/forms";
import { pdf } from "@react-pdf/renderer";
import { useRef, useState } from "react";

import { type PersonalInformation } from "@/models/PersonalInformation";
import PersonalInformationPDF from "./PersonalInformationPDF";

const SectionHeader = ({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-5 flex items-center gap-3 print:mb-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 print:hidden">
      <i className={`${icon} text-blue-500`}></i>
    </div>
    <div>
      <h4 className="text-secondary-900 text-lg font-semibold print:text-base">
        {title}
      </h4>
      {subtitle && <p className="text-secondary-400 text-xs">{subtitle}</p>}
    </div>
  </div>
);

const FieldLabel = ({
  label,
  isEditable = true,
}: {
  label: string;
  isEditable?: boolean;
}) => (
  <div className="mb-2 flex items-center gap-2">
    <span className="text-secondary-700 block text-sm font-medium">
      {label}
    </span>
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
  myInformation: PersonalInformation | null;
}) => {
  const fileName = myInformation
    ? `${myInformation.firstName}_${myInformation.lastName}_PersonalInfo.pdf`
    : "PersonalInformation.pdf";

  const printRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleExportPdf = async () => {
    if (!myInformation) return;

    try {
      setIsGeneratingPdf(true);
      const blob = await pdf(
        <PersonalInformationPDF data={myInformation} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "", "width=900,height=1200");
      if (printWindow) {
        const styles = `
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
              line-height: 1.5;
              color: #1f2937;
              background: #fff;
              padding: 0;
            }
            
            @page {
              size: A4;
              margin: 15mm 20mm;
            }
            
            @media print {
              body {
                margin: 0;
                padding: 0;
              }
            }
            
            .print-document {
              max-width: 100%;
              background: #fff;
            }
            
            .print-header {
              text-align: center;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            
            .print-header h1 {
              font-size: 16px;
              font-weight: 700;
              color: #1e40af;
              margin-bottom: 5px;
              letter-spacing: 0.5px;
            }
            
            .print-header p {
              font-size: 11px;
              color: #666;
              margin: 2px 0;
            }
            
            .print-section {
              margin-bottom: 20px;
            }
            
            .section-title {
              font-size: 12px;
              font-weight: 700;
              color: #1e40af;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px solid #d1d5db;
            }
            
            .form-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 15px;
            }
            
            .form-grid.full {
              grid-template-columns: 1fr;
            }
            
            .form-field {
              display: flex;
              flex-direction: column;
            }
            
            .field-label {
              font-size: 9px;
              font-weight: 700;
              color: #374151;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              margin-bottom: 5px;
            }
            
            .field-value {
              font-size: 10px;
              color: #000;
              padding-bottom: 4px;
              min-height: 18px;
              word-break: break-word;
            }
            
            .field-value.has-value {
              border-bottom: 1px solid #d1d5db;
            }
            
            .form-row {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin-bottom: 12px;
            }
            
            .form-row.three {
              grid-template-columns: repeat(3, 1fr);
            }
            
            .form-row.full {
              grid-template-columns: 1fr;
            }
            
            .signature-section {
              margin-top: 30px;
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 40px;
            }
            
            .signature-box {
              text-align: center;
              padding-top: 20px;
            }
            
            .signature-line {
              border-top: 1px solid #000;
              margin-bottom: 5px;
              height: 40px;
            }
            
            .signature-label {
              font-size: 9px;
              font-weight: 600;
              color: #374151;
              text-transform: uppercase;
            }
            
            .print-footer {
              text-align: center;
              font-size: 8px;
              color: #999;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #d1d5db;
            }
            
            .no-print, .print:hidden {
              display: none !important;
            }
          </style>
        `;

        // Helper function to create field HTML with conditional underline
        const createField = (label: string, value: string | undefined) => {
          const hasValue = value && value.trim() !== "";
          const className = hasValue ? "field-value has-value" : "field-value";
          return `
            <div class="form-field">
              <span class="field-label">${label}</span>
              <span class="${className}">${value || ""}</span>
            </div>
          `;
        };

        let content = `
          <div class="print-document">
            <div class="print-header">
              <h1>TEACHER PERSONAL INFORMATION FORM</h1>
              <p>Department of Education</p>
              <p>Official Record</p>
            </div>
        `;

        // Extract data from the form
        const formData = myInformation;

        content += `
            <div class="print-section">
              <div class="section-title">Basic Information</div>
              <div class="form-row">
                ${createField("First Name", formData?.firstName)}
                ${createField("Last Name", formData?.lastName)}
              </div>
              <div class="form-row full">
                ${createField("Middle Name", formData?.middleName)}
              </div>
              <div class="form-row">
                ${createField("Date of Birth", formData?.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : undefined)}
                ${createField("Gender", formData?.gender)}
              </div>
              <div class="form-row">
                ${createField("Civil Status", formData?.civilStatus)}
              </div>
            </div>
            
            <div class="print-section">
              <div class="section-title">Contact Information</div>
              <div class="form-row">
                ${createField("Email Address", formData?.email)}
                ${createField("Mobile Number", formData?.mobileNumber)}
              </div>
              <div class="form-row full">
                ${createField("Home Address", formData?.homeAddress)}
              </div>
            </div>
            
            <div class="print-section">
              <div class="section-title">Employment Details</div>
              <div class="form-row three">
                ${createField("Employee ID", formData?.employeeId)}
                ${createField("Position", formData?.position)}
                ${createField("Department", formData?.department)}
              </div>
              <div class="form-row three">
                ${createField("Employment Status", formData?.employmentStatus)}
                ${createField("Date Hired", formData?.dateHired ? new Date(formData.dateHired).toLocaleDateString() : undefined)}
                ${createField("Salary Grade", formData?.salaryGrade)}
              </div>
              <div class="form-row full">
                ${createField("TIN", formData?.tin)}
              </div>
            </div>
            
            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Teacher's Signature</div>
                <p style="font-size: 8px; margin-top: 10px; color: #666;">${new Date().toLocaleDateString()}</p>
              </div>
              <div class="signature-box">
                <div class="signature-line"></div>
                <div class="signature-label">Principal's Signature</div>
                <p style="font-size: 8px; margin-top: 10px; color: #666;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div class="print-footer">
              <p>This is an official record. Document generated on ${new Date().toLocaleString()}</p>
            </div>
          </div>
        `;

        const fullDocument = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Teacher Personal Information Form</title>
            ${styles}
          </head>
          <body>
            ${content}
          </body>
          </html>
        `;

        printWindow.document.write(fullDocument);
        printWindow.document.close();
        printWindow.focus();

        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    }
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Action Buttons */}
      {myInformation && (
        <div className="mb-6 flex flex-wrap justify-end gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-600 px-4 py-2 text-white transition-colors hover:bg-slate-700"
          >
            <i className="fas fa-print"></i>
            Print
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <i className="fas fa-file-pdf"></i>
            {isGeneratingPdf ? "Generating PDF..." : "Export to PDF"}
          </button>
        </div>
      )}

      {/* Printable Content */}
      <div ref={printRef} className="print-content">
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
                      myInformation == null ? "" : myInformation.firstName
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
                      myInformation == null ? "" : myInformation.lastName
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
                    myInformation == null ? "" : myInformation.middleName
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
                      myInformation == null ? "" : myInformation.dateOfBirth
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
                      myInformation == null ? "" : myInformation.gender
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
                    myInformation == null ? "" : myInformation.civilStatus
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
                <FieldLabel label="Email" />
                <RenderFormField
                  field={{
                    label: "",
                    type: "email",
                    name: "email",
                  }}
                  defaultValue={
                    myInformation == null ? "" : myInformation.email
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
                    myInformation == null ? "" : myInformation.mobileNumber
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
                    myInformation == null ? "" : myInformation.homeAddress
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
                  myInformation == null ? "" : myInformation.employeeId
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
                  myInformation == null ? "" : myInformation.position
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
                  myInformation == null ? "" : myInformation.department
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
                  options: [
                    "Permanent",
                    "Temporary",
                    "Contractual",
                    "Substitute",
                  ],
                }}
                defaultValue={
                  myInformation == null ? "" : myInformation.employmentStatus
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
                  myInformation == null ? "" : myInformation.dateHired
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
                  myInformation == null ? "" : myInformation.salaryGrade
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
                defaultValue={myInformation == null ? "" : myInformation.tin}
                labelClassName="hidden"
                inputClassName="input-field print:border-0 print:bg-transparent print:p-0 print:shadow-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PersonalInformationForm;

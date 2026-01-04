import { getYearsOfService, resolveImageSource } from "@/lib/utils";
import type { PersonalInformation } from "@/models/PersonalInformation";

interface PDSPrintViewProps {
  myInformation: PersonalInformation | undefined;
}

const PDSPrintView = ({ myInformation }: PDSPrintViewProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="pds-print-view hidden print:block">
      {/* PDS Header */}
      <div className="pds-header">
        <div className="pds-header-top">
          <div className="pds-logo-placeholder">
            <i className="fas fa-school text-3xl text-slate-400"></i>
          </div>
          <div className="pds-header-text">
            <h1 className="pds-title">PERSONAL DATA SHEET</h1>
            <p className="pds-subtitle">Teacher Profile Management System</p>
          </div>
          <div className="pds-form-info">
            <p className="text-xs">CS Form No. 212</p>
            <p className="text-xs">Revised 2017</p>
          </div>
        </div>
        <div className="pds-instructions">
          <p>
            <em>
              WARNING: Any misrepresentation made in the Personal Data Sheet
              and the Work Experience Sheet shall cause the filing of
              administrative/criminal case/s against the person concerned.
            </em>
          </p>
        </div>
      </div>

      {/* Section I: Personal Information */}
      <div className="pds-section">
        <div className="pds-section-header">
          <span className="pds-section-number">I.</span>
          <span className="pds-section-title">PERSONAL INFORMATION</span>
        </div>

        <table className="pds-table">
          <tbody>
            {/* Name Row */}
            <tr>
              <td className="pds-label-cell" rowSpan={3}>
                <span className="pds-field-number">2.</span> NAME
              </td>
              <td className="pds-sublabel">SURNAME</td>
              <td className="pds-value-cell" colSpan={2}>
                {myInformation?.lastName || ""}
              </td>
              <td className="pds-photo-cell" rowSpan={6}>
                <div className="pds-photo-box">
                  <img
                    src={resolveImageSource(myInformation?.photoBase64)}
                    alt="ID Photo"
                    className="pds-photo"
                  />
                  <p className="pds-photo-label">ID Picture</p>
                  <p className="pds-photo-size">(passport size)</p>
                </div>
              </td>
            </tr>
            <tr>
              <td className="pds-sublabel">FIRST NAME</td>
              <td className="pds-value-cell" colSpan={2}>
                {myInformation?.firstName || ""}
              </td>
            </tr>
            <tr>
              <td className="pds-sublabel">MIDDLE NAME</td>
              <td className="pds-value-cell" colSpan={2}>
                {myInformation?.middleName || ""}
              </td>
            </tr>

            {/* Date of Birth */}
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">3.</span> DATE OF BIRTH
              </td>
              <td className="pds-sublabel">(mm/dd/yyyy)</td>
              <td className="pds-value-cell" colSpan={2}>
                {formatDate(myInformation?.dateOfBirth || "")}
              </td>
            </tr>

            {/* Gender */}
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">4.</span> SEX
              </td>
              <td className="pds-value-cell" colSpan={3}>
                <div className="pds-checkbox-group">
                  <span className="pds-checkbox">
                    {myInformation?.gender === "Male" ? "☑" : "☐"} Male
                  </span>
                  <span className="pds-checkbox">
                    {myInformation?.gender === "Female" ? "☑" : "☐"} Female
                  </span>
                </div>
              </td>
            </tr>

            {/* Civil Status */}
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">5.</span> CIVIL STATUS
              </td>
              <td className="pds-value-cell" colSpan={3}>
                <div className="pds-checkbox-group">
                  <span className="pds-checkbox">
                    {myInformation?.civilStatus === "Single" ? "☑" : "☐"} Single
                  </span>
                  <span className="pds-checkbox">
                    {myInformation?.civilStatus === "Married" ? "☑" : "☐"}{" "}
                    Married
                  </span>
                  <span className="pds-checkbox">
                    {myInformation?.civilStatus === "Widowed" ? "☑" : "☐"}{" "}
                    Widowed
                  </span>
                  <span className="pds-checkbox">
                    {myInformation?.civilStatus === "Divorced" ? "☑" : "☐"}{" "}
                    Separated
                  </span>
                </div>
              </td>
            </tr>

            {/* Residential Address */}
            <tr>
              <td className="pds-label-cell" rowSpan={2}>
                <span className="pds-field-number">6.</span> RESIDENTIAL ADDRESS
              </td>
              <td className="pds-sublabel">Complete Address</td>
              <td className="pds-value-cell pds-address-cell" colSpan={3}>
                {myInformation?.homeAddress || ""}
              </td>
            </tr>
            <tr>
              <td className="pds-sublabel">ZIP Code</td>
              <td className="pds-value-cell" colSpan={3}></td>
            </tr>

            {/* Contact Information */}
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">7.</span> TELEPHONE NO.
              </td>
              <td className="pds-value-cell" colSpan={4}>
                N/A
              </td>
            </tr>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">8.</span> MOBILE NO.
              </td>
              <td className="pds-value-cell" colSpan={4}>
                {myInformation?.mobileNumber || ""}
              </td>
            </tr>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">9.</span> E-MAIL ADDRESS
              </td>
              <td className="pds-value-cell" colSpan={4}>
                {myInformation?.emailAddress || ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Section II: Employment Information */}
      <div className="pds-section">
        <div className="pds-section-header">
          <span className="pds-section-number">II.</span>
          <span className="pds-section-title">EMPLOYMENT INFORMATION</span>
        </div>

        <table className="pds-table">
          <tbody>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">10.</span> EMPLOYEE ID
              </td>
              <td className="pds-value-cell">
                {myInformation?.employeeId || ""}
              </td>
              <td className="pds-label-cell">
                <span className="pds-field-number">11.</span> TIN
              </td>
              <td className="pds-value-cell">{myInformation?.tin || ""}</td>
            </tr>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">12.</span> POSITION
              </td>
              <td className="pds-value-cell">
                {myInformation?.position || ""}
              </td>
              <td className="pds-label-cell">
                <span className="pds-field-number">13.</span> SALARY GRADE
              </td>
              <td className="pds-value-cell">
                {myInformation?.salaryGrade || ""}
              </td>
            </tr>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">14.</span> DEPARTMENT
              </td>
              <td className="pds-value-cell">
                {myInformation?.department || ""}
              </td>
              <td className="pds-label-cell">
                <span className="pds-field-number">15.</span> EMPLOYMENT STATUS
              </td>
              <td className="pds-value-cell">
                {myInformation?.employmentStatus || ""}
              </td>
            </tr>
            <tr>
              <td className="pds-label-cell">
                <span className="pds-field-number">16.</span> DATE HIRED
              </td>
              <td className="pds-value-cell">
                {formatDate(myInformation?.dateHired || "")}
              </td>
              <td className="pds-label-cell">
                <span className="pds-field-number">17.</span> YEARS OF SERVICE
              </td>
              <td className="pds-value-cell pds-highlight">
                {getYearsOfService(myInformation?.dateHired ?? "")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Declaration */}
      <div className="pds-declaration">
        <p>
          I declare under oath that I have personally accomplished this Personal
          Data Sheet which is a true, correct and complete statement pursuant to
          the provisions of pertinent laws, rules and regulations of the
          Republic of the Philippines. I authorize the agency head/authorized
          representative to verify/validate the contents stated herein.
        </p>
      </div>

      {/* Signature Section */}
      <div className="pds-signature-section">
        <div className="pds-signature-box">
          <div className="pds-signature-line"></div>
          <p className="pds-signature-label">
            Signature (Sign inside the box)
          </p>
        </div>
        <div className="pds-signature-box">
          <div className="pds-signature-line"></div>
          <p className="pds-signature-label">Date Accomplished</p>
        </div>
        <div className="pds-signature-box pds-thumbmark-box">
          <p className="pds-signature-label">Right Thumbmark</p>
        </div>
      </div>

      {/* ID Section */}
      <div className="pds-id-section">
        <table className="pds-table">
          <tbody>
            <tr>
              <td className="pds-label-cell">Government Issued ID</td>
              <td className="pds-value-cell"></td>
              <td className="pds-label-cell">ID/License/Passport No.</td>
              <td className="pds-value-cell"></td>
            </tr>
            <tr>
              <td className="pds-label-cell">Date of Issue</td>
              <td className="pds-value-cell"></td>
              <td className="pds-label-cell">Place of Issue</td>
              <td className="pds-value-cell"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pds-footer">
        <div className="pds-footer-left">
          <p>Teacher Profile Management System</p>
        </div>
        <div className="pds-footer-right">
          <p>
            Generated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PDSPrintView;

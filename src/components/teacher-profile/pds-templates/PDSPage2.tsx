import { padRows } from "@/pds-schema";
import {
  borderClass,
  SectionHeader,
  sideLabelBg,
  type PDSPageProps,
} from "./Reusable";

const PDSPage2 = ({ data, show }: PDSPageProps) => {
  const toValue = (value?: string | number | null | boolean): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  const civilRows = padRows(data.civilServiceRows, 13);
  const workRows = padRows(data.workExperienceRows, 24);

  return (
    <div
      className="flex flex-col font-sans text-black"
      style={{ height: "100%", minHeight: 0, padding: "6px" }}
    >
      {/* --- SECTION IV. CIVIL SERVICE ELIGIBILITY --- */}
      {show("civilServiceEligibility") && (
        <div className="flex flex-col border-l border-black text-black">
          <SectionHeader title="IV. CIVIL SERVICE ELIGIBILITY" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[7pt] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[30%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  27. CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER SPECIAL LAWS/
                  CES/ CSEE
                  <br />
                  BARANGAY ELIGIBILITY / DRIVER'S LICENSE
                </th>
                <th
                  className={`${borderClass} w-[10%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  RATING
                  <br />
                  <span className="text-[7pt] font-normal normal-case">
                    (If Applicable)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[15%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  DATE OF EXAMINATION / CONFERMENT
                </th>
                <th
                  className={`${borderClass} w-[20%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  PLACE OF EXAMINATION / CONFERMENT
                </th>
                <th
                  className={`${borderClass} w-[25%] !border-r-0 px-1 pb-[4pt] leading-tight font-normal`}
                  colSpan={2}
                >
                  LICENSE{" "}
                  <span className="text-[7pt] font-normal normal-case">
                    (if applicable)
                  </span>
                  <br />
                  <div className="flex justify-around pt-[5pt]">
                    <span className="font-normal">NUMBER</span>
                    <span className="font-normal">Date of Validity</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {civilRows.map((row, index) => (
                <tr key={index} className="bg-white text-[7pt] font-normal">
                  <td className={`${borderClass} px-1 pb-[18pt] uppercase`}>
                    {toValue(row.eligibility)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[18pt] text-center uppercase`}
                  >
                    {toValue(row.rating)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[18pt] text-center uppercase`}
                  >
                    {toValue(row.examDate)}
                  </td>
                  <td className={`${borderClass} px-1 pb-[18pt] uppercase`}>
                    {toValue(row.examPlace)}
                  </td>
                  <td className={`${borderClass} px-1 pb-[18pt] uppercase`}>
                    {toValue(row.licenseNumber)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 px-1 pb-[18pt] text-center uppercase`}
                  >
                    {toValue(row.validity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- SECTION V. WORK EXPERIENCE --- */}
      {show("workExperience") && (
        <div
          className="mt-0 flex flex-col border-l border-black text-black"
          style={{ minHeight: 0 }}
        >
          <SectionHeader title="V. WORK EXPERIENCE" />
          <div
            className={`${sideLabelBg} ${borderClass} !border-r-0 px-2 pb-[5pt] text-[7pt] leading-tight font-normal text-black italic`}
          >
            (Include private employment. Start from your recent work.)
            Description of duties should be indicated in the attached Work
            Experience Sheet.
          </div>

          <div className="flex flex-grow flex-col">
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr
                  className={`${sideLabelBg} text-center text-[7pt] font-normal uppercase`}
                >
                  <th
                    className={`${borderClass} w-[12%] px-1 pb-[4pt] leading-tight font-normal`}
                    colSpan={2}
                  >
                    28. INCLUSIVE DATES
                    <br />
                    <span className="text-[7pt] font-normal normal-case">
                      (mm/dd/yyyy)
                    </span>
                    <br />
                    <div className="flex justify-around pt-[5pt]">
                      <span className="font-normal">FROM</span>
                      <span className="font-normal">TO</span>
                    </div>
                  </th>
                  <th
                    className={`${borderClass} w-[22%] px-1 pb-[4pt] leading-tight font-normal`}
                    rowSpan={2}
                  >
                    POSITION TITLE
                    <br />
                    <span className="text-[7pt] font-normal normal-case">
                      (Write in full/Do not abbreviate)
                    </span>
                  </th>
                  <th
                    className={`${borderClass} w-[22%] px-1 pb-[4pt] leading-tight font-normal`}
                    rowSpan={2}
                  >
                    DEPARTMENT / AGENCY / OFFICE / COMPANY
                    <br />
                    <span className="text-[7pt] font-normal normal-case">
                      (Write in full/Do not abbreviate)
                    </span>
                  </th>
                  <th
                    className={`${borderClass} w-[12%] px-1 pb-[4pt] leading-tight font-normal`}
                    rowSpan={2}
                  >
                    STATUS OF APPOINTMENT
                  </th>
                  <th
                    className={`${borderClass} w-[10%] !border-r-0 px-1 pb-[4pt] leading-tight font-normal`}
                    rowSpan={2}
                  >
                    GOV'T SERVICE
                    <br />
                    <span className="text-[7pt] font-normal normal-case">
                      (Y/ N)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {workRows.map((row, index) => (
                  <tr key={index} className="bg-white text-[7pt] font-normal">
                    <td
                      className={`${borderClass} px-1 pb-[18pt] text-center uppercase`}
                    >
                      {toValue(row.fromDate)}
                    </td>
                    <td
                      className={`${borderClass} px-1 pb-[19pt] text-center uppercase`}
                    >
                      {toValue(row.toDate)}
                    </td>
                    <td className={`${borderClass} px-1 pb-[19pt] uppercase`}>
                      {toValue(row.positionTitle)}
                    </td>
                    <td className={`${borderClass} px-1 pb-[19pt] uppercase`}>
                      {toValue(row.departmentAgencyOfficeCompany)}
                    </td>
                    <td
                      className={`${borderClass} px-1 pb-[19pt] text-center uppercase`}
                    >
                      {toValue(row.statusOfAppointment)}
                    </td>
                    <td
                      className={`${borderClass} !border-r-0 px-1 pb-[19pt] text-center uppercase`}
                    >
                      {toValue(row.governmentService)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex-1" />
      {/* --- PAGE 2 FOOTER --- */}
      <div className="flex flex-col text-black">
        <div className="bg-[#f2f2f2] px-2 pb-[5pt] text-[7pt] font-normal italic">
          (Continue on separate sheet if necessary)
        </div>
        <div className="grid grid-cols-12 border-2 border-black bg-white">
          <div
            className={`${sideLabelBg} col-span-2 flex items-center justify-center border-r border-black pb-[5pt] text-[8pt] font-bold`}
          >
            SIGNATURE
          </div>
          <div className="col-span-6 min-h-[26px]"></div>
          <div
            className={`${sideLabelBg} col-span-1 flex items-center justify-center border-r border-l border-black pb-[5pt] text-[8pt] font-bold`}
          >
            DATE
          </div>
        </div>
        <div className="text-right text-[6pt] font-normal text-black italic">
          CS FORM 212 (Revised 2025), Page 2 of 4
        </div>
      </div>
    </div>
  );
};
export default PDSPage2;

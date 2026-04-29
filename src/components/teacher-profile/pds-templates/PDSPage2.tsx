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

  // The official PDS typically has 7 rows for Civil Service and 28 rows for Work Experience on Page 2
  const civilRows = padRows(data.civilServiceRows, 7);
  const workRows = padRows(data.workExperienceRows, 28);

  return (
    <div className="flex h-full w-full flex-col font-sans text-black">
      {/* --- SECTION IV. CIVIL SERVICE ELIGIBILITY --- */}
      {show("civilServiceEligibility") && (
        <div className="flex flex-col border-l border-black text-black">
          <SectionHeader title="IV. CIVIL SERVICE ELIGIBILITY" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[30%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  27. CAREER SERVICE/ RA 1080 (BOARD/ BAR) UNDER SPECIAL LAWS/
                  CES/ CSEE
                  <br />
                  BARANGAY ELIGIBILITY / DRIVER'S LICENSE
                </th>
                <th
                  className={`${borderClass} w-[10%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  RATING
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (If Applicable)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[15%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  DATE OF EXAMINATION / CONFERMENT
                </th>
                <th
                  className={`${borderClass} w-[20%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  PLACE OF EXAMINATION / CONFERMENT
                </th>
                <th
                  className={`${borderClass} w-[25%] !border-r-0 p-1 leading-tight font-normal`}
                  colSpan={2}
                >
                  LICENSE{" "}
                  <span className="text-[12px] font-normal normal-case">
                    (if applicable)
                  </span>
                </th>
              </tr>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th className={`${borderClass} w-[12.5%] p-1 font-normal`}>
                  NUMBER
                </th>
                <th
                  className={`${borderClass} w-[12.5%] !border-r-0 p-1 font-normal`}
                >
                  Date of Validity
                </th>
              </tr>
            </thead>
            <tbody>
              {civilRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.eligibility)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.rating)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.examDate)}
                  </td>
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.examPlace)}
                  </td>
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.licenseNumber)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 p-3 text-center uppercase`}
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
        <div className="mt-0 flex flex-grow flex-col border-l border-black text-black">
          <SectionHeader title="V. WORK EXPERIENCE" />
          <div
            className={`${sideLabelBg} ${borderClass} !border-r-0 px-2 py-0.5 text-[12px] leading-tight font-normal text-black italic`}
          >
            (Include private employment. Start from your recent work.)
            Description of duties should be indicated in the attached Work
            Experience Sheet.
          </div>
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[12%] p-1 leading-tight font-normal`}
                  colSpan={2}
                >
                  28. INCLUSIVE DATES
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (mm/dd/yyyy)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[22%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  POSITION TITLE
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full/Do not abbreviate)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[22%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  DEPARTMENT / AGENCY / OFFICE / COMPANY
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full/Do not abbreviate)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[10%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  MONTHLY SALARY
                </th>
                <th
                  className={`${borderClass} w-[12%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  SALARY/ JOB/ PAY GRADE (if applicable)& STEP (Format "00-0")/
                  INCREMENT
                </th>
                <th
                  className={`${borderClass} w-[12%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  STATUS OF APPOINTMENT
                </th>
                <th
                  className={`${borderClass} w-[10%] !border-r-0 p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  GOV'T SERVICE
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Y/ N)
                  </span>
                </th>
              </tr>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th className={`${borderClass} w-[6%] p-1 font-normal`}>
                  From
                </th>
                <th className={`${borderClass} w-[6%] p-1 font-normal`}>To</th>
              </tr>
            </thead>
            <tbody>
              {workRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.fromDate)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.toDate)}
                  </td>
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.positionTitle)}
                  </td>
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.departmentAgencyOfficeCompany)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.monthlySalary)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.salaryGrade)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.statusOfAppointment)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 p-3 text-center uppercase`}
                  >
                    {toValue(row.governmentService)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PAGE 2 FOOTER --- */}
      <div className="mt-auto flex flex-col border-t border-black text-black">
        <div className="border-b border-black bg-[#f2f2f2] p-1 px-2 text-[12px] font-normal italic">
          (Continue on separate sheet if necessary)
        </div>

        {/* Bottom of footer: Signatures */}
        <div className="grid grid-cols-12 bg-white">
          <div
            className={`${sideLabelBg} col-span-2 flex items-center justify-center border-r border-black p-4 text-[12px] font-bold`}
          >
            SIGNATURE
          </div>
          <div className="col-span-6 min-h-[26px] border-r border-black"></div>
          <div
            className={`${sideLabelBg} col-span-1 flex items-center justify-center border-r border-black p-4 text-[12px] font-bold`}
          >
            DATE
          </div>
          <div className="col-span-3 min-h-[26px]"></div>
        </div>
      </div>

      {/* PAGE 2 IDENTIFIER */}
      <div className="absolute right-0 -bottom-4 text-[12px] font-normal text-black italic">
        CS FORM 212 (Revised 2025), Page 2 of 4
      </div>
    </div>
  );
};
export default PDSPage2;

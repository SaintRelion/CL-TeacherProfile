import { padRows } from "@/pds-schema";
import {
  borderClass,
  SectionHeader,
  sideLabelBg,
  type PDSPageProps,
} from "./Reusable";

export const PDSPage3 = ({ data, show }: PDSPageProps) => {
  const toValue = (value?: string | number | null | boolean): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  // Standard row padding for Page 3 based on the official form
  const voluntaryRows = padRows(data.voluntaryWorkRows, 7);
  const trainingRows = padRows(data.trainingRows, 14);
  const otherRows = padRows(data.otherInformationRows, 7);

  return (
    <div className="flex h-full w-full flex-col font-sans text-black">
      {/* --- SECTION VI. VOLUNTARY WORK --- */}
      {show("voluntaryWork") && (
        <div className="flex flex-col border-l border-black text-black">
          <SectionHeader title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[35%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  29. NAME & ADDRESS OF ORGANIZATION
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[16%] p-1 leading-tight font-normal`}
                  colSpan={2}
                >
                  INCLUSIVE DATES
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (mm/dd/yyyy)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[10%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  NUMBER OF HOURS
                </th>
                <th
                  className={`${borderClass} w-[39%] !border-r-0 p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  POSITION / NATURE OF WORK
                </th>
              </tr>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th className={`${borderClass} w-[8%] p-1 font-normal`}>
                  From
                </th>
                <th className={`${borderClass} w-[8%] p-1 font-normal`}>To</th>
              </tr>
            </thead>
            <tbody>
              {voluntaryRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.organization)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.fromDate)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.toDate)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.hours)}
                  </td>
                  <td className={`${borderClass} !border-r-0 p-3 uppercase`}>
                    {toValue(row.positionNatureOfWork)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- SECTION VII. LEARNING & DEVELOPMENT --- */}
      {show("training") && (
        <div className="mt-0 flex flex-col border-l border-black text-black">
          <SectionHeader title="VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS/TRAINING PROGRAMS ATTENDED" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[40%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  30. TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING
                  PROGRAMS
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[16%] p-1 leading-tight font-normal`}
                  colSpan={2}
                >
                  INCLUSIVE DATES OF ATTENDANCE
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (mm/dd/yyyy)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[8%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  NUMBER OF HOURS
                </th>
                <th
                  className={`${borderClass} w-[12%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  Type of L&D
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Managerial/ Supervisory/ Technical/etc)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[24%] !border-r-0 p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  CONDUCTED/ SPONSORED BY
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
              </tr>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th className={`${borderClass} w-[8%] p-3 font-normal`}>
                  From
                </th>
                <th className={`${borderClass} w-[8%] p-3 font-normal`}>To</th>
              </tr>
            </thead>
            <tbody>
              {trainingRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.title)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.fromDate)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.toDate)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.hours)}
                  </td>
                  <td className={`${borderClass} p-3 text-center uppercase`}>
                    {toValue(row.typeOfLd)}
                  </td>
                  <td className={`${borderClass} !border-r-0 p-3 uppercase`}>
                    {toValue(row.conductedBy)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- SECTION VIII. OTHER INFORMATION --- */}
      {show("otherInformation") && (
        <div className="mt-0 flex flex-grow flex-col border-l border-black text-black">
          <SectionHeader title="VIII. OTHER INFORMATION" />
          <table className="h-full w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[30%] p-1 leading-tight font-normal`}
                >
                  31. SPECIAL SKILLS and HOBBIES
                </th>
                <th
                  className={`${borderClass} w-[40%] p-1 leading-tight font-normal`}
                >
                  32. NON-ACADEMIC DISTINCTIONS / RECOGNITION
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[30%] !border-r-0 p-1 leading-tight font-normal`}
                >
                  33. MEMBERSHIP IN ASSOCIATION/ORGANIZATION
                  <br />
                  <span className="text-[12px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {otherRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.skill)}
                  </td>
                  <td className={`${borderClass} p-3 uppercase`}>
                    {toValue(row.distinction)}
                  </td>
                  <td className={`${borderClass} !border-r-0 p-3 uppercase`}>
                    {toValue(row.membership)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PAGE 3 FOOTER --- */}
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

      {/* PAGE 3 IDENTIFIER */}
      <div className="absolute right-0 -bottom-4 text-[12px] font-normal text-black italic">
        CS FORM 212 (Revised 2025), Page 3 of 4
      </div>
    </div>
  );
};

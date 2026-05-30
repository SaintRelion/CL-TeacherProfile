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

  const voluntaryRows = padRows(data.voluntaryWorkRows, 9);
  const trainingRows = padRows(data.trainingRows, 17);
  const otherRows = padRows(data.otherInformationRows, 9);

  return (
    <div
      className="flex flex-col font-sans text-black"
      style={{ height: "100%", minHeight: 0, padding: "6px" }}
    >
      {/* --- SECTION VI. VOLUNTARY WORK --- */}
      {show("voluntaryWork") && (
        <div className="flex flex-col border-l border-black text-black">
          <SectionHeader title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[7pt] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[35%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  29. NAME & ADDRESS OF ORGANIZATION
                  <br />
                  <span className="font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[16%] px-1 pb-[4pt] leading-tight font-normal`}
                  colSpan={2}
                >
                  INCLUSIVE DATES
                  <br />
                  <span className="font-normal normal-case">(mm/dd/yyyy)</span>
                  <br />
                  <div className="flex justify-around pt-[17.5pt]">
                    <span className="font-normal">FROM</span>
                    <span className="font-normal">TO</span>
                  </div>
                </th>
                <th
                  className={`${borderClass} w-[10%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  NUMBER OF HOURS
                </th>
                <th
                  className={`${borderClass} w-[39%] !border-r-0 px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  POSITION / NATURE OF WORK
                </th>
              </tr>
            </thead>
            <tbody>
              {voluntaryRows.map((row, index) => (
                <tr key={index} className="bg-white text-[7pt] font-normal">
                  <td className={`${borderClass} px-1 pb-[17.5pt] uppercase`}>
                    {toValue(row.organization)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.fromDate)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.toDate)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.hours)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 px-1 pb-[17.5pt] uppercase`}
                  >
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
                className={`${sideLabelBg} text-center text-[7pt] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[40%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  30. TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS/TRAINING
                  PROGRAMS
                  <br />
                  <span className="font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[16%] px-1 pb-[4pt] leading-tight font-normal`}
                  colSpan={2}
                >
                  INCLUSIVE DATES OF ATTENDANCE
                  <br />
                  <span className="font-normal normal-case">(mm/dd/yyyy)</span>
                  <br />
                  <div className="flex justify-around pt-[17.5pt]">
                    <span className="font-normal">FROM</span>
                    <span className="font-normal">TO</span>
                  </div>
                </th>
                <th
                  className={`${borderClass} w-[8%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  NUMBER OF HOURS
                </th>
                <th
                  className={`${borderClass} w-[12%] px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  Type of L&D
                  <br />
                  <span className="font-normal normal-case">
                    (Managerial/ Supervisory/ Technical/etc)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[24%] !border-r-0 px-1 pb-[4pt] leading-tight font-normal`}
                  rowSpan={2}
                >
                  CONDUCTED/ SPONSORED BY
                  <br />
                  <span className="font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {trainingRows.map((row, index) => (
                <tr key={index} className="bg-white text-[7pt] font-normal">
                  <td className={`${borderClass} px-1 pb-[17.5pt] uppercase`}>
                    {toValue(row.title)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.fromDate)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.toDate)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.hours)}
                  </td>
                  <td
                    className={`${borderClass} px-1 pb-[17.5pt] text-center uppercase`}
                  >
                    {toValue(row.typeOfLd)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 px-1 pb-[17.5pt] uppercase`}
                  >
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
        <div
          className="mt-0 flex flex-col border-l border-black text-black"
          style={{ minHeight: 0 }}
        >
          <SectionHeader title="VIII. OTHER INFORMATION" />
          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[7pt] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[30%] px-1 pb-[4pt] leading-tight font-normal`}
                >
                  31. SPECIAL SKILLS and HOBBIES
                </th>
                <th
                  className={`${borderClass} w-[40%] px-1 pb-[4pt] leading-tight font-normal`}
                >
                  32. NON-ACADEMIC DISTINCTIONS / RECOGNITION
                  <br />
                  <span className="font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[30%] !border-r-0 px-1 pb-[4pt] leading-tight font-normal`}
                >
                  33. MEMBERSHIP IN ASSOCIATION/ORGANIZATION
                  <br />
                  <span className="font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {otherRows.map((row, index) => (
                <tr key={index} className="bg-white text-[7pt] font-normal">
                  <td className={`${borderClass} px-1 pb-[17.5pt] uppercase`}>
                    {toValue(row.skill)}
                  </td>
                  <td className={`${borderClass} px-1 pb-[17.5pt] uppercase`}>
                    {toValue(row.distinction)}
                  </td>
                  <td
                    className={`${borderClass} !border-r-0 px-1 pb-[17.5pt] uppercase`}
                  >
                    {toValue(row.membership)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex-1" />
      {/* --- PAGE 3 FOOTER --- */}
      <div className="flex flex-col text-black">
        <div className="bg-[#f2f2f2] px-2 pb-[5pt] text-[7pt] font-normal italic">
          (Continue on separate sheet if necessary)
        </div>
        <div className="grid grid-cols-12 border-2 border-black bg-white">
          <div
            className={`${sideLabelBg} col-span-2 flex items-center justify-center border-r border-black pb-[17.5pt] text-[8pt] font-bold`}
          >
            SIGNATURE
          </div>
          <div className="col-span-6 min-h-[26px]"></div>
          <div
            className={`${sideLabelBg} col-span-1 flex items-center justify-center border-r border-l border-black pb-[17.5pt] text-[8pt] font-bold`}
          >
            DATE
          </div>
        </div>
        <div className="text-right text-[6pt] font-normal text-black italic">
          CS FORM 212 (Revised 2025), Page 3 of 4
        </div>
      </div>
    </div>
  );
};

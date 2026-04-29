import type { EducationRow } from "@/pds-schema";
import {
  AddressCell,
  borderClass,
  labelBg,
  LabelBox,
  SectionHeader,
  sideLabelBg,
  ValueBox,
  type PDSPageProps,
} from "./Reusable";

export const PDSPage1 = ({ data, show }: PDSPageProps) => {
  const toValue = (value?: string | number | null | boolean): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  const childrenRows = [...(data.familyBackground.children || [])];
  while (childrenRows.length < 12) {
    childrenRows.push({ name: "", dateOfBirth: "" });
  }

  const getEduData = (
    keywords: string[],
    defaultLevel: string,
  ): EducationRow => {
    const found = (data.educationRows || []).find((r) =>
      keywords.some((kw) => r.level?.toLowerCase().includes(kw)),
    );

    // If not found, we fulfill your strict schema by providing an object with the required 'level'!
    return found || { level: defaultLevel };
  };

  const eduRows = [
    getEduData(["elem"], "ELEMENTARY"),
    getEduData(["sec", "high"], "SECONDARY"),
    getEduData(["voc", "trade"], "VOCATIONAL / TRADE COURSE"),
    getEduData(["coll", "bachelor"], "COLLEGE"),
    getEduData(["grad", "master", "doctor"], "GRADUATE STUDIES"),
  ];

  const eduLabels = [
    "ELEMENTARY",
    "SECONDARY",
    "VOCATIONAL / TRADE COURSE",
    "COLLEGE",
    "GRADUATE STUDIES",
  ];

  return (
    <div>
      {/* HEADER SECTION */}
      <div className="mb-1 w-full text-black">
        <p className="text-[6.5pt] leading-tight font-bold italic">
          CS Form No. 212 <br /> Revised 2025
        </p>

        <h1 className="mt-0 text-center text-[32px] leading-none font-black tracking-tighter">
          PERSONAL DATA SHEET
        </h1>

        <p className="mt-3 text-justify text-[12px] leading-tight font-bold italic">
          WARNING: Any misrepresentation made in the Personal Data Sheet and the
          Work Experience Sheet shall cause the filing of
          administrative/criminal case/s against the person concerned.
        </p>

        <p className="mt-1 text-[12px] leading-tight font-bold italic">
          READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS)
          BEFORE ACCOMPLISHING THE PDS FORM.
        </p>

        <p className="mt-1 text-[10px] leading-tight">
          Print legibly if accomplished through own handwriting. Tick
          appropriate boxes ({" "}
          <span className="inline-block w-3 border-b border-black"></span> ) and
          use separate sheet if necessary. Indicate N/A if not applicable.{" "}
          <span className="font-bold">DO NOT ABBREVIATE.</span>
        </p>
      </div>

      {/* --- SECTION I. PERSONAL INFORMATION --- */}
      {show("personalInfo") && (
        <div className="mt-2 border-l border-black">
          <SectionHeader title="I. PERSONAL INFORMATION" />

          <div className="grid grid-cols-12 border-t border-black">
            {/* Row 1: SURNAME */}
            <LabelBox label="1. SURNAME" />
            <ValueBox value={data.personalInfo.nameGroup.lastName} span={10} />

            {/* Row 2: FIRST NAME & EXTENSION */}
            <LabelBox label="2. FIRST NAME" />
            <ValueBox value={data.personalInfo.nameGroup.firstName} span={7} />

            <div
              className={`${labelBg} ${borderClass} col-span-3 flex items-center justify-between p-1 text-[12px]`}
            >
              NAME EXTENSION (JR., SR)
              <span className="min-w-[40px] px-2 py-0.5 text-center text-[12px] font-medium uppercase">
                {toValue(data.personalInfo.nameGroup.nameExtension)}
              </span>
            </div>

            {/* Row 3: MIDDLE NAME */}
            <LabelBox label="3. MIDDLE NAME" />
            <ValueBox
              value={data.personalInfo.nameGroup.middleName}
              span={10}
            />

            {/* Row 4: DOB & CITIZENSHIP (RowSpan 3) */}
            <LabelBox label="4. DATE OF BIRTH (mm/dd/yyyy)" />
            <ValueBox value={data.personalInfo.birthAndStatus.dateOfBirth} />

            <LabelBox
              label="16. CITIZENSHIP"
              rowSpan={3}
              className="text-center"
            />
            <div
              className={`bg-white ${borderClass} col-span-4 row-span-3 flex flex-col justify-center p-1.5 text-[12px]`}
            >
              <div className="flex gap-4">
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={
                      data.personalInfo.citizenshipGroup.citizenshipStatus ===
                      "Filipino"
                    }
                    readOnly
                  />{" "}
                  Filipino
                </label>
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={
                      !!data.personalInfo.citizenshipGroup.dualCitizenshipMode
                    }
                    readOnly
                  />{" "}
                  Dual Citizenship
                </label>
              </div>
              <div className="mt-1 flex gap-4 pl-5">
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={
                      data.personalInfo.citizenshipGroup.dualCitizenshipMode ===
                      "by birth"
                    }
                    readOnly
                  />{" "}
                  by birth
                </label>
                <label className="flex cursor-pointer items-center gap-1">
                  <input
                    type="checkbox"
                    checked={
                      data.personalInfo.citizenshipGroup.dualCitizenshipMode ===
                      "by naturalization"
                    }
                    readOnly
                  />{" "}
                  by naturalization
                </label>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[12px] italic">
                Pls. indicate country:
                <div className="flex-grow border-b border-black text-center text-[7pt] font-bold uppercase">
                  {toValue(
                    data.personalInfo.citizenshipGroup.citizenshipCountry,
                  )}
                </div>
              </div>
            </div>

            {/* Row 5: PLACE OF BIRTH */}
            <LabelBox label="5. PLACE OF BIRTH" />
            <ValueBox value={data.personalInfo.birthAndStatus.placeOfBirth} />

            {/* Row 6: SEX AT BIRTH */}
            <LabelBox label="6. SEX AT BIRTH" />
            <div
              className={`bg-white ${borderClass} col-span-4 flex items-center gap-6 p-1 text-[12px]`}
            >
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={data.personalInfo.birthAndStatus.gender === "Male"}
                  readOnly
                />{" "}
                Male
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={data.personalInfo.birthAndStatus.gender === "Female"}
                  readOnly
                />{" "}
                Female
              </label>
            </div>

            {/* Row 7: CIVIL STATUS & RESIDENTIAL ADDRESS (RowSpan 3) */}
            <LabelBox label="7. CIVIL STATUS" />
            <div
              className={`bg-white ${borderClass} col-span-4 flex flex-wrap items-center gap-x-3 gap-y-0.5 p-1 text-[12px]`}
            >
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    data.personalInfo.birthAndStatus.civilStatus === "Single"
                  }
                  readOnly
                />{" "}
                Single
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    data.personalInfo.birthAndStatus.civilStatus === "Married"
                  }
                  readOnly
                />{" "}
                Married
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    data.personalInfo.birthAndStatus.civilStatus === "Widow/er"
                  }
                  readOnly
                />{" "}
                Widow/er
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    data.personalInfo.birthAndStatus.civilStatus === "Separated"
                  }
                  readOnly
                />{" "}
                Separated
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={
                    data.personalInfo.birthAndStatus.civilStatus === "Other/s"
                  }
                  readOnly
                />{" "}
                Other/s:
              </label>
            </div>

            <LabelBox label="17. RESIDENTIAL ADDRESS" rowSpan={3} />
            <AddressCell
              label="House/Block/Lot No."
              value={
                data.personalInfo.addressGroup.residentialAddress
                  .houseBlockLotNo
              }
            />
            <AddressCell
              label="Street"
              value={data.personalInfo.addressGroup.residentialAddress.street}
            />

            {/* Row 8: HEIGHT */}
            <LabelBox label="8. HEIGHT (m)" />
            <ValueBox value={data.personalInfo.physicalAttributes.heightCm} />
            <AddressCell
              label="Subdivision/Village"
              value={
                data.personalInfo.addressGroup.residentialAddress
                  .subdivisionVillage
              }
            />
            <AddressCell
              label="Barangay"
              value={data.personalInfo.addressGroup.residentialAddress.barangay}
            />

            {/* Row 9: WEIGHT */}
            <LabelBox label="9. WEIGHT (kg)" />
            <ValueBox value={data.personalInfo.physicalAttributes.weightKg} />
            <AddressCell
              label="City/Municipality"
              value={
                data.personalInfo.addressGroup.residentialAddress
                  .cityMunicipality
              }
            />
            <AddressCell
              label="Province"
              value={data.personalInfo.addressGroup.residentialAddress.province}
            />

            {/* Row 10: BLOOD TYPE & PERMANENT ADDRESS (RowSpan 3) */}
            <LabelBox label="10. BLOOD TYPE" />
            <ValueBox value={data.personalInfo.physicalAttributes.bloodType} />
            <LabelBox label="18. PERMANENT ADDRESS" rowSpan={3} />
            <AddressCell
              label="House/Block/Lot No."
              value={
                data.personalInfo.addressGroup.permanentAddress.houseBlockLotNo
              }
            />
            <AddressCell
              label="Street"
              value={data.personalInfo.addressGroup.permanentAddress.street}
            />

            {/* Row 11: UMID */}
            <LabelBox label="11. UMID ID NO." />
            <ValueBox value={data.personalInfo.governmentIds.umidNumber} />
            <AddressCell
              label="Subdivision/Village"
              value={
                data.personalInfo.addressGroup.permanentAddress
                  .subdivisionVillage
              }
            />
            <AddressCell
              label="Barangay"
              value={data.personalInfo.addressGroup.permanentAddress.barangay}
            />

            {/* Row 12: PAG-IBIG */}
            <LabelBox label="12. PAG-IBIG ID NO." />
            <ValueBox value={data.personalInfo.governmentIds.pagibigNumber} />
            <AddressCell
              label="City/Municipality"
              value={
                data.personalInfo.addressGroup.permanentAddress.cityMunicipality
              }
            />
            <AddressCell
              label="Province"
              value={data.personalInfo.addressGroup.permanentAddress.province}
            />

            {/* Row 13: PHILHEALTH & TELEPHONE */}
            <LabelBox label="13. PHILHEALTH NO." />
            <ValueBox
              value={data.personalInfo.governmentIds.philhealthNumber}
            />
            <LabelBox label="19. TELEPHONE NO." />
            {/* <ValueBox value={data.personalInfo.addressGroup.residentialAddress.contact} /> */}
            <ValueBox value={""} />

            {/* Row 14: PhilSys & MOBILE */}
            <LabelBox label="14. PhilSys Number (PSN)" />
            <ValueBox value={data.personalInfo.governmentIds.philSysNumber} />
            <LabelBox label="20. MOBILE NO." />
            {/* <ValueBox value={data.personalInfo.addressGroup.mobileNumber} /> */}
            <ValueBox value={""} />

            {/* Row 15: TIN & EMAIL */}
            <LabelBox label="15. TIN NO." />
            <ValueBox value={data.personalInfo.governmentIds.tinNumber} />
            <LabelBox label="21. E-MAIL ADDRESS (if any)" />
            {/* <ValueBox value={data.personalInfo.addressGroup.emailAddress} className="normal-case" /> */}
            <ValueBox value={""} className="normal-case" />

            {/* Row 16: AGENCY EMPLOYEE NO. */}
            <LabelBox label="16. AGENCY EMPLOYEE NO." />
            <ValueBox
              value={data.personalInfo.governmentIds.agencyEmployeeNumber}
            />
            {/* Filler blocks for the remaining right side of the bottom row */}
            <div className={`col-span-2 ${sideLabelBg} ${borderClass}`}></div>
            <ValueBox span={4} className="bg-[#f2f2f2]" />
          </div>
        </div>
      )}

      {/* --- SECTION II. FAMILY BACKGROUND --- */}
      {show("familyBackground") && (
        <div className="mt-0 border-l border-black text-black">
          <SectionHeader title="II. FAMILY BACKGROUND" />

          <div className="grid grid-cols-12 border-t border-black">
            {/* LEFT SIDE: Spouse & Parents (7 columns) */}
            <div className="col-span-7 grid grid-cols-7 border-r border-black">
              {/* Spouse Info */}
              <LabelBox label="22. SPOUSE'S SURNAME" span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseLastName}
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="FIRST NAME" span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseFirstName}
                span={2}
              />
              <div
                className={`${labelBg} ${borderClass} col-span-3 flex items-center justify-between p-1 text-[12px]`}
              >
                NAME EXTENSION (JR., SR)
                <span className="min-w-[30px] px-1 py-0.5 text-center text-[12px] font-medium uppercase">
                  {toValue(data.personalInfo.nameGroup.nameExtension)}
                </span>
              </div>

              <LabelBox label="MIDDLE NAME" span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseMiddleName}
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="OCCUPATION" span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseOccupation}
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="EMPLOYER/BUSINESS NAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.spouseInfo.spouseEmployerBusinessName
                }
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="BUSINESS ADDRESS" span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseBusinessAddress}
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="TELEPHONE NO." span={2} />
              <ValueBox
                value={data.familyBackground.spouseInfo.spouseTelephoneNo}
                span={5}
                className="!border-r-0"
              />

              {/* Father Info */}
              <LabelBox label="24. FATHER'S SURNAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherLastName
                }
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="FIRST NAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherFirstName
                }
                span={2}
              />
              <div
                className={`${labelBg} ${borderClass} col-span-3 flex items-center justify-between p-1 text-[12px]`}
              >
                NAME EXTENSION (JR., SR)
                <span className="min-w-[30px] px-1 py-0.5 text-center text-[12px] font-medium uppercase">
                  {toValue(data.personalInfo.nameGroup.nameExtension)}
                </span>
              </div>

              <LabelBox label="MIDDLE NAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherMiddleName
                }
                span={5}
                className="!border-r-0"
              />

              {/* Mother Info */}
              <div
                className={`${sideLabelBg} ${borderClass} col-span-7 flex items-center !border-r-0 p-1 text-[10px] text-black`}
              >
                25. MOTHER'S MAIDEN NAME
              </div>

              <LabelBox label="SURNAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherLastName
                }
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="FIRST NAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherFirstName
                }
                span={5}
                className="!border-r-0"
              />

              <LabelBox label="MIDDLE NAME" span={2} />
              <ValueBox
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherMiddleName
                }
                span={5}
                className="!border-r-0"
              />
            </div>

            {/* RIGHT SIDE: Children (5 columns) */}
            <div className="col-span-5 flex flex-col">
              <div
                className={`${labelBg} ${borderClass} !border-r-0 p-1 text-center text-[10px] leading-tight`}
              >
                23. NAME of CHILDREN (Write full name and list all)
              </div>
              <div
                className={`grid grid-cols-5 ${sideLabelBg} ${borderClass} !border-r-0`}
              >
                <div className="col-span-3 border-r border-black p-1 text-center text-[10px]">
                  NAME
                </div>
                <div className="col-span-2 p-1 text-center text-[10px] leading-tight">
                  DATE OF BIRTH (mm/dd/yyyy)
                </div>
              </div>

              {/* 12 Rows of Children */}
              {childrenRows.map((child, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-5 bg-white ${borderClass} flex-grow !border-r-0`}
                >
                  <div className="col-span-3 flex items-center truncate border-r border-black px-1.5 py-[3px] text-[7pt] font-medium uppercase">
                    {child.name}
                  </div>
                  <div className="col-span-2 flex items-center justify-center px-1.5 py-[3px] text-center text-[7pt] uppercase">
                    {child.dateOfBirth}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- SECTION III. EDUCATIONAL BACKGROUND --- */}
      {show("educationalBackground") && (
        <div className="mt-0 flex flex-grow flex-col border-l border-black text-black">
          <SectionHeader title="III. EDUCATIONAL BACKGROUND" />

          <table className="w-full table-fixed border-collapse border-b border-black">
            <thead>
              <tr
                className={`${sideLabelBg} text-center text-[12px] font-normal uppercase`}
              >
                <th
                  className={`${borderClass} w-[13%] p-1 font-normal`}
                  rowSpan={2}
                >
                  26. LEVEL
                </th>
                <th
                  className={`${borderClass} w-[20%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  NAME OF SCHOOL
                  <br />
                  <span className="text-[10px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[20%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  BASIC EDUCATION/
                  <br />
                  DEGREE/COURSE
                  <br />
                  <span className="text-[10px] font-normal normal-case">
                    (Write in full)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[12%] p-1 leading-tight font-normal`}
                  colSpan={2}
                >
                  PERIOD OF ATTENDANCE
                </th>
                <th
                  className={`${borderClass} w-[11%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  HIGHEST LEVEL/UNITS EARNED
                  <br />
                  <span className="text-[10px] font-normal normal-case">
                    (if not graduated)
                  </span>
                </th>
                <th
                  className={`${borderClass} w-[9%] p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  YEAR GRADUATED
                </th>
                <th
                  className={`${borderClass} w-[15%] !border-r-0 p-1 leading-tight font-normal`}
                  rowSpan={2}
                >
                  SCHOLARSHIP/ ACADEMIC HONORS RECEIVED
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
              {eduRows.map((row, index) => (
                <tr key={index} className="bg-white text-[12px] font-normal">
                  <td
                    className={`${borderClass} p-1 text-center font-normal ${sideLabelBg} !text-[12px]`}
                  >
                    {eduLabels[index]}
                  </td>
                  <td className={`${borderClass} p-1 uppercase`}>
                    {toValue(row.school)}
                  </td>
                  <td className={`${borderClass} p-1 uppercase`}>
                    {toValue(row.course)}
                  </td>
                  <td className={`${borderClass} p-1 text-center`}>
                    {toValue(row.attendanceFrom)}
                  </td>
                  <td className={`${borderClass} p-1 text-center`}>
                    {toValue(row.attendanceTo)}
                  </td>
                  <td className={`${borderClass} p-1 text-center uppercase`}>
                    {toValue(row.highestLevel)}
                  </td>
                  <td className={`${borderClass} p-1 text-center`}>
                    {toValue(row.yearGraduated)}
                  </td>
                  <td className={`${borderClass} !border-r-0 p-1 uppercase`}>
                    {toValue(row.honors)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- PAGE 1 FOOTER --- */}
      <div className="mt-4 flex flex-col text-black">
        {/* Top of footer: Disclaimer (Removed border-t to avoid double borders with the table above) */}
        <div className="border-b border-black bg-[#f2f2f2] p-1 px-2 text-[10px] font-normal italic">
          (Continue on separate sheet if necessary)
        </div>

        {/* Bottom of footer: Signatures */}
        <div className="grid grid-cols-12 bg-white">
          <div
            className={`${sideLabelBg} col-span-2 flex items-center justify-center border-r border-black p-1 text-[12px] font-bold`}
          >
            SIGNATURE
          </div>
          <div className="col-span-6 min-h-[26px] border-r border-black"></div>
          <div
            className={`${sideLabelBg} col-span-1 flex items-center justify-center border-r border-black p-1 text-[12px] font-bold`}
          >
            DATE
          </div>
          <div className="col-span-3 min-h-[26px]"></div>
        </div>
      </div>

      {/* PAGE 1 IDENTIFIER */}
      <div className="absolute right-0 -bottom-4 text-[10px] font-normal text-black italic">
        CS FORM 212 (Revised 2025), Page 1 of 4
      </div>
    </div>
  );
};

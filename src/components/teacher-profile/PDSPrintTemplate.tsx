import type {
  PDSPrintAddress,
  PDSPrintCriminalChargeQuestion,
  PDSPrintQuestion,
  PDSPrintTemplateData,
} from "@/pds-schema";
import type { CSSProperties } from "react";

export type PDSPrintPaperSize = "A4" | "Letter" | "Legal";
export type PDSPrintMode = "filled" | "blank";
export type PDSPrintSectionId =
  | "I"
  | "II"
  | "III"
  | "IV"
  | "V"
  | "VI"
  | "VII"
  | "VIII"
  | "IX";

const paperSizes: Record<PDSPrintPaperSize, CSSProperties> = {
  A4: { width: "210mm", minHeight: "297mm" },
  Letter: { width: "8.5in", minHeight: "11in" },
  Legal: { width: "8.5in", minHeight: "14in" },
};

export interface PDSPrintTemplateOptions {
  paperSize: PDSPrintPaperSize;
  mode: PDSPrintMode;
  includedSections: PDSPrintSectionId[];
}

const createEmptyFormData = (): PDSPrintTemplateData => ({
  // Section I
  personalInfo: {
    nameGroup: {},
    birthAndStatus: {},
    citizenshipGroup: {},
    physicalAttributes: {},
    governmentIds: {},
    addressGroup: {
      residentialAddress: {},
      permanentAddress: {},
    },
  },
  // Section II
  familyBackground: {
    spouseInfo: {},
    children: [],
    parentsGroup: {
      fatherInfo: {},
      motherInfo: {},
    },
  },
  // Section III
  educationalBackground: {
    elementary: {},
    secondary: {},
    college: {},
    graduateStudies: {},
  },
  // Section IV
  civilServiceEligibility: {
    eligibilityEntries: [],
  },
  // Section V
  workExperience: {
    workEntries: [],
  },
  // Section VI
  voluntaryWork: {
    voluntaryWorkEntries: [],
  },
  // Section VII
  training: {
    trainingEntries: [],
  },
  // Section VIII
  otherInformation: {
    skills: [],
    awards: [],
    memberships: [],
  },
  // Section IX
  additionalInformation: {
    legalQuestions: {
      relationThirdDegree: emptyQuestion(),
      adminOffense: emptyQuestion(),
      convictedCrime: emptyQuestion(),
      immigrantStatus: emptyQuestion(),
      criminalCharge: { ...emptyQuestion(), dateFiled: "", statusOfCase: "" },
    },
    specialLegalStatus: {
      indigenousGroup: emptyQuestion(),
      disability: { ...emptyQuestion(), idNumber: "" },
      soloParent: { ...emptyQuestion(), idNumber: "" },
    },
    references: [],
    declaration: {},
  },

  // --- TEMPLATE ROW BRIDGES ---
  // These are the flat arrays the actual JSX loops over
  educationRows: [],
  civilServiceRows: [],
  workExperienceRows: [],
  voluntaryWorkRows: [],
  trainingRows: [],
  otherInformationRows: [],
  references: [],
  declaration: {},
  photoUrl: "",
});

type EducationRow = PDSPrintTemplateData["educationRows"][number];
type CivilServiceRow = PDSPrintTemplateData["civilServiceRows"][number];
type WorkExperienceRow = PDSPrintTemplateData["workExperienceRows"][number];
type VoluntaryWorkRow = PDSPrintTemplateData["voluntaryWorkRows"][number];
type TrainingRow = PDSPrintTemplateData["trainingRows"][number];
type OtherInformationRow = PDSPrintTemplateData["otherInformationRows"][number];
type ChildRow = PDSPrintTemplateData["familyBackground"]["children"][number];
type ReferenceRow = PDSPrintTemplateData["references"][number];

const emptyQuestion = (): PDSPrintQuestion => ({ answer: "", details: "" });

const gridSpan = (count: number): CSSProperties => ({
  gridColumn: `span ${count} / span ${count}`,
});

const padRows = <T,>(rows: T[], minLength: number, factory: () => T) => {
  const next = [...rows];
  while (next.length < minLength) next.push(factory());
  return next;
};

const toValue = (value?: string | number | null): string => {
  if (value === undefined || value === null) return "";
  return String(value);
};

const AddressTable = ({
  title,
  address,
  includeContact = false,
}: {
  title: string;
  address: PDSPrintAddress;
  includeContact?: boolean;
}) => (
  <div className="grid grid-cols-12 gap-0 border-r border-l border-black">
    <ValueBox
      label={title}
      value={[address.houseBlockLotNo, address.street]
        .filter(Boolean)
        .join(" | ")}
      span={6}
    />
    <ValueBox
      label="Subdivision / Village | Barangay"
      value={[address.subdivisionVillage, address.barangay]
        .filter(Boolean)
        .join(" | ")}
      span={6}
    />
    <ValueBox
      label="City / Municipality | Province"
      value={[address.cityMunicipality, address.province]
        .filter(Boolean)
        .join(" | ")}
      span={6}
    />
    <ValueBox label="ZIP CODE" value={address.zipCode} span={2} />
    {includeContact ? (
      <>
        <ValueBox
          label="19. TELEPHONE NO."
          value={address.telephoneNo}
          span={2}
        />
        <ValueBox label="20. MOBILE NO." value={address.mobileNo} span={4} />
        <ValueBox
          label="21. E-MAIL ADDRESS"
          value={address.emailAddress}
          span={4}
        />
      </>
    ) : (
      <ValueBox label="" value="" span={4} />
    )}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mt-2 border-y border-black bg-[#9c9c9c] px-2 py-1">
    <h2 className="text-[10pt] font-bold text-white uppercase italic">
      {title}
    </h2>
  </div>
);

const ValueBox = ({
  label,
  value,
  span = 3,
}: {
  label: string;
  value?: string;
  span?: number;
}) => (
  <div
    className="min-h-[42px] border-r border-b border-black p-1"
    style={gridSpan(span)}
  >
    <div className="text-[7pt] uppercase">{label}</div>
    <div className="min-h-[16px] text-[8pt] font-medium whitespace-pre-wrap">
      {value || ""}
    </div>
  </div>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="border border-black p-1 text-center align-middle text-[7pt] font-bold uppercase">
    {children}
  </th>
);

const TableCell = ({ children }: { children?: React.ReactNode }) => (
  <td className="h-7 border border-black p-1 align-top text-[8pt]">
    {children || ""}
  </td>
);

const SignatureStrip = () => (
  <div className="grid grid-cols-[170px_minmax(0,1fr)_100px_minmax(0,1fr)] border-r border-b border-l border-black text-[8pt]">
    <div className="border-r border-black p-3 text-center font-bold italic">
      SIGNATURE
    </div>
    <div className="border-r border-black p-3 text-center text-red-600">
      (wet signature/e-signature/digital certificate)
    </div>
    <div className="border-r border-black p-3 text-center font-bold italic">
      DATE
    </div>
    <div className="p-3"></div>
  </div>
);

const AnswerCheckbox = ({
  label,
  checked,
}: {
  label: string;
  checked?: boolean;
}) => (
  <span className="inline-flex items-center gap-2">
    <span className="inline-flex h-3 w-3 items-center justify-center border border-black text-[7pt]">
      {checked ? "X" : ""}
    </span>
    {label}
  </span>
);

const QuestionRow = ({
  number,
  question,
  value,
  extra = [],
}: {
  number: string;
  question: string;
  value: PDSPrintQuestion | PDSPrintCriminalChargeQuestion;
  extra?: string[];
}) => (
  <div className="grid grid-cols-[minmax(0,1fr)_260px] border-r border-b border-l border-black text-[8pt]">
    <div className="p-2">
      <span className="font-semibold">{number}.</span> {question}
    </div>
    <div className="space-y-1 border-l border-black p-2">
      <div className="flex items-center gap-4">
        <AnswerCheckbox label="YES" checked={value?.answer === "Yes"} />
        <AnswerCheckbox label="NO" checked={value?.answer === "No"} />
      </div>
      <div>If YES, give details: {toValue(value?.details)}</div>
      {extra.filter(Boolean).map((item) => (
        <div key={item}>{item}</div>
      ))}
    </div>
  </div>
);

const InfoRow = ({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) => (
  <div className="grid grid-cols-[110px_minmax(0,1fr)] border-t border-black text-[7pt]">
    <div
      className={`border-r border-black p-1 ${bold ? "font-bold text-red-700 italic" : ""}`}
    >
      {label}
    </div>
    <div className="p-1">{value}</div>
  </div>
);

const SignatureBox = ({
  title,
  value = "",
}: {
  title: string;
  value?: string;
}) => (
  <div className="border border-black p-3 text-center">
    <div className="mx-auto mb-6 h-10 w-[220px] border-b border-black">
      <span className="align-bottom text-[8pt]">{value}</span>
    </div>
    <p className="text-[8pt]">{title}</p>
  </div>
);

export const PDSPrintTemplate = ({
  formData,
  options,
}: {
  formData: PDSPrintTemplateData;
  options: PDSPrintTemplateOptions;
}) => {
  // Use blank data if mode is blank, otherwise use the transformed formData
  const data = options.mode === "blank" ? createEmptyFormData() : formData;

  // Helper to check if a section should be rendered
  const show = (id: string) =>
    options.includedSections.includes(id as PDSPrintSectionId);

  // --- Row Padding Logic (Ensures the printed form looks like the official document) ---
  const educationRows = padRows<EducationRow>(data.educationRows, 5, () => ({
    level: "",
  }));
  const civilRows = padRows<CivilServiceRow>(
    data.civilServiceRows,
    7,
    () => ({}),
  );
  const workRows = padRows<WorkExperienceRow>(
    data.workExperienceRows,
    14,
    () => ({}),
  );
  const voluntaryRows = padRows<VoluntaryWorkRow>(
    data.voluntaryWorkRows,
    7,
    () => ({}),
  );
  const trainingRows = padRows<TrainingRow>(data.trainingRows, 14, () => ({}));
  const otherRows = padRows<OtherInformationRow>(
    data.otherInformationRows,
    7,
    () => ({}),
  );
  const childrenRows = padRows<ChildRow>(
    data.familyBackground.children,
    4,
    () => ({}),
  );
  const referenceRows = padRows<ReferenceRow>(data.references, 3, () => ({}));

  return (
    <div
      id="pds-printable-root"
      className="bg-white font-sans text-black print:mx-0 print:shadow-none"
      style={{
        width: paperSizes[options.paperSize].width,
        minHeight: paperSizes[options.paperSize].height,
        minWidth: paperSizes[options.paperSize].width,
      }}
    >
      <div className="border-2 border-black bg-white p-2 text-[8pt] leading-tight">
        {/* HEADER SECTION */}
        <p className="text-[8pt] italic">
          CS Form No. 212 <br /> Revised 2025
        </p>
        <h1 className="mt-1 text-center text-[18pt] font-black tracking-tighter">
          PERSONAL DATA SHEET
        </h1>
        <p className="mt-1 text-[7pt] font-bold italic">
          WARNING: Any misrepresentation made in the Personal Data Sheet and the
          Work Experience Sheet shall cause the filing of
          administrative/criminal case/s against the person concerned.
        </p>

        {/* I. PERSONAL INFORMATION */}
        {show("personalInfo") && (
          <div className="mt-2">
            <SectionHeader title="I. PERSONAL INFORMATION" />
            <div className="grid grid-cols-12 gap-0 border-r border-l border-black">
              <ValueBox
                label="1. SURNAME"
                value={data.personalInfo.nameGroup.lastName}
                span={8}
              />
              <ValueBox
                label="NAME EXTENSION (JR., SR.)"
                value={data.personalInfo.nameGroup.nameExtension}
                span={4}
              />
              <ValueBox
                label="2. FIRST NAME"
                value={data.personalInfo.nameGroup.firstName}
                span={8}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={data.personalInfo.nameGroup.middleName}
                span={4}
              />

              <ValueBox
                label="3. DATE OF BIRTH (dd/mm/yyyy)"
                value={data.personalInfo.birthAndStatus.dateOfBirth}
                span={4}
              />
              <ValueBox
                label="4. PLACE OF BIRTH"
                value={data.personalInfo.birthAndStatus.placeOfBirth}
                span={4}
              />

              <ValueBox
                label="16. CITIZENSHIP"
                value={[
                  data.personalInfo.citizenshipGroup.citizenshipStatus,
                  data.personalInfo.citizenshipGroup.dualCitizenshipMode,
                  data.personalInfo.citizenshipGroup.citizenshipCountry &&
                    `Country: ${data.personalInfo.citizenshipGroup.citizenshipCountry}`,
                ]
                  .filter(Boolean)
                  .join(" | ")}
                span={4}
              />

              <ValueBox
                label="5. SEX AT BIRTH"
                value={data.personalInfo.birthAndStatus.gender}
                span={3}
              />
              <ValueBox
                label="6. CIVIL STATUS"
                value={data.personalInfo.birthAndStatus.civilStatus}
                span={3}
              />
              <ValueBox
                label="7. HEIGHT (m)"
                value={data.personalInfo.physicalAttributes.heightCm}
                span={2}
              />
              <ValueBox
                label="8. WEIGHT (kg)"
                value={data.personalInfo.physicalAttributes.weightKg}
                span={2}
              />
              <ValueBox
                label="9. BLOOD TYPE"
                value={data.personalInfo.physicalAttributes.bloodType}
                span={2}
              />

              <ValueBox
                label="10. UMID ID NO."
                value={data.personalInfo.governmentIds.umidNumber}
                span={4}
              />
              <ValueBox
                label="11. PAG-IBIG ID NO."
                value={data.personalInfo.governmentIds.pagibigNumber}
                span={4}
              />
              <ValueBox
                label="12. PHILHEALTH NO."
                value={data.personalInfo.governmentIds.philhealthNumber}
                span={4}
              />
              <ValueBox
                label="13. PhilSys Number (PSN)"
                value={data.personalInfo.governmentIds.philSysNumber}
                span={4}
              />
              <ValueBox
                label="14. TIN NO."
                value={data.personalInfo.governmentIds.tinNumber}
                span={4}
              />
              <ValueBox
                label="15. AGENCY EMPLOYEE NO."
                value={data.personalInfo.governmentIds.agencyEmployeeNumber}
                span={4}
              />
            </div>
            <AddressTable
              title="17. RESIDENTIAL ADDRESS"
              address={data.personalInfo.addressGroup.residentialAddress}
              includeContact
            />
            <AddressTable
              title="18. PERMANENT ADDRESS"
              address={data.personalInfo.addressGroup.permanentAddress}
            />
          </div>
        )}

        {/* II. FAMILY BACKGROUND */}
        {show("familyBackground") && (
          <div className="mt-1">
            <SectionHeader title="II. FAMILY BACKGROUND" />
            <div className="grid grid-cols-12 gap-0 border-r border-l border-black">
              <ValueBox
                label="22. SPOUSE'S SURNAME"
                value={data.familyBackground.spouseInfo.spouseLastName}
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={data.familyBackground.spouseInfo.spouseFirstName}
                span={4}
              />
              <ValueBox
                label="NAME EXTENSION"
                value={data.familyBackground.spouseInfo.spouseNameExtension}
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={data.familyBackground.spouseInfo.spouseMiddleName}
                span={4}
              />
              <ValueBox
                label="OCCUPATION"
                value={data.familyBackground.spouseInfo.spouseOccupation}
                span={4}
              />
              <ValueBox
                label="EMPLOYER / BUSINESS NAME"
                value={
                  data.familyBackground.spouseInfo.spouseEmployerBusinessName
                }
                span={4}
              />
              <ValueBox
                label="BUSINESS ADDRESS"
                value={data.familyBackground.spouseInfo.spouseBusinessAddress}
                span={8}
              />
              <ValueBox
                label="TELEPHONE NO."
                value={data.familyBackground.spouseInfo.spouseTelephoneNo}
                span={4}
              />
            </div>

            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>23. NAME OF CHILDREN (Full name)</TableHead>
                  <TableHead>DATE OF BIRTH (dd/mm/yyyy)</TableHead>
                </tr>
              </thead>
              <tbody>
                {childrenRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.dateOfBirth}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-12 gap-0 border-r border-l border-black">
              <ValueBox
                label="24. FATHER'S SURNAME"
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherLastName
                }
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherFirstName
                }
                span={4}
              />
              <ValueBox
                label="NAME EXTENSION"
                value={
                  data.familyBackground.parentsGroup.fatherInfo
                    .fatherNameExtension
                }
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={
                  data.familyBackground.parentsGroup.fatherInfo.fatherMiddleName
                }
                span={4}
              />
              <ValueBox
                label="25. MOTHER'S MAIDEN NAME - SURNAME"
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherLastName
                }
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherFirstName
                }
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={
                  data.familyBackground.parentsGroup.motherInfo.motherMiddleName
                }
                span={4}
              />
            </div>
          </div>
        )}

        {/* III. EDUCATIONAL BACKGROUND */}
        {show("educationalBackground") && (
          <div className="mt-1">
            <SectionHeader title="III. EDUCATIONAL BACKGROUND" />
            <table className="w-full border-collapse text-[7pt]">
              <thead>
                <tr>
                  <TableHead>26. LEVEL</TableHead>
                  <TableHead>NAME OF SCHOOL</TableHead>
                  <TableHead>DEGREE / COURSE</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>UNITS EARNED</TableHead>
                  <TableHead>GRADUATED</TableHead>
                  <TableHead>SCHOLARSHIP/HONORS</TableHead>
                </tr>
              </thead>
              <tbody>
                {educationRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.level}</TableCell>
                    <TableCell>{row.school}</TableCell>
                    <TableCell>{row.course}</TableCell>
                    <TableCell>{row.attendanceFrom}</TableCell>
                    <TableCell>{row.attendanceTo}</TableCell>
                    <TableCell>{row.highestLevel}</TableCell>
                    <TableCell>{row.yearGraduated}</TableCell>
                    <TableCell>{row.honors}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
            <SignatureStrip />
          </div>
        )}

        {/* IV. CIVIL SERVICE ELIGIBILITY */}
        {show("civilServiceEligibility") && (
          <div className="mt-1">
            <SectionHeader title="IV. CIVIL SERVICE ELIGIBILITY" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>
                    27. CAREER SERVICE / RA 1080 / BOARD / BAR
                  </TableHead>
                  <TableHead>RATING</TableHead>
                  <TableHead>EXAM DATE</TableHead>
                  <TableHead>EXAM PLACE</TableHead>
                  <TableHead>LICENSE NO.</TableHead>
                  <TableHead>VALIDITY</TableHead>
                </tr>
              </thead>
              <tbody>
                {civilRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.eligibility}</TableCell>
                    <TableCell>{row.rating}</TableCell>
                    <TableCell>{row.examDate}</TableCell>
                    <TableCell>{row.examPlace}</TableCell>
                    <TableCell>{row.licenseNumber}</TableCell>
                    <TableCell>{row.validity}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* V. WORK EXPERIENCE */}
        {show("workExperience") && (
          <div className="mt-1">
            <SectionHeader title="V. WORK EXPERIENCE" />
            <table className="w-full border-collapse text-[7pt]">
              <thead>
                <tr>
                  <TableHead>28. FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>POSITION TITLE</TableHead>
                  <TableHead>DEPARTMENT / AGENCY / COMPANY</TableHead>
                  <TableHead>STATUS</TableHead>
                  <TableHead>GOV'T (Y/N)</TableHead>
                </tr>
              </thead>
              <tbody>
                {workRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.fromDate}</TableCell>
                    <TableCell>{row.toDate}</TableCell>
                    <TableCell>{row.positionTitle}</TableCell>
                    <TableCell>{row.departmentAgencyOfficeCompany}</TableCell>
                    <TableCell>{row.statusOfAppointment}</TableCell>
                    <TableCell>{row.governmentService}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VI. VOLUNTARY WORK */}
        {show("voluntaryWork") && (
          <div className="mt-1">
            <SectionHeader title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S" />
            <table className="w-full border-collapse text-[7pt]">
              <thead>
                <tr>
                  <TableHead>29. NAME & ADDRESS OF ORGANIZATION</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>HOURS</TableHead>
                  <TableHead>POSITION / NATURE OF WORK</TableHead>
                </tr>
              </thead>
              <tbody>
                {voluntaryRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.organization}</TableCell>
                    <TableCell>{row.fromDate}</TableCell>
                    <TableCell>{row.toDate}</TableCell>
                    <TableCell>{row.hours}</TableCell>
                    <TableCell>{row.positionNatureOfWork}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VII. LEARNING & DEVELOPMENT */}
        {show("training") && (
          <div className="mt-1">
            <SectionHeader title="VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS / TRAINING PROGRAMS ATTENDED" />
            <table className="w-full border-collapse text-[7pt]">
              <thead>
                <tr>
                  <TableHead>30. TITLE OF TRAINING PROGRAM</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>HOURS</TableHead>
                  <TableHead>TYPE</TableHead>
                  <TableHead>CONDUCTED / SPONSORED BY</TableHead>
                </tr>
              </thead>
              <tbody>
                {trainingRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.title}</TableCell>
                    <TableCell>{row.fromDate}</TableCell>
                    <TableCell>{row.toDate}</TableCell>
                    <TableCell>{row.hours}</TableCell>
                    <TableCell>{row.typeOfLd}</TableCell>
                    <TableCell>{row.conductedBy}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIII. OTHER INFORMATION */}
        {show("otherInformation") && (
          <div className="mt-1">
            <SectionHeader title="VIII. OTHER INFORMATION" />
            <table className="w-full border-collapse text-[7pt]">
              <thead>
                <tr>
                  <TableHead>31. SPECIAL SKILLS and HOBBIES</TableHead>
                  <TableHead>
                    32. NON-ACADEMIC DISTINCTIONS / RECOGNITION
                  </TableHead>
                  <TableHead>
                    33. MEMBERSHIP IN ASSOCIATION / ORGANIZATION
                  </TableHead>
                </tr>
              </thead>
              <tbody>
                {otherRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.skill}</TableCell>
                    <TableCell>{row.distinction}</TableCell>
                    <TableCell>{row.membership}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
            <SignatureStrip />
          </div>
        )}

        {/* IX. QUESTIONS & DECLARATION */}
        {show("additionalInformation") && (
          <div style={{ breakBefore: "page" }}>
            <SectionHeader title="IX. ADDITIONAL INFORMATION, REFERENCES & DECLARATION" />
            <QuestionRow
              number="34.a"
              question="Are you related by consanguinity or affinity to the appointing authority within the third degree?"
              value={
                data.additionalInformation.legalQuestions.relationThirdDegree
              }
            />
            <QuestionRow
              number="35.a"
              question="Have you ever been found guilty of any administrative offense?"
              value={data.additionalInformation.legalQuestions.adminOffense}
            />
            <QuestionRow
              number="35.b"
              question="Have you been criminally charged before any court?"
              value={data.additionalInformation.legalQuestions.criminalCharge}
              extra={[
                `Date Filed: ${toValue(toValue(data?.additionalInformation?.legalQuestions?.criminalCharge?.dateFiled))}`,
                `Status: ${toValue(toValue(data?.additionalInformation?.legalQuestions?.criminalCharge?.statusOfCase))}`,
              ]}
            />
            <QuestionRow
              number="40.a"
              question="Are you a member of any indigenous group?"
              value={
                data.additionalInformation.specialLegalStatus.indigenousGroup
              }
            />
            <QuestionRow
              number="40.b"
              question="Are you a person with disability?"
              value={data.additionalInformation.specialLegalStatus.disability}
              extra={[
                `ID No.: ${toValue(data?.additionalInformation?.specialLegalStatus?.disability?.idNumber)}`,
              ]}
            />

            <table className="mt-2 w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>41. CHARACTER REFERENCES</TableHead>
                  <TableHead>ADDRESS</TableHead>
                  <TableHead>CONTACT NO.</TableHead>
                </tr>
              </thead>
              <tbody>
                {referenceRows.map((row, index) => (
                  <tr key={index}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* DECLARATION BOX */}
            <div className="mt-2 grid grid-cols-[1fr_140px] gap-2 border border-black p-2">
              <p className="text-[7pt] leading-tight italic">
                42. I declare under oath that I have personally accomplished
                this Personal Data Sheet...
              </p>
              <div className="flex h-[120px] w-full flex-col items-center justify-center border border-black">
                <span className="text-[6pt]">PHOTO (Passport size)</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-[220px_1fr] gap-4">
              <div className="border border-black p-1">
                <InfoRow
                  label="ID Type"
                  value={toValue(data.declaration.governmentIdType)}
                />
                <InfoRow
                  label="ID No."
                  value={toValue(data.declaration.governmentIdNumber)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SignatureBox title="Signature" />
                <SignatureBox
                  title="Date"
                  value={toValue(data.declaration.dateAccomplished)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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

type Answer = "" | "Yes" | "No";

export interface PDSPrintTemplateOptions {
  paperSize: PDSPrintPaperSize;
  mode: PDSPrintMode;
  includedSections: PDSPrintSectionId[];
}

export interface PDSPrintAddress {
  houseBlockLotNo?: string;
  street?: string;
  subdivisionVillage?: string;
  barangay?: string;
  cityMunicipality?: string;
  province?: string;
  zipCode?: string;
  telephoneNo?: string;
  mobileNo?: string;
  emailAddress?: string;
}

export interface PDSPrintQuestion {
  answer?: Answer;
  details?: string;
}

export interface PDSPrintCriminalChargeQuestion extends PDSPrintQuestion {
  dateFiled?: string;
  statusOfCase?: string;
}

export interface PDSPrintTemplateData {
  personal: {
    lastName?: string;
    firstName?: string;
    middleName?: string;
    nameExtension?: string;
    dateOfBirth?: string;
    placeOfBirth?: string;
    sex?: string;
    civilStatus?: string;
    citizenshipStatus?: string;
    dualCitizenshipMode?: string;
    citizenshipCountry?: string;
    heightMeters?: string;
    weightKg?: string;
    bloodType?: string;
  };
  governmentIds: {
    umidNumber?: string;
    gsisNumber?: string;
    pagibigNumber?: string;
    philhealthNumber?: string;
    philSysNumber?: string;
    sssNumber?: string;
    tinNumber?: string;
    agencyEmployeeNumber?: string;
  };
  residentialAddress: PDSPrintAddress;
  permanentAddress: PDSPrintAddress;
  familyBackground: {
    spouseLastName?: string;
    spouseFirstName?: string;
    spouseMiddleName?: string;
    spouseNameExtension?: string;
    spouseOccupation?: string;
    spouseEmployerBusinessName?: string;
    spouseBusinessAddress?: string;
    spouseTelephoneNo?: string;
    children: Array<{ name?: string; dateOfBirth?: string }>;
    fatherLastName?: string;
    fatherFirstName?: string;
    fatherMiddleName?: string;
    fatherNameExtension?: string;
    motherLastName?: string;
    motherFirstName?: string;
    motherMiddleName?: string;
  };
  educationRows: Array<{ level: string; school?: string; course?: string; attendanceFrom?: string; attendanceTo?: string; highestLevel?: string; yearGraduated?: string; honors?: string }>;
  civilServiceRows: Array<{ eligibility?: string; rating?: string; examDate?: string; examPlace?: string; licenseNumber?: string; validity?: string }>;
  workExperienceRows: Array<{ fromDate?: string; toDate?: string; positionTitle?: string; departmentAgencyOfficeCompany?: string; statusOfAppointment?: string; governmentService?: string }>;
  voluntaryWorkRows: Array<{ organization?: string; fromDate?: string; toDate?: string; hours?: string; positionNatureOfWork?: string }>;
  trainingRows: Array<{ title?: string; fromDate?: string; toDate?: string; hours?: string; typeOfLd?: string; conductedBy?: string }>;
  otherInformationRows: Array<{ skill?: string; distinction?: string; membership?: string }>;
  additionalInformation: {
    relationThirdDegree: PDSPrintQuestion;
    relationFourthDegree: PDSPrintQuestion;
    adminOffense: PDSPrintQuestion;
    criminalCharge: PDSPrintCriminalChargeQuestion;
    convictedCrime: PDSPrintQuestion;
    separatedService: PDSPrintQuestion;
    candidateElection: PDSPrintQuestion;
    resignedDuringCampaign: PDSPrintQuestion;
    immigrantStatus: PDSPrintQuestion;
    indigenousGroup: PDSPrintQuestion;
    disability: PDSPrintQuestion & { idNumber?: string };
    soloParent: PDSPrintQuestion & { idNumber?: string };
  };
  references: Array<{ name?: string; address?: string; contact?: string }>;
  declaration: {
    governmentIdType?: string;
    governmentIdNumber?: string;
    governmentIdIssueDate?: string;
    governmentIdIssuePlace?: string;
    dateAccomplished?: string;
  };
  photoUrl?: string;
}

type EducationRow = PDSPrintTemplateData["educationRows"][number];
type CivilServiceRow = PDSPrintTemplateData["civilServiceRows"][number];
type WorkExperienceRow = PDSPrintTemplateData["workExperienceRows"][number];
type VoluntaryWorkRow = PDSPrintTemplateData["voluntaryWorkRows"][number];
type TrainingRow = PDSPrintTemplateData["trainingRows"][number];
type OtherInformationRow = PDSPrintTemplateData["otherInformationRows"][number];
type ChildRow = PDSPrintTemplateData["familyBackground"]["children"][number];
type ReferenceRow = PDSPrintTemplateData["references"][number];

const paperSizes: Record<PDSPrintPaperSize, CSSProperties> = {
  A4: { width: "210mm", minHeight: "297mm" },
  Letter: { width: "8.5in", minHeight: "11in" },
  Legal: { width: "8.5in", minHeight: "14in" },
};

const emptyQuestion = (): PDSPrintQuestion => ({ answer: "", details: "" });

const createEmptyFormData = (): PDSPrintTemplateData => ({
  personal: {},
  governmentIds: {},
  residentialAddress: {},
  permanentAddress: {},
  familyBackground: { children: [] },
  educationRows: [],
  civilServiceRows: [],
  workExperienceRows: [],
  voluntaryWorkRows: [],
  trainingRows: [],
  otherInformationRows: [],
  additionalInformation: {
    relationThirdDegree: emptyQuestion(),
    relationFourthDegree: emptyQuestion(),
    adminOffense: emptyQuestion(),
    criminalCharge: { ...emptyQuestion(), dateFiled: "", statusOfCase: "" },
    convictedCrime: emptyQuestion(),
    separatedService: emptyQuestion(),
    candidateElection: emptyQuestion(),
    resignedDuringCampaign: emptyQuestion(),
    immigrantStatus: emptyQuestion(),
    indigenousGroup: emptyQuestion(),
    disability: { ...emptyQuestion(), idNumber: "" },
    soloParent: { ...emptyQuestion(), idNumber: "" },
  },
  references: [],
  declaration: {},
  photoUrl: "",
});

const gridSpan = (count: number): CSSProperties => ({
  gridColumn: `span ${count} / span ${count}`,
});

const padRows = <T,>(rows: T[], minLength: number, factory: () => T) => {
  const next = [...rows];
  while (next.length < minLength) next.push(factory());
  return next;
};

const toValue = (value?: string | number) => (value == null ? "" : String(value));

const AddressTable = ({
  title,
  address,
  includeContact = false,
}: {
  title: string;
  address: PDSPrintAddress;
  includeContact?: boolean;
}) => (
  <div className="grid grid-cols-12 gap-0 border-l border-r border-black">
    <ValueBox
      label={title}
      value={[address.houseBlockLotNo, address.street].filter(Boolean).join(" | ")}
      span={6}
    />
    <ValueBox
      label="Subdivision / Village | Barangay"
      value={[address.subdivisionVillage, address.barangay].filter(Boolean).join(" | ")}
      span={6}
    />
    <ValueBox
      label="City / Municipality | Province"
      value={[address.cityMunicipality, address.province].filter(Boolean).join(" | ")}
      span={6}
    />
    <ValueBox label="ZIP CODE" value={address.zipCode} span={2} />
    {includeContact ? (
      <>
        <ValueBox label="19. TELEPHONE NO." value={address.telephoneNo} span={2} />
        <ValueBox label="20. MOBILE NO." value={address.mobileNo} span={4} />
        <ValueBox label="21. E-MAIL ADDRESS" value={address.emailAddress} span={4} />
      </>
    ) : (
      <ValueBox label="" value="" span={4} />
    )}
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <div className="mt-2 border-y border-black bg-[#9c9c9c] px-2 py-1">
    <h2 className="text-[10pt] font-bold italic uppercase text-white">{title}</h2>
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
  <div className="min-h-[42px] border-b border-r border-black p-1" style={gridSpan(span)}>
    <div className="text-[7pt] uppercase">{label}</div>
    <div className="min-h-[16px] whitespace-pre-wrap text-[8pt] font-medium">
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
  <td className="h-7 border border-black p-1 align-top text-[8pt]">{children || ""}</td>
);

const SignatureStrip = () => (
  <div className="grid grid-cols-[170px_minmax(0,1fr)_100px_minmax(0,1fr)] border-l border-r border-b border-black text-[8pt]">
    <div className="border-r border-black p-3 text-center font-bold italic">SIGNATURE</div>
    <div className="border-r border-black p-3 text-center text-red-600">
      (wet signature/e-signature/digital certificate)
    </div>
    <div className="border-r border-black p-3 text-center font-bold italic">DATE</div>
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
  <div className="grid grid-cols-[minmax(0,1fr)_260px] border-l border-r border-b border-black text-[8pt]">
    <div className="p-2">
      <span className="font-semibold">{number}.</span> {question}
    </div>
    <div className="space-y-1 border-l border-black p-2">
      <div className="flex items-center gap-4">
        <AnswerCheckbox label="YES" checked={value.answer === "Yes"} />
        <AnswerCheckbox label="NO" checked={value.answer === "No"} />
      </div>
      <div>If YES, give details: {toValue(value.details)}</div>
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
    <div className={`border-r border-black p-1 ${bold ? "font-bold italic text-red-700" : ""}`}>
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

const PDSPrintTemplate = ({
  formData,
  options,
}: {
  formData: PDSPrintTemplateData;
  options: PDSPrintTemplateOptions;
}) => {
  const data = options.mode === "blank" ? createEmptyFormData() : formData;
  const show = (id: PDSPrintSectionId) => options.includedSections.includes(id);
  const educationRows = padRows<EducationRow>(data.educationRows, 5, () => ({ level: "" }));
  const civilRows = padRows<CivilServiceRow>(data.civilServiceRows, 7, () => ({}));
  const workRows = padRows<WorkExperienceRow>(data.workExperienceRows, 14, () => ({}));
  const voluntaryRows = padRows<VoluntaryWorkRow>(data.voluntaryWorkRows, 7, () => ({}));
  const trainingRows = padRows<TrainingRow>(data.trainingRows, 14, () => ({}));
  const otherRows = padRows<OtherInformationRow>(data.otherInformationRows, 7, () => ({}));
  const childrenRows = padRows<ChildRow>(data.familyBackground.children, 4, () => ({}));
  const referenceRows = padRows<ReferenceRow>(data.references, 3, () => ({}));

  return (
    <div
      className="pds-print-template w-full max-w-full bg-white font-sans text-black"
      style={paperSizes[options.paperSize]}
    >
      <div className="border-2 border-black bg-white p-2 text-[8pt] leading-tight">
        <p className="text-[8pt] italic">
          CS Form No. 212
          <br />
          Revised 2025
        </p>
        <h1 className="mt-1 text-center text-[18pt] font-black">PERSONAL DATA SHEET</h1>
        <p className="mt-1 text-[8pt] font-bold italic">
          WARNING: Any misrepresentation made in the Personal Data Sheet and the Work Experience Sheet shall cause the filing of administrative/criminal case/s against the person concerned.
        </p>
        <p className="mt-1 text-[8pt] font-semibold">
          READ THE ATTACHED GUIDE TO FILLING OUT THE PERSONAL DATA SHEET (PDS) BEFORE ACCOMPLISHING THE PDS FORM.
        </p>
        <p className="mt-1 text-[8pt]">
          Print legibly if accomplished through handwriting. Tick appropriate box/es and use separate sheet if necessary. Indicate N/A if not applicable. DO NOT ABBREVIATE.
        </p>

        {show("I") && (
          <div>
            <SectionHeader title="I. PERSONAL INFORMATION" />
            <div className="grid grid-cols-12 gap-0 border-l border-r border-black">
              <ValueBox label="1. SURNAME" value={data.personal.lastName} span={8} />
              <ValueBox
                label="NAME EXTENSION (JR., SR.)"
                value={data.personal.nameExtension}
                span={4}
              />
              <ValueBox label="2. FIRST NAME" value={data.personal.firstName} span={8} />
              <ValueBox label="MIDDLE NAME" value={data.personal.middleName} span={4} />
              <ValueBox
                label="3. DATE OF BIRTH (dd/mm/yyyy)"
                value={data.personal.dateOfBirth}
                span={4}
              />
              <ValueBox label="4. PLACE OF BIRTH" value={data.personal.placeOfBirth} span={4} />
              <ValueBox
                label="16. CITIZENSHIP"
                value={[
                  data.personal.citizenshipStatus,
                  data.personal.dualCitizenshipMode,
                  data.personal.citizenshipCountry &&
                    `Country: ${data.personal.citizenshipCountry}`,
                ]
                  .filter(Boolean)
                  .join(" | ")}
                span={4}
              />
              <ValueBox label="5. SEX AT BIRTH" value={data.personal.sex} span={3} />
              <ValueBox label="6. CIVIL STATUS" value={data.personal.civilStatus} span={3} />
              <ValueBox label="7. HEIGHT (m)" value={data.personal.heightMeters} span={2} />
              <ValueBox label="8. WEIGHT (kg)" value={data.personal.weightKg} span={2} />
              <ValueBox label="9. BLOOD TYPE" value={data.personal.bloodType} span={2} />
              <ValueBox label="10. UMID ID NO." value={data.governmentIds.umidNumber} span={4} />
              <ValueBox
                label="11. PAG-IBIG ID NO."
                value={data.governmentIds.pagibigNumber}
                span={4}
              />
              <ValueBox
                label="12. PHILHEALTH NO."
                value={data.governmentIds.philhealthNumber}
                span={4}
              />
              <ValueBox
                label="13. PhilSys Number (PSN)"
                value={data.governmentIds.philSysNumber}
                span={4}
              />
              <ValueBox label="14. TIN NO." value={data.governmentIds.tinNumber} span={4} />
              <ValueBox
                label="15. AGENCY EMPLOYEE NO."
                value={data.governmentIds.agencyEmployeeNumber}
                span={4}
              />
            </div>
            <AddressTable
              title="17. RESIDENTIAL ADDRESS"
              address={data.residentialAddress}
              includeContact
            />
            <AddressTable
              title="18. PERMANENT ADDRESS"
              address={data.permanentAddress}
            />
          </div>
        )}

        {show("II") && (
          <div>
            <SectionHeader title="II. FAMILY BACKGROUND" />
            <div className="grid grid-cols-12 gap-0 border-l border-r border-black">
              <ValueBox
                label="22. SPOUSE'S SURNAME"
                value={data.familyBackground.spouseLastName}
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={data.familyBackground.spouseFirstName}
                span={4}
              />
              <ValueBox
                label="NAME EXTENSION (JR., SR.)"
                value={data.familyBackground.spouseNameExtension}
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={data.familyBackground.spouseMiddleName}
                span={4}
              />
              <ValueBox
                label="OCCUPATION"
                value={data.familyBackground.spouseOccupation}
                span={4}
              />
              <ValueBox
                label="EMPLOYER / BUSINESS NAME"
                value={data.familyBackground.spouseEmployerBusinessName}
                span={4}
              />
              <ValueBox
                label="BUSINESS ADDRESS"
                value={data.familyBackground.spouseBusinessAddress}
                span={8}
              />
              <ValueBox
                label="TELEPHONE NO."
                value={data.familyBackground.spouseTelephoneNo}
                span={4}
              />
            </div>

            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>23. NAME OF CHILDREN (Write full name and list all)</TableHead>
                  <TableHead>DATE OF BIRTH (dd/mm/yyyy)</TableHead>
                </tr>
              </thead>
              <tbody>
                {childrenRows.map((row, index) => (
                  <tr key={`${row.name || "child"}-${index}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.dateOfBirth}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-12 gap-0 border-l border-r border-black">
              <ValueBox
                label="24. FATHER'S SURNAME"
                value={data.familyBackground.fatherLastName}
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={data.familyBackground.fatherFirstName}
                span={4}
              />
              <ValueBox
                label="NAME EXTENSION (JR., SR.)"
                value={data.familyBackground.fatherNameExtension}
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={data.familyBackground.fatherMiddleName}
                span={4}
              />
              <ValueBox
                label="25. MOTHER'S MAIDEN NAME - SURNAME"
                value={data.familyBackground.motherLastName}
                span={4}
              />
              <ValueBox
                label="FIRST NAME"
                value={data.familyBackground.motherFirstName}
                span={4}
              />
              <ValueBox
                label="MIDDLE NAME"
                value={data.familyBackground.motherMiddleName}
                span={4}
              />
            </div>
          </div>
        )}

        {show("III") && (
          <div>
            <SectionHeader title="III. EDUCATIONAL BACKGROUND" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>26. LEVEL</TableHead>
                  <TableHead>NAME OF SCHOOL (Write in full)</TableHead>
                  <TableHead>BASIC EDUCATION / DEGREE / COURSE (Write in full)</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>HIGHEST LEVEL / UNITS EARNED</TableHead>
                  <TableHead>YEAR GRADUATED</TableHead>
                  <TableHead>SCHOLARSHIP / ACADEMIC HONORS RECEIVED</TableHead>
                </tr>
              </thead>
              <tbody>
                {educationRows.map((row, index) => (
                  <tr key={`${row.level || "education"}-${index}`}>
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

        {show("IV") && (
          <div>
            <SectionHeader title="IV. CIVIL SERVICE ELIGIBILITY" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>
                    27. CAREER SERVICE / RA 1080 / BOARD / BAR / SPECIAL LAW
                  </TableHead>
                  <TableHead>RATING</TableHead>
                  <TableHead>DATE OF EXAMINATION / CONFERMENT</TableHead>
                  <TableHead>PLACE OF EXAMINATION / CONFERMENT</TableHead>
                  <TableHead>LICENSE NUMBER</TableHead>
                  <TableHead>VALID UNTIL</TableHead>
                </tr>
              </thead>
              <tbody>
                {civilRows.map((row, index) => (
                  <tr key={`${row.eligibility || "civil"}-${index}`}>
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

        {show("V") && (
          <div>
            <SectionHeader title="V. WORK EXPERIENCE" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>28. FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>POSITION TITLE</TableHead>
                  <TableHead>DEPARTMENT / AGENCY / OFFICE / COMPANY</TableHead>
                  <TableHead>STATUS OF APPOINTMENT</TableHead>
                  <TableHead>GOV'T SERVICE (Y / N)</TableHead>
                </tr>
              </thead>
              <tbody>
                {workRows.map((row, index) => (
                  <tr key={`${row.positionTitle || "work"}-${index}`}>
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

        {show("VI") && (
          <div>
            <SectionHeader title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>29. NAME & ADDRESS OF ORGANIZATION</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>NUMBER OF HOURS</TableHead>
                  <TableHead>POSITION / NATURE OF WORK</TableHead>
                </tr>
              </thead>
              <tbody>
                {voluntaryRows.map((row, index) => (
                  <tr key={`${row.organization || "voluntary"}-${index}`}>
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

        {show("VII") && (
          <div>
            <SectionHeader title="VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS / TRAINING PROGRAMS ATTENDED" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>30. TITLE OF LEARNING AND DEVELOPMENT INTERVENTIONS / TRAINING PROGRAMS</TableHead>
                  <TableHead>FROM</TableHead>
                  <TableHead>TO</TableHead>
                  <TableHead>NUMBER OF HOURS</TableHead>
                  <TableHead>TYPE OF L&D</TableHead>
                  <TableHead>CONDUCTED / SPONSORED BY</TableHead>
                </tr>
              </thead>
              <tbody>
                {trainingRows.map((row, index) => (
                  <tr key={`${row.title || "training"}-${index}`}>
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

        {show("VIII") && (
          <div>
            <SectionHeader title="VIII. OTHER INFORMATION" />
            <table className="w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>31. SPECIAL SKILLS and HOBBIES</TableHead>
                  <TableHead>32. NON-ACADEMIC DISTINCTIONS / RECOGNITION</TableHead>
                  <TableHead>33. MEMBERSHIP IN ASSOCIATION / ORGANIZATION</TableHead>
                </tr>
              </thead>
              <tbody>
                {otherRows.map((row, index) => (
                  <tr
                    key={`${row.skill || row.distinction || row.membership || "other"}-${index}`}
                  >
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

        {show("IX") && (
          <div style={{ breakBefore: "page" }}>
            <SectionHeader title="IX. ADDITIONAL INFORMATION, REFERENCES & DECLARATION" />
            <QuestionRow
              number="34.a"
              question="Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or office, or to the person who has immediate supervision over you in the Office, Bureau or Department where you will be appointed, within the third degree?"
              value={data.additionalInformation.relationThirdDegree}
            />
            <QuestionRow
              number="34.b"
              question="Are you related within the fourth degree (for Local Government Unit - Career Employees)?"
              value={data.additionalInformation.relationFourthDegree}
            />
            <QuestionRow
              number="35.a"
              question="Have you ever been found guilty of any administrative offense?"
              value={data.additionalInformation.adminOffense}
            />
            <QuestionRow
              number="35.b"
              question="Have you been criminally charged before any court?"
              value={data.additionalInformation.criminalCharge}
              extra={[
                `Date Filed: ${toValue(data.additionalInformation.criminalCharge.dateFiled)}`,
                `Status of Case/s: ${toValue(data.additionalInformation.criminalCharge.statusOfCase)}`,
              ]}
            />
            <QuestionRow
              number="36"
              question="Have you ever been convicted of any crime or violation of any law, decree, ordinance, or regulation by any court or tribunal?"
              value={data.additionalInformation.convictedCrime}
            />
            <QuestionRow
              number="37"
              question="Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
              value={data.additionalInformation.separatedService}
            />
            <QuestionRow
              number="38.a"
              question="Have you been a candidate in a national or local election held within the last year (except Barangay election)?"
              value={data.additionalInformation.candidateElection}
            />
            <QuestionRow
              number="38.b"
              question="Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?"
              value={data.additionalInformation.resignedDuringCampaign}
            />
            <QuestionRow
              number="39"
              question="Have you acquired the status of an immigrant or permanent resident of another country?"
              value={data.additionalInformation.immigrantStatus}
            />
            <QuestionRow
              number="40.a"
              question="Are you a member of any indigenous group?"
              value={data.additionalInformation.indigenousGroup}
            />
            <QuestionRow
              number="40.b"
              question="Are you a person with disability?"
              value={data.additionalInformation.disability}
              extra={[
                `Disability ID No.: ${toValue(data.additionalInformation.disability.idNumber)}`,
              ]}
            />
            <QuestionRow
              number="40.c"
              question="Are you a solo parent?"
              value={data.additionalInformation.soloParent}
              extra={[
                `Solo Parent ID No.: ${toValue(data.additionalInformation.soloParent.idNumber)}`,
              ]}
            />

            <table className="mt-2 w-full border-collapse text-[8pt]">
              <thead>
                <tr>
                  <TableHead>41. NAME</TableHead>
                  <TableHead>OFFICE / RESIDENTIAL ADDRESS</TableHead>
                  <TableHead>CONTACT NO. AND/OR EMAIL</TableHead>
                </tr>
              </thead>
              <tbody>
                {referenceRows.map((row, index) => (
                  <tr key={`${row.name || "reference"}-${index}`}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell>{row.contact}</TableCell>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-2 grid grid-cols-[minmax(0,1fr)_140px] gap-4">
              <div className="border border-black p-2">
                <p className="text-[8pt]">
                  42. I declare under oath that I have personally accomplished this Personal Data Sheet which is a true, correct, and complete statement pursuant to the provisions of pertinent laws, rules, and regulations of the Republic of the Philippines. I authorize the agency head/authorized representative to verify/validate the contents stated herein. I agree that any misrepresentation made in this document and its attachments shall cause the filing of administrative/criminal case/s against me.
                </p>
              </div>
              <div className="grid gap-4">
                <div className="flex h-[150px] flex-col border border-black">
                  <div className="flex flex-1 items-center justify-center overflow-hidden p-2">
                    {data.photoUrl ? (
                      <img
                        src={data.photoUrl}
                        alt="Passport-sized ID"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <p className="text-center text-[7pt]">
                        Passport-sized unfiltered digital picture taken within the last 6 months
                      </p>
                    )}
                  </div>
                  <div className="border-t border-black p-1 text-center text-[8pt]">PHOTO</div>
                </div>
                <div className="flex h-[150px] flex-col border border-black">
                  <div className="flex-1"></div>
                  <div className="border-t border-black p-1 text-center text-[8pt]">
                    Right Thumbmark
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-[220px_minmax(0,1fr)] gap-4">
              <div className="border border-black">
                <div className="border-b border-black p-1 text-[7pt] font-bold">
                  Government Issued ID
                </div>
                <InfoRow
                  label="PLEASE INDICATE ID Number and Date of Issue"
                  value=""
                  bold
                />
                <InfoRow
                  label="Government Issued"
                  value={toValue(data.declaration.governmentIdType)}
                />
                <InfoRow
                  label="ID/License/Passport No."
                  value={toValue(data.declaration.governmentIdNumber)}
                />
                <InfoRow
                  label="Date of Issue"
                  value={toValue(data.declaration.governmentIdIssueDate)}
                />
                <InfoRow
                  label="Place of Issue"
                  value={toValue(data.declaration.governmentIdIssuePlace)}
                />
              </div>
              <div className="space-y-2">
                <SignatureBox title="Signature (Sign inside the box)" />
                <SignatureBox
                  title="Date Accomplished"
                  value={toValue(data.declaration.dateAccomplished)}
                />
                <div className="border border-black p-3 text-center">
                  <div className="mx-auto mb-6 h-12 w-[220px] border-b border-black"></div>
                  <p className="text-[8pt]">Person Administering Oath</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDSPrintTemplate;

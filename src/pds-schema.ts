export type PDSFieldType =
  | "text"
  | "number"
  | "select"
  | "radio"
  | "email"
  | "date"
  | "question";

export interface PDSFieldConfig {
  name: string;
  label: string;
  type: PDSFieldType;
  options?: string[];
  required?: boolean;
  className?: string;
  placeholder?: string;
  // Added for Section IX: handles the label for the "If Yes" details
  detailLabel?: string;
  description?: string;
  subFields?: PDSFieldConfig[];
}

export interface PDSSectionConfig {
  id: string;
  title: string;
  renderType: "static" | "list";
  layout?: "flex" | "grid";
  fields?: PDSFieldConfig[];
  subSections?: PDSSectionConfig[];
}

export type PDSDataValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | PDSDataNode
  | PDSDataNode[];

export interface PDSDataNode {
  [key: string]: PDSDataValue;
}

export const PDS_CONFIG: PDSSectionConfig[] = [
  // #region I. PERSONAL INFORMATION
  {
    id: "personalInfo",
    title: "I. PERSONAL INFORMATION",
    renderType: "static",
    subSections: [
      {
        id: "nameGroup",
        title: "Full Name",
        renderType: "static",
        fields: [
          {
            name: "lastName",
            label: "Surname",
            type: "text",
            required: true,
            placeholder: "e.g. DELA CRUZ",
          },
          {
            name: "firstName",
            label: "First Name",
            type: "text",
            required: true,
            placeholder: "e.g. JUAN",
          },
          {
            name: "middleName",
            label: "Middle Name",
            type: "text",
            placeholder: "e.g. MERCADO",
          },
          {
            name: "nameExtension",
            label: "Ext. (JR, SR)",
            type: "text",
            placeholder: "JR.",
          },
        ],
      },
      {
        id: "birthAndStatus",
        title: "Birth & Status",
        renderType: "static",
        fields: [
          { name: "dateOfBirth", label: "Date of Birth", type: "date" },
          {
            name: "placeOfBirth",
            label: "Place of Birth",
            type: "text",
            placeholder: "CITY / PROVINCE",
          },
          {
            name: "gender",
            label: "Sex at Birth",
            type: "radio",
            options: ["Male", "Female"],
          },
          {
            name: "civilStatus",
            label: "Civil Status",
            type: "select",
            options: ["Single", "Married", "Widowed", "Separated", "Other/s"],
          },
        ],
      },
      {
        id: "citizenshipGroup",
        title: "Citizenship Information",
        renderType: "static",
        fields: [
          {
            name: "citizenshipStatus",
            label: "Citizenship Status",
            type: "select",
            options: ["Filipino", "Dual Citizenship"],
          },
          {
            name: "dualCitizenshipMode",
            label: "Mode",
            type: "select",
            options: ["by birth", "by naturalization"],
          },
          {
            name: "citizenshipCountry",
            label: "If Dual, Country",
            type: "text",
            placeholder: "INDICATE COUNTRY",
          },
        ],
      },
      {
        id: "physicalAttributes",
        title: "Physical Attributes",
        renderType: "static",
        layout: "flex",
        fields: [
          {
            name: "bloodType",
            label: "Blood Type",
            type: "text",
            placeholder: "O+",
          },
          {
            name: "heightCm",
            label: "Height (m)",
            type: "number",
            placeholder: "e.g. 1.75",
          },
          {
            name: "weightKg",
            label: "Weight (kg)",
            type: "number",
            placeholder: "e.g. 65",
          },
        ],
      },
      {
        id: "governmentIds",
        title: "Government Issued IDs",
        renderType: "static",
        fields: [
          {
            name: "umidNumber",
            label: "UMID ID No.",
            type: "text",
            placeholder: "0000-0000000-0",
          },
          {
            name: "pagibigNumber",
            label: "PAG-IBIG ID No.",
            type: "text",
            placeholder: "0000-0000-0000",
          },
          {
            name: "philhealthNumber",
            label: "PhilHealth No.",
            type: "text",
            placeholder: "00-000000000-0",
          },
          {
            name: "philSysNumber",
            label: "PhilSys No. (PSN)",
            type: "text",
            placeholder: "0000-0000-0000-0000",
          },
          {
            name: "tinNumber",
            label: "TIN No.",
            type: "text",
            placeholder: "000-000-000-000",
          },
          {
            name: "agencyEmployeeNumber",
            label: "Agency No.",
            type: "text",
            placeholder: "00-0000",
          },
        ],
      },
      {
        id: "addressGroup",
        title: "Address Information",
        renderType: "static",
        layout: "flex",
        subSections: [
          {
            id: "residentialAddress",
            title: "Residential Address",
            renderType: "static",
            fields: [
              {
                name: "houseBlockLotNo",
                label: "House/Lot No.",
                type: "text",
                placeholder: "BLK 1 LOT 2",
              },
              {
                name: "street",
                label: "Street",
                type: "text",
                placeholder: "MAKA-DIYOS ST.",
              },
              {
                name: "subdivisionVillage",
                label: "Subdivision",
                type: "text",
                placeholder: "BRIGHT VILLAGE",
              },
              {
                name: "barangay",
                label: "Barangay",
                type: "text",
                placeholder: "BRGY. 123",
              },
              {
                name: "cityMunicipality",
                label: "City",
                type: "text",
                placeholder: "QUEZON CITY",
              },
              {
                name: "province",
                label: "Province",
                type: "text",
                placeholder: "METRO MANILA",
              },
              {
                name: "zipCode",
                label: "ZIP Code",
                type: "number",
                placeholder: "1100",
              },
              {
                name: "telephoneNo",
                label: "Telephone No.",
                type: "text",
                placeholder: "(02) 8123-4567",
              },
              {
                name: "mobileNo",
                label: "Mobile No.",
                type: "text",
                placeholder: "0917-000-0000",
              },
              {
                name: "emailAddress",
                label: "E-mail",
                type: "text",
                placeholder: "juan.dc@email.com",
              },
            ],
          },
          {
            id: "permanentAddress",
            title: "Permanent Address",
            renderType: "static",
            fields: [
              {
                name: "houseBlockLotNo",
                label: "House/Lot No.",
                type: "text",
                placeholder: "SAME AS ABOVE",
              },
              { name: "street", label: "Street", type: "text" },
              {
                name: "subdivisionVillage",
                label: "Subdivision",
                type: "text",
              },
              { name: "barangay", label: "Barangay", type: "text" },
              { name: "cityMunicipality", label: "City", type: "text" },
              { name: "province", label: "Province", type: "text" },
              { name: "zipCode", label: "ZIP Code", type: "number" },
            ],
          },
        ],
      },
    ],
  },

  // #region II. FAMILY BACKGROUND
  {
    id: "familyBackground",
    title: "II. FAMILY BACKGROUND",
    renderType: "static",
    subSections: [
      {
        id: "spouseInfo",
        title: "Spouse Information",
        renderType: "static",
        fields: [
          {
            name: "spouseLastName",
            label: "Surname",
            type: "text",
            placeholder: "MAIDEN NAME IF FEMALE",
          },
          { name: "spouseFirstName", label: "First Name", type: "text" },
          { name: "spouseMiddleName", label: "Middle Name", type: "text" },
          {
            name: "spouseOccupation",
            label: "Occupation",
            type: "text",
            placeholder: "e.g. TEACHER",
          },
          {
            name: "spouseEmployerBusinessName",
            label: "Employer",
            type: "text",
            placeholder: "COMPANY NAME",
          },
          {
            name: "spouseBusinessAddress",
            label: "Business Address",
            type: "text",
          },
          { name: "spouseTelephoneNo", label: "Contact No.", type: "text" },
        ],
      },
      {
        id: "children",
        title: "23. Name of Children",
        renderType: "list",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "FIRST NAME M.I. LAST NAME",
          },
          { name: "dateOfBirth", label: "Date of Birth", type: "date" },
        ],
      },
      {
        id: "parentsGroup",
        title: "Parental Information",
        renderType: "static",
        layout: "grid",
        subSections: [
          {
            id: "fatherInfo",
            title: "Father's Details",
            renderType: "static",
            fields: [
              { name: "fatherLastName", label: "Surname", type: "text" },
              { name: "fatherFirstName", label: "First Name", type: "text" },
              { name: "fatherMiddleName", label: "Middle Name", type: "text" },
              {
                name: "fatherNameExtension",
                label: "Ext.",
                type: "text",
                placeholder: "N/A",
              },
            ],
          },
          {
            id: "motherInfo",
            title: "Mother's Maiden Name",
            renderType: "static",
            fields: [
              { name: "motherLastName", label: "Surname", type: "text" },
              { name: "motherFirstName", label: "First Name", type: "text" },
              { name: "motherMiddleName", label: "Middle Name", type: "text" },
            ],
          },
        ],
      },
    ],
  },

  // #region III. EDUCATIONAL BACKGROUND
  {
    id: "educationalBackground",
    title: "III. EDUCATIONAL BACKGROUND",
    renderType: "static",
    subSections: [
      {
        id: "elementary",
        title: "Elementary",
        renderType: "static",
        fields: [
          {
            name: "school",
            label: "Name of School",
            type: "text",
            placeholder: "ELEMENTARY SCHOOL",
          },
          {
            name: "course",
            label: "Basic Education",
            type: "text",
            placeholder: "K-12 CURRICULUM",
          },
          {
            name: "attendanceFrom",
            label: "From (Year)",
            type: "number",
            placeholder: "2000",
          },
          {
            name: "attendanceTo",
            label: "To (Year)",
            type: "number",
            placeholder: "2006",
          },
          {
            name: "yearGraduated",
            label: "Year Graduated",
            type: "number",
            placeholder: "2006",
          },
          {
            name: "honors",
            label: "Honors",
            type: "text",
            placeholder: "VALEDICTORIAN",
          },
        ],
      },
      {
        id: "secondary",
        title: "Secondary",
        renderType: "static",
        fields: [
          {
            name: "school",
            label: "Name of School",
            type: "text",
            placeholder: "HIGH SCHOOL NAME",
          },
          { name: "course", label: "Basic Education", type: "text" },
          {
            name: "attendanceFrom",
            label: "From (Year)",
            type: "number",
            placeholder: "2006",
          },
          {
            name: "attendanceTo",
            label: "To (Year)",
            type: "number",
            placeholder: "2010",
          },
          {
            name: "yearGraduated",
            label: "Year Graduated",
            type: "number",
            placeholder: "2010",
          },
        ],
      },
      {
        id: "college",
        title: "College",
        renderType: "static",
        fields: [
          {
            name: "school",
            label: "Name of School",
            type: "text",
            placeholder: "UNIVERSITY NAME",
          },
          {
            name: "course",
            label: "Degree/Course",
            type: "text",
            placeholder: "B.S. COMPUTER SCIENCE",
          },
          {
            name: "attendanceFrom",
            label: "From (Year)",
            type: "number",
            placeholder: "2010",
          },
          {
            name: "attendanceTo",
            label: "To (Year)",
            type: "number",
            placeholder: "2014",
          },
          {
            name: "highestLevel",
            label: "Level/Units",
            type: "text",
            placeholder: "GRADUATED",
          },
          {
            name: "yearGraduated",
            label: "Year Graduated",
            type: "number",
            placeholder: "2014",
          },
          {
            name: "honors",
            label: "Honors",
            type: "text",
            placeholder: "CUM LAUDE",
          },
        ],
      },
      {
        id: "graduateStudies",
        title: "Graduate Studies",
        renderType: "static",
        fields: [
          {
            name: "school",
            label: "Name of School",
            type: "text",
            placeholder: "GRADUATE SCHOOL",
          },
          {
            name: "course",
            label: "Degree/Course",
            type: "text",
            placeholder: "MASTER OF SCIENCE",
          },
          { name: "attendanceFrom", label: "From (Year)", type: "number" },
          { name: "attendanceTo", label: "To (Year)", type: "number" },
          { name: "yearGraduated", label: "Year Graduated", type: "number" },
        ],
      },
    ],
  },

  // #region IV. CIVIL SERVICE ELIGIBILITY
  {
    id: "civilServiceEligibility",
    title: "IV. CIVIL SERVICE ELIGIBILITY",
    renderType: "static",
    subSections: [
      {
        id: "eligibilityEntries",
        title: "Eligibility Entries",
        renderType: "list",
        fields: [
          {
            name: "eligibility",
            label: "Service/Board/Bar",
            type: "text",
            placeholder: "CAREER SERVICE PROFESSIONAL",
          },
          {
            name: "rating",
            label: "Rating",
            type: "text",
            placeholder: "85.00%",
          },
          {
            name: "examDate",
            label: "Exam Date",
            type: "text",
            placeholder: "MM/DD/YYYY",
          },
          { name: "examPlace", label: "Exam Place", type: "text" },
          { name: "licenseNumber", label: "License No.", type: "text" },
          {
            name: "validity",
            label: "Validity",
            type: "text",
            placeholder: "MM/DD/YYYY",
          },
        ],
      },
    ],
  },

  // #region V. WORK EXPERIENCE
  {
    id: "workExperience",
    title: "V. WORK EXPERIENCE",
    renderType: "static",
    subSections: [
      {
        id: "workEntries",
        title: "Employment History",
        renderType: "list",
        fields: [
          { name: "fromDate", label: "From", type: "date" },
          { name: "toDate", label: "To", type: "date" },
          {
            name: "title",
            label: "Position Title",
            type: "text",
            placeholder: "SOFTWARE ENGINEER",
          },
          {
            name: "subtitle",
            label: "Agency/Company",
            type: "text",
            placeholder: "NAME OF OFFICE",
          },
          {
            name: "extraOne",
            label: "Status",
            type: "text",
            placeholder: "PERMANENT / CONTRACTUAL",
          },
          {
            name: "extraTwo",
            label: "Gov't?",
            type: "select",
            options: ["Y", "N"],
          },
        ],
      },
    ],
  },

  // #region VI. VOLUNTARY WORK
  {
    id: "voluntaryWork",
    title: "VI. VOLUNTARY WORK",
    renderType: "static",
    subSections: [
      {
        id: "voluntaryWorkEntries",
        title: "Involvement Details",
        renderType: "list",
        fields: [
          {
            name: "title",
            label: "Organization",
            type: "text",
            placeholder: "NAME & ADDRESS",
          },
          { name: "fromDate", label: "From", type: "date" },
          { name: "toDate", label: "To", type: "date" },
          {
            name: "extraOne",
            label: "Hours",
            type: "number",
            placeholder: "0",
          },
          {
            name: "subtitle",
            label: "Position",
            type: "text",
            placeholder: "NATURE OF WORK",
          },
        ],
      },
    ],
  },

  // #region VII. LEARNING & DEVELOPMENT
  {
    id: "training",
    title: "VII. LEARNING & DEVELOPMENT",
    renderType: "static",
    subSections: [
      {
        id: "trainingEntries",
        title: "Programs Attended",
        renderType: "list",
        fields: [
          {
            name: "title",
            label: "Training Title",
            type: "text",
            placeholder: "NAME OF PROGRAM",
          },
          { name: "fromDate", label: "From", type: "date" },
          { name: "toDate", label: "To", type: "date" },
          {
            name: "extraOne",
            label: "Hours",
            type: "number",
            placeholder: "0",
          },
          {
            name: "extraTwo",
            label: "Type",
            type: "text",
            placeholder: "MANAGERIAL / TECHNICAL",
          },
          {
            name: "subtitle",
            label: "Conducted By",
            type: "text",
            placeholder: "SPONSOR NAME",
          },
        ],
      },
    ],
  },

  // #region VIII. OTHER INFORMATION
  {
    id: "otherInformation",
    title: "VIII. OTHER INFORMATION",
    renderType: "static",
    subSections: [
      {
        id: "skills",
        title: "31. Special Skills",
        renderType: "list",
        fields: [
          {
            name: "skill",
            label: "Skill",
            type: "text",
            placeholder: "e.g. PYTHON / UNITY",
          },
        ],
      },
      {
        id: "awards",
        title: "32. Distinctions",
        renderType: "list",
        fields: [
          {
            name: "title",
            label: "Award",
            type: "text",
            placeholder: "e.g. CUM LAUDE",
          },
        ],
      },
      {
        id: "memberships",
        title: "33. Memberships",
        renderType: "list",
        fields: [
          {
            name: "title",
            label: "Organization",
            type: "text",
            placeholder: "ASSOCIATION NAME",
          },
        ],
      },
    ],
  },

  // #region IX. ADDITIONAL INFO
  {
    id: "additionalInformation",
    title: "IX. QUESTIONS & REFERENCES",
    renderType: "static",
    subSections: [
      {
        id: "legalQuestions",
        title: "Administrative & Legal Records",
        renderType: "static",
        fields: [
          {
            name: "relationThirdDegree",
            label: "34.a Related (3rd Degree)?",
            type: "question",
            description:
              "Are you related within the third degree to the appointing or recommending authority?",
          },
          {
            name: "adminOffense",
            label: "35.a Administrative Offense?",
            type: "question",
            description:
              "Have you ever been found guilty of any administrative offense?",
          },
          {
            name: "criminalCharge",
            label: "35.b Criminally Charged?",
            type: "question",
            description: "Have you been criminally charged before any court?",
            subFields: [
              { name: "dateFiled", label: "Date Filed", type: "date" },
              { name: "statusOfCase", label: "Status of Case/s", type: "text" },
            ],
          },
          {
            name: "convictedCrime",
            label: "36. Convicted of Crime?",
            type: "question",
            description:
              "Have you ever been convicted of any crime or violation of any law?",
          },
          {
            name: "immigrantStatus",
            label: "39. Immigrant Status?",
            type: "question",
            description:
              "Have you acquired the status of an immigrant or permanent resident of another country?",
            detailLabel: "If YES, specify country",
          },
        ],
      },
      {
        id: "specialLegalStatus",
        title: "Legal Status & Disability",
        renderType: "static",
        fields: [
          {
            name: "indigenousGroup",
            label: "Indigenous Group?",
            type: "question",
            detailLabel: "If YES, specify group",
          },
          {
            name: "disability",
            label: "Disability Status?",
            type: "question",
            subFields: [
              { name: "idNumber", label: "Disability ID No.", type: "text" },
            ],
          },
          {
            name: "soloParent",
            label: "Solo Parent Status?",
            type: "question",
            subFields: [
              { name: "idNumber", label: "Solo Parent ID No.", type: "text" },
            ],
          },
        ],
      },
      {
        id: "references",
        title: "41. Character References",
        renderType: "list",
        fields: [
          {
            name: "name",
            label: "Full Name",
            type: "text",
            placeholder: "NAME OF REFERENCE",
          },
          {
            name: "address",
            label: "Address",
            type: "text",
            placeholder: "OFFICE OR HOME ADDRESS",
          },
          {
            name: "contact",
            label: "Contact No.",
            type: "text",
            placeholder: "0917-XXX-XXXX",
          },
        ],
      },
      {
        id: "declaration",
        title: "42. Declaration Details",
        renderType: "static",
        fields: [
          {
            name: "governmentIdType",
            label: "ID Type",
            type: "text",
            placeholder: "UMID / PASSPORT",
          },
          {
            name: "governmentIdNumber",
            label: "ID No.",
            type: "text",
            placeholder: "ID NUMBER",
          },
          {
            name: "governmentIdIssuePlace",
            label: "Place of Issue",
            type: "text",
          },
          { name: "governmentIdIssueDate", label: "Issue Date", type: "date" },
          {
            name: "dateAccomplished",
            label: "Date Accomplished",
            type: "date",
          },
        ],
      },
    ],
  },
];

// #region FOR PRINT

type Answer = "" | "Yes" | "No";
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
  // #region I. PERSONAL INFORMATION
  personalInfo: {
    // Subsection: nameGroup
    nameGroup: {
      lastName?: string;
      firstName?: string;
      middleName?: string;
      nameExtension?: string;
    };
    // Subsection: birthAndStatus
    birthAndStatus: {
      dateOfBirth?: string;
      placeOfBirth?: string;
      gender?: string; // Matches 'gender' name in schema
      civilStatus?: string;
    };
    // Subsection: citizenshipGroup
    citizenshipGroup: {
      citizenshipStatus?: string;
      dualCitizenshipMode?: string;
      citizenshipCountry?: string;
    };
    // Subsection: physicalAttributes
    physicalAttributes: {
      bloodType?: string;
      heightCm?: string; // Matches 'heightCm' name in schema
      weightKg?: string;
    };
    // Subsection: governmentIds
    governmentIds: {
      umidNumber?: string;
      pagibigNumber?: string;
      philhealthNumber?: string;
      philSysNumber?: string;
      tinNumber?: string;
      agencyEmployeeNumber?: string;
      // Added missing ones from your previous interface if needed
      gsisNumber?: string;
      sssNumber?: string;
    };
    // Subsection: addressGroup -> nested subSections
    addressGroup: {
      residentialAddress: PDSPrintAddress;
      permanentAddress: PDSPrintAddress;
    };
  };

  // #region II. FAMILY BACKGROUND
  familyBackground: {
    // Subsection: spouseInfo
    spouseInfo: {
      spouseLastName?: string;
      spouseFirstName?: string;
      spouseMiddleName?: string;
      spouseOccupation?: string;
      spouseEmployerBusinessName?: string;
      spouseBusinessAddress?: string;
      spouseTelephoneNo?: string;
      // Added nameExtension if your print template still expects it
      spouseNameExtension?: string;
    };

    // Subsection: children (renderType: "list")
    children: Array<{
      name?: string;
      dateOfBirth?: string;
    }>;

    // Subsection: parentsGroup -> nested subSections
    parentsGroup: {
      fatherInfo: {
        fatherLastName?: string;
        fatherFirstName?: string;
        fatherMiddleName?: string;
        fatherNameExtension?: string;
      };
      motherInfo: {
        motherLastName?: string;
        motherFirstName?: string;
        motherMiddleName?: string;
      };
    };
  };

  // #region III. EDUCATIONAL BACKGROUND
  educationalBackground: {
    // Subsection: elementary
    elementary: {
      school?: string;
      course?: string;
      attendanceFrom?: string | number;
      attendanceTo?: string | number;
      yearGraduated?: string | number;
      honors?: string;
    };
    // Subsection: secondary
    secondary: {
      school?: string;
      course?: string;
      attendanceFrom?: string | number;
      attendanceTo?: string | number;
      yearGraduated?: string | number;
      // Note: Secondary often needs 'honors' too, added for safety
      honors?: string;
    };
    // Subsection: college
    college: {
      school?: string;
      course?: string;
      attendanceFrom?: string | number;
      attendanceTo?: string | number;
      highestLevel?: string; // Units earned
      yearGraduated?: string | number;
      honors?: string;
    };
    // Subsection: graduateStudies
    graduateStudies: {
      school?: string;
      course?: string;
      attendanceFrom?: string | number;
      attendanceTo?: string | number;
      yearGraduated?: string | number;
      // Added for consistency with PDS forms
      highestLevel?: string;
      honors?: string;
    };
  };

  educationRows: Array<{
    level: string;
    school?: string;
    course?: string;
    attendanceFrom?: string;
    attendanceTo?: string;
    highestLevel?: string;
    yearGraduated?: string;
    honors?: string;
  }>;

  // #region IV. CIVIL SERVICE ELIGIBILITY
  civilServiceEligibility: {
    // Subsection: eligibilityEntries (renderType: "list")
    // This matches the database nesting: civilServiceEligibility.eligibilityEntries
    eligibilityEntries: Array<{
      eligibility?: string;
      rating?: string;
      examDate?: string;
      examPlace?: string;
      licenseNumber?: string;
      validity?: string;
    }>;
  };

  // This is the flat array your PDSPrintTemplate currently maps over
  civilServiceRows: Array<{
    eligibility?: string;
    rating?: string;
    examDate?: string;
    examPlace?: string;
    licenseNumber?: string;
    validity?: string;
  }>;

  // #region V. WORK EXPERIENCE
  workExperience: {
    // Subsection: workEntries (renderType: "list")
    // Matches DB path: workExperience.workEntries
    workEntries: Array<{
      fromDate?: string;
      toDate?: string;
      title?: string; // maps to Position Title
      subtitle?: string; // maps to Agency/Company
      extraOne?: string; // maps to Status of Appointment
      extraTwo?: string; // maps to Gov't Service (Y/N)
    }>;
  };

  // This matches your existing PDSPrintTemplate rendering logic
  workExperienceRows: Array<{
    fromDate?: string;
    toDate?: string;
    positionTitle?: string;
    departmentAgencyOfficeCompany?: string;
    statusOfAppointment?: string;
    governmentService?: string;
  }>;

  // #region VI. VOLUNTARY WORK
  voluntaryWork: {
    // Subsection: voluntaryWorkEntries (renderType: "list")
    // Matches DB path: voluntaryWork.voluntaryWorkEntries
    voluntaryWorkEntries: Array<{
      title?: string; // maps to Organization Name & Address
      fromDate?: string;
      toDate?: string;
      extraOne?: string | number; // maps to Number of Hours
      subtitle?: string; // maps to Position / Nature of Work
    }>;
  };

  // This matches your existing PDSPrintTemplate rendering logic
  voluntaryWorkRows: Array<{
    organization?: string;
    fromDate?: string;
    toDate?: string;
    hours?: string;
    positionNatureOfWork?: string;
  }>;

  // #region VII. LEARNING & DEVELOPMENT
  training: {
    // Subsection: trainingEntries (renderType: "list")
    // Matches DB path: training.trainingEntries
    trainingEntries: Array<{
      title?: string; // maps to Training Title
      fromDate?: string;
      toDate?: string;
      extraOne?: string | number; // maps to Number of Hours
      extraTwo?: string; // maps to Type of L&D (Managerial, etc.)
      subtitle?: string; // maps to Conducted / Sponsored By
    }>;
  };

  // This matches your existing PDSPrintTemplate rendering logic
  trainingRows: Array<{
    title?: string;
    fromDate?: string;
    toDate?: string;
    hours?: string;
    typeOfLd?: string;
    conductedBy?: string;
  }>;

  // #region VIII. OTHER INFORMATION
  otherInformation: {
    // Subsection: skills (renderType: "list")
    skills: Array<{
      skill?: string;
    }>;

    // Subsection: awards (renderType: "list")
    awards: Array<{
      title?: string; // maps to Distinction
    }>;

    // Subsection: memberships (renderType: "list")
    memberships: Array<{
      title?: string; // maps to Organization
    }>;
  };

  /**
   * This is what your template uses.
   * When mapping, you'll need to zip these three lists together
   * so that index 0 of each list forms one 'OtherInformationRow'.
   */
  otherInformationRows: Array<{
    skill?: string;
    distinction?: string;
    membership?: string;
  }>;

  // #region IX. ADDITIONAL INFO
  additionalInformation: {
    // Nested Subsection: legalQuestions
    legalQuestions: {
      relationThirdDegree: PDSPrintQuestion;
      adminOffense: PDSPrintQuestion;
      convictedCrime: PDSPrintQuestion;
      immigrantStatus: PDSPrintQuestion;
      criminalCharge: PDSPrintCriminalChargeQuestion; // Has dateFiled, statusOfCase
    };

    // Nested Subsection: specialLegalStatus
    specialLegalStatus: {
      indigenousGroup: PDSPrintQuestion;
      disability: PDSPrintQuestion & { idNumber?: string };
      soloParent: PDSPrintQuestion & { idNumber?: string };
    };

    // Subsection: references (renderType: "list")
    references: Array<{
      name?: string;
      address?: string;
      contact?: string;
    }>;

    // Subsection: declaration
    declaration: {
      governmentIdType?: string;
      governmentIdNumber?: string;
      governmentIdIssuePlace?: string;
      governmentIdIssueDate?: string;
      dateAccomplished?: string;
    };
  };

  // The flattened keys for the Print Template logic
  references: Array<{ name?: string; address?: string; contact?: string }>;
  declaration: {
    governmentIdType?: string;
    governmentIdNumber?: string;
    governmentIdIssueDate?: string;
    governmentIdIssuePlace?: string;
    dateAccomplished?: string;
  };
  photoUrl: string;
}

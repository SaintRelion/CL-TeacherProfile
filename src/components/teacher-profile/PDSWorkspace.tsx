import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { resolveImageSource } from "@/lib/utils";
import type { PersonalInformation } from "@/models/PersonalInformation";
import PDSPrintTemplate, {
  type PDSPrintMode,
  type PDSPrintPaperSize,
  type PDSPrintSectionId,
  type PDSPrintTemplateData,
} from "@/components/teacher-profile/PDSPrintTemplate";

type SimpleEntry = {
  id: string;
  title: string;
  subtitle: string;
  details: string;
  fromDate: string;
  toDate: string;
  extraOne: string;
  extraTwo: string;
  extraThree: string;
};
type LicenseEntry = { id: string; name: string; number: string; expiry: string };
type ReferenceEntry = { id: string; name: string; contact: string; address: string };
type ChildEntry = { id: string; name: string; dateOfBirth: string };
type PersonalSectionState = {
  lastName: string;
  firstName: string;
  middleName: string;
  nameExtension: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  civilStatus: string;
  citizenship: string;
  citizenshipStatus: string;
  dualCitizenshipMode: string;
  citizenshipCountry: string;
  heightCm: string;
  weightKg: string;
  bloodType: string;
};
type ResidentialAddressState = {
  houseBlockLotNo: string;
  street: string;
  subdivisionVillage: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  zipCode: string;
  telephoneNo: string;
  mobileNo: string;
  emailAddress: string;
};
type GovernmentIdsState = {
  umidNumber: string;
  gsisNumber: string;
  pagibigNumber: string;
  philhealthNumber: string;
  philSysNumber: string;
  sssNumber: string;
  tinNumber: string;
  agencyEmployeeNumber: string;
};
type FamilyBackgroundState = {
  spouseLastName: string;
  spouseFirstName: string;
  spouseMiddleName: string;
  spouseNameExtension: string;
  spouseOccupation: string;
  spouseEmployerBusinessName: string;
  spouseBusinessAddress: string;
  spouseTelephoneNo: string;
  children: ChildEntry[];
  fatherLastName: string;
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherNameExtension: string;
  motherLastName: string;
  motherFirstName: string;
  motherMiddleName: string;
};
type EducationLevelKey =
  | "elementary"
  | "secondary"
  | "vocational"
  | "college"
  | "graduateStudies";
type EducationEntry = {
  school: string;
  course: string;
  attendanceFrom: string;
  attendanceTo: string;
  highestLevel: string;
  yearGraduated: string;
  honors: string;
};
type EducationalBackgroundState = Record<EducationLevelKey, EducationEntry>;
type CivilServiceEligibilityEntry = {
  id: string;
  eligibility: string;
  rating: string;
  examDate: string;
  examPlace: string;
  licenseNumber: string;
  validity: string;
};
type AdditionalQuestionState = {
  answer: "" | "Yes" | "No";
  details: string;
};
type CriminalChargeQuestionState = AdditionalQuestionState & {
  dateFiled: string;
  statusOfCase: string;
};
type AdditionalInformationState = {
  relationThirdDegree: AdditionalQuestionState;
  relationFourthDegree: AdditionalQuestionState;
  adminOffense: AdditionalQuestionState;
  criminalCharge: CriminalChargeQuestionState;
  convictedCrime: AdditionalQuestionState;
  separatedService: AdditionalQuestionState;
  candidateElection: AdditionalQuestionState;
  resignedDuringCampaign: AdditionalQuestionState;
  immigrantStatus: AdditionalQuestionState;
  indigenousGroup: AdditionalQuestionState;
  disability: AdditionalQuestionState & { idNumber: string };
  soloParent: AdditionalQuestionState & { idNumber: string };
};
type DeclarationState = {
  governmentIdType: string;
  governmentIdNumber: string;
  governmentIdIssueDate: string;
  governmentIdIssuePlace: string;
  dateAccomplished: string;
};
type PaperSize = PDSPrintPaperSize;
type PrintMode = PDSPrintMode;
type PrintSectionKey =
  | "personal"
  | "family"
  | "education"
  | "civil"
  | "work"
  | "voluntary"
  | "training"
  | "other"
  | "additional";
type RemovableCollectionKey =
  | "workExperience"
  | "voluntaryWork"
  | "training"
  | "awards"
  | "memberships"
  | "licenses"
  | "civilServiceEligibility"
  | "references";
type DeleteTarget =
  | { collection: "children"; id: string }
  | { collection: RemovableCollectionKey; id: string };

type PDSState = {
  personalInfo: PersonalSectionState;
  familyBackground: FamilyBackgroundState;
  workExperience: SimpleEntry[];
  voluntaryWork: SimpleEntry[];
  training: SimpleEntry[];
  awards: SimpleEntry[];
  memberships: SimpleEntry[];
  licenses: LicenseEntry[];
  references: ReferenceEntry[];
  skills: string[];
  residentialAddress: ResidentialAddressState;
  permanentAddress: ResidentialAddressState;
  governmentIds: GovernmentIdsState;
  educationalBackground: EducationalBackgroundState;
  civilServiceEligibility: CivilServiceEligibilityEntry[];
  additionalInformation: AdditionalInformationState;
  declaration: DeclarationState;
  spedSpecialization: string;
  documentUploadNotes: string;
};

const defaultPersonalInfo: PersonalSectionState = {
  lastName: "",
  firstName: "",
  middleName: "",
  nameExtension: "",
  dateOfBirth: "",
  placeOfBirth: "",
  gender: "",
  civilStatus: "",
  citizenship: "Filipino",
  citizenshipStatus: "Filipino",
  dualCitizenshipMode: "",
  citizenshipCountry: "",
  heightCm: "",
  weightKg: "",
  bloodType: "",
};

const educationLevelDefinitions: Array<{
  key: EducationLevelKey;
  label: string;
}> = [
  { key: "elementary", label: "Elementary" },
  { key: "secondary", label: "Secondary" },
  { key: "vocational", label: "Vocational / Trade Course" },
  { key: "college", label: "College" },
  { key: "graduateStudies", label: "Graduate Studies" },
];

const printSectionDefinitions: Array<{
  key: PrintSectionKey;
  id: PDSPrintSectionId;
  label: string;
}> = [
  { key: "personal", id: "I", label: "I. Personal Information" },
  { key: "family", id: "II", label: "II. Family Background" },
  { key: "education", id: "III", label: "III. Educational Background" },
  { key: "civil", id: "IV", label: "IV. Civil Service Eligibility" },
  { key: "work", id: "V", label: "V. Work Experience" },
  { key: "voluntary", id: "VI", label: "VI. Voluntary Work" },
  {
    key: "training",
    id: "VII",
    label: "VII. Learning and Development (L&D) Interventions / Training Programs Attended",
  },
  { key: "other", id: "VIII", label: "VIII. Other Information" },
  {
    key: "additional",
    id: "IX",
    label: "IX. Additional Information, References & Declaration",
  },
];

const createId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const createDefaultResidentialAddress = (): ResidentialAddressState => ({
  houseBlockLotNo: "",
  street: "",
  subdivisionVillage: "",
  barangay: "",
  cityMunicipality: "",
  province: "",
  zipCode: "",
  telephoneNo: "",
  mobileNo: "",
  emailAddress: "",
});

const createDefaultGovernmentIds = (): GovernmentIdsState => ({
  umidNumber: "",
  gsisNumber: "",
  pagibigNumber: "",
  philhealthNumber: "",
  philSysNumber: "",
  sssNumber: "",
  tinNumber: "",
  agencyEmployeeNumber: "",
});

const createDefaultFamilyBackground = (): FamilyBackgroundState => ({
  spouseLastName: "",
  spouseFirstName: "",
  spouseMiddleName: "",
  spouseNameExtension: "",
  spouseOccupation: "",
  spouseEmployerBusinessName: "",
  spouseBusinessAddress: "",
  spouseTelephoneNo: "",
  children: [],
  fatherLastName: "",
  fatherFirstName: "",
  fatherMiddleName: "",
  fatherNameExtension: "",
  motherLastName: "",
  motherFirstName: "",
  motherMiddleName: "",
});

const createDefaultEducationEntry = (): EducationEntry => ({
  school: "",
  course: "",
  attendanceFrom: "",
  attendanceTo: "",
  highestLevel: "",
  yearGraduated: "",
  honors: "",
});

const createDefaultEducationalBackground = (): EducationalBackgroundState => ({
  elementary: createDefaultEducationEntry(),
  secondary: createDefaultEducationEntry(),
  vocational: createDefaultEducationEntry(),
  college: createDefaultEducationEntry(),
  graduateStudies: createDefaultEducationEntry(),
});

const createDefaultCivilServiceEligibilityEntry =
  (): CivilServiceEligibilityEntry => ({
    id: createId(),
    eligibility: "",
    rating: "",
    examDate: "",
    examPlace: "",
    licenseNumber: "",
    validity: "",
  });

const createDefaultSimpleEntry = (): SimpleEntry => ({
  id: createId(),
  title: "",
  subtitle: "",
  details: "",
  fromDate: "",
  toDate: "",
  extraOne: "",
  extraTwo: "",
  extraThree: "",
});

const createDefaultChildEntry = (): ChildEntry => ({
  id: createId(),
  name: "",
  dateOfBirth: "",
});

const createDefaultQuestion = (): AdditionalQuestionState => ({
  answer: "",
  details: "",
});

const createDefaultCriminalChargeQuestion =
  (): CriminalChargeQuestionState => ({
    answer: "",
    details: "",
    dateFiled: "",
    statusOfCase: "",
  });

const createDefaultAdditionalInformation =
  (): AdditionalInformationState => ({
    relationThirdDegree: createDefaultQuestion(),
    relationFourthDegree: createDefaultQuestion(),
    adminOffense: createDefaultQuestion(),
    criminalCharge: createDefaultCriminalChargeQuestion(),
    convictedCrime: createDefaultQuestion(),
    separatedService: createDefaultQuestion(),
    candidateElection: createDefaultQuestion(),
    resignedDuringCampaign: createDefaultQuestion(),
    immigrantStatus: createDefaultQuestion(),
    indigenousGroup: createDefaultQuestion(),
    disability: {
      ...createDefaultQuestion(),
      idNumber: "",
    },
    soloParent: {
      ...createDefaultQuestion(),
      idNumber: "",
    },
  });

const createDefaultDeclaration = (): DeclarationState => ({
  governmentIdType: "",
  governmentIdNumber: "",
  governmentIdIssueDate: "",
  governmentIdIssuePlace: "",
  dateAccomplished: "",
});

const createDefaultState = (): PDSState => ({
  personalInfo: { ...defaultPersonalInfo },
  familyBackground: createDefaultFamilyBackground(),
  workExperience: [],
  voluntaryWork: [],
  training: [],
  awards: [],
  memberships: [],
  licenses: [],
  references: [],
  skills: [],
  residentialAddress: createDefaultResidentialAddress(),
  permanentAddress: createDefaultResidentialAddress(),
  governmentIds: createDefaultGovernmentIds(),
  educationalBackground: createDefaultEducationalBackground(),
  civilServiceEligibility: [],
  additionalInformation: createDefaultAdditionalInformation(),
  declaration: createDefaultDeclaration(),
  spedSpecialization: "",
  documentUploadNotes: "",
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (
  source: Record<string, unknown>,
  key: string,
  fallback = "",
) => (typeof source[key] === "string" ? source[key] : fallback);

const hydrateResidentialAddress = (value: unknown): ResidentialAddressState => {
  if (typeof value === "string") {
    return {
      ...createDefaultResidentialAddress(),
      street: value,
    };
  }

  if (!isRecord(value)) {
    return createDefaultResidentialAddress();
  }

  return {
    houseBlockLotNo: readString(value, "houseBlockLotNo"),
    street: readString(value, "street"),
    subdivisionVillage: readString(value, "subdivisionVillage"),
    barangay: readString(value, "barangay"),
    cityMunicipality: readString(value, "cityMunicipality"),
    province: readString(value, "province"),
    zipCode: readString(value, "zipCode"),
    telephoneNo: readString(value, "telephoneNo"),
    mobileNo: readString(value, "mobileNo"),
    emailAddress: readString(value, "emailAddress"),
  };
};

const hydrateGovernmentIds = (value: unknown): GovernmentIdsState => {
  if (!isRecord(value)) {
    return createDefaultGovernmentIds();
  }

  return {
    umidNumber: readString(value, "umidNumber"),
    gsisNumber: readString(value, "gsisNumber"),
    pagibigNumber: readString(value, "pagibigNumber"),
    philhealthNumber: readString(value, "philhealthNumber"),
    philSysNumber: readString(value, "philSysNumber"),
    sssNumber: readString(value, "sssNumber"),
    tinNumber: readString(value, "tinNumber"),
    agencyEmployeeNumber: readString(value, "agencyEmployeeNumber"),
  };
};

const hydrateChildEntries = (value: unknown): ChildEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const source = isRecord(item) ? item : {};
    return {
      id: readString(source, "id", createId()),
      name: readString(source, "name"),
      dateOfBirth: readString(source, "dateOfBirth"),
    };
  });
};

const hydrateFamilyBackground = (value: unknown): FamilyBackgroundState => {
  if (!isRecord(value)) {
    return createDefaultFamilyBackground();
  }

  return {
    spouseLastName: readString(value, "spouseLastName"),
    spouseFirstName: readString(value, "spouseFirstName"),
    spouseMiddleName: readString(value, "spouseMiddleName"),
    spouseNameExtension: readString(value, "spouseNameExtension"),
    spouseOccupation: readString(value, "spouseOccupation"),
    spouseEmployerBusinessName: readString(value, "spouseEmployerBusinessName"),
    spouseBusinessAddress: readString(value, "spouseBusinessAddress"),
    spouseTelephoneNo: readString(value, "spouseTelephoneNo"),
    children: hydrateChildEntries(value.children),
    fatherLastName: readString(value, "fatherLastName"),
    fatherFirstName: readString(value, "fatherFirstName"),
    fatherMiddleName: readString(value, "fatherMiddleName"),
    fatherNameExtension: readString(value, "fatherNameExtension"),
    motherLastName: readString(value, "motherLastName"),
    motherFirstName: readString(value, "motherFirstName"),
    motherMiddleName: readString(value, "motherMiddleName"),
  };
};

const hydrateEducationEntry = (value: unknown): EducationEntry => {
  if (!isRecord(value)) {
    return createDefaultEducationEntry();
  }

  return {
    school: readString(value, "school"),
    course: readString(value, "course"),
    attendanceFrom: readString(value, "attendanceFrom"),
    attendanceTo: readString(value, "attendanceTo"),
    highestLevel: readString(value, "highestLevel"),
    yearGraduated: readString(value, "yearGraduated"),
    honors: readString(value, "honors"),
  };
};

const hydrateEducationalBackground = (
  value: unknown,
): EducationalBackgroundState => {
  const source = isRecord(value) ? value : {};

  return {
    elementary: hydrateEducationEntry(source.elementary),
    secondary: hydrateEducationEntry(source.secondary),
    vocational: hydrateEducationEntry(source.vocational),
    college: hydrateEducationEntry(source.college),
    graduateStudies: hydrateEducationEntry(source.graduateStudies),
  };
};

const hydrateCivilServiceEligibility = (
  value: unknown,
): CivilServiceEligibilityEntry[] => {
  if (typeof value === "string") {
    return value.trim()
      ? [
          {
            ...createDefaultCivilServiceEligibilityEntry(),
            eligibility: value,
          },
        ]
      : [];
  }

  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const source = isRecord(item) ? item : {};

    return {
      id: readString(source, "id", createId()),
      eligibility: readString(source, "eligibility"),
      rating: readString(source, "rating"),
      examDate: readString(source, "examDate"),
      examPlace: readString(source, "examPlace"),
      licenseNumber: readString(source, "licenseNumber"),
      validity: readString(source, "validity"),
    };
  });
};

const hydrateSimpleEntries = (value: unknown): SimpleEntry[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const source = isRecord(item) ? item : {};
    return {
      ...createDefaultSimpleEntry(),
      id: readString(source, "id", createId()),
      title: readString(source, "title"),
      subtitle: readString(source, "subtitle"),
      details: readString(source, "details"),
      fromDate: readString(source, "fromDate"),
      toDate: readString(source, "toDate"),
      extraOne: readString(source, "extraOne"),
      extraTwo: readString(source, "extraTwo"),
      extraThree: readString(source, "extraThree"),
    };
  });
};

const hydrateAdditionalQuestion = (
  value: unknown,
): AdditionalQuestionState => {
  if (!isRecord(value)) {
    return createDefaultQuestion();
  }

  const answer = readString(value, "answer") as AdditionalQuestionState["answer"];
  return {
    answer: answer === "Yes" || answer === "No" ? answer : "",
    details: readString(value, "details"),
  };
};

const hydrateCriminalChargeQuestion = (
  value: unknown,
): CriminalChargeQuestionState => {
  if (!isRecord(value)) {
    return createDefaultCriminalChargeQuestion();
  }

  const base = hydrateAdditionalQuestion(value);
  return {
    ...base,
    dateFiled: readString(value, "dateFiled"),
    statusOfCase: readString(value, "statusOfCase"),
  };
};

const hydrateAdditionalInformation = (
  value: unknown,
): AdditionalInformationState => {
  const source = isRecord(value) ? value : {};
  const disability = isRecord(source.disability) ? source.disability : {};
  const soloParent = isRecord(source.soloParent) ? source.soloParent : {};

  return {
    relationThirdDegree: hydrateAdditionalQuestion(source.relationThirdDegree),
    relationFourthDegree: hydrateAdditionalQuestion(source.relationFourthDegree),
    adminOffense: hydrateAdditionalQuestion(source.adminOffense),
    criminalCharge: hydrateCriminalChargeQuestion(source.criminalCharge),
    convictedCrime: hydrateAdditionalQuestion(source.convictedCrime),
    separatedService: hydrateAdditionalQuestion(source.separatedService),
    candidateElection: hydrateAdditionalQuestion(source.candidateElection),
    resignedDuringCampaign: hydrateAdditionalQuestion(
      source.resignedDuringCampaign,
    ),
    immigrantStatus: hydrateAdditionalQuestion(source.immigrantStatus),
    indigenousGroup: hydrateAdditionalQuestion(source.indigenousGroup),
    disability: {
      ...hydrateAdditionalQuestion(disability),
      idNumber: readString(disability, "idNumber"),
    },
    soloParent: {
      ...hydrateAdditionalQuestion(soloParent),
      idNumber: readString(soloParent, "idNumber"),
    },
  };
};

const hydrateDeclaration = (value: unknown): DeclarationState => {
  if (!isRecord(value)) {
    return createDefaultDeclaration();
  }

  return {
    governmentIdType: readString(value, "governmentIdType"),
    governmentIdNumber: readString(value, "governmentIdNumber"),
    governmentIdIssueDate: readString(value, "governmentIdIssueDate"),
    governmentIdIssuePlace: readString(value, "governmentIdIssuePlace"),
    dateAccomplished: readString(value, "dateAccomplished"),
  };
};

const PDSWorkspace = ({
  myInformation,
  userId,
}: {
  myInformation: PersonalInformation | null;
  userId: string;
}) => {
  const [state, setState] = useState<PDSState>(createDefaultState);
  const [newSkill, setNewSkill] = useState("");
  const [paperSize, setPaperSize] = useState<PaperSize>("A4");
  const [printMode, setPrintMode] = useState<PrintMode>("filled");
  const [printOptionsOpen, setPrintOptionsOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sectionsToPrint, setSectionsToPrint] = useState<
    Record<PrintSectionKey, boolean>
  >({
    personal: true,
    family: true,
    education: true,
    civil: true,
    work: true,
    voluntary: true,
    training: true,
    other: true,
    additional: true,
  });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const storageKey = `pds-layout:${userId}`;
  const readStoredState = (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      console.warn("Unable to read saved PDS data from localStorage", error);
      return null;
    }
  };
  const writeStoredState = (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.warn("Unable to save PDS data to localStorage", error);
    }
  };
  const clearStoredState = (key: string) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn("Unable to clear PDS data from localStorage", error);
    }
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove("pds-printing");
    };

    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove("pds-printing");
    };
  }, []);

  useEffect(() => {
    const saved = readStoredState(storageKey);
    if (!saved) return;
    try {
      const parsedState = JSON.parse(saved) as Partial<PDSState>;
      setState({
        ...createDefaultState(),
        ...parsedState,
        personalInfo: {
          ...defaultPersonalInfo,
          ...parsedState.personalInfo,
        },
        familyBackground: hydrateFamilyBackground(parsedState.familyBackground),
        workExperience: hydrateSimpleEntries(parsedState.workExperience),
        voluntaryWork: hydrateSimpleEntries(parsedState.voluntaryWork),
        training: hydrateSimpleEntries(parsedState.training),
        awards: hydrateSimpleEntries(parsedState.awards),
        memberships: hydrateSimpleEntries(parsedState.memberships),
        residentialAddress: hydrateResidentialAddress(
          parsedState.residentialAddress,
        ),
        permanentAddress: hydrateResidentialAddress(parsedState.permanentAddress),
        governmentIds: hydrateGovernmentIds(parsedState.governmentIds),
        educationalBackground: hydrateEducationalBackground(
          parsedState.educationalBackground,
        ),
        civilServiceEligibility: hydrateCivilServiceEligibility(
          parsedState.civilServiceEligibility,
        ),
        additionalInformation: hydrateAdditionalInformation(
          parsedState.additionalInformation,
        ),
        declaration: hydrateDeclaration(parsedState.declaration),
      });
    } catch (error) {
      console.error("Failed to load PDS data", error);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!myInformation) return;

    setState((current) => ({
      ...current,
      personalInfo: {
        lastName: current.personalInfo.lastName || myInformation.last_name || "",
        firstName: current.personalInfo.firstName || myInformation.first_name || "",
        middleName: current.personalInfo.middleName || myInformation.middle_name || "",
        nameExtension: current.personalInfo.nameExtension,
        dateOfBirth: current.personalInfo.dateOfBirth || myInformation.date_of_birth || "",
        placeOfBirth: current.personalInfo.placeOfBirth,
        gender: current.personalInfo.gender || myInformation.gender || "",
        civilStatus: current.personalInfo.civilStatus || myInformation.civil_status || "",
        citizenship: current.personalInfo.citizenship || "Filipino",
        citizenshipStatus: current.personalInfo.citizenshipStatus || "Filipino",
        dualCitizenshipMode: current.personalInfo.dualCitizenshipMode,
        citizenshipCountry: current.personalInfo.citizenshipCountry,
        heightCm: current.personalInfo.heightCm,
        weightKg: current.personalInfo.weightKg,
        bloodType: current.personalInfo.bloodType,
      },
      residentialAddress: {
        ...current.residentialAddress,
        street: current.residentialAddress.street || myInformation.home_address || "",
        mobileNo:
          current.residentialAddress.mobileNo || myInformation.mobile_number || "",
        emailAddress: current.residentialAddress.emailAddress || myInformation.email || "",
      },
      governmentIds: {
        ...current.governmentIds,
        tinNumber: current.governmentIds.tinNumber || myInformation.tin || "",
        agencyEmployeeNumber:
          current.governmentIds.agencyEmployeeNumber ||
          myInformation.employee_id ||
          "",
      },
      declaration: {
        ...current.declaration,
        dateAccomplished: current.declaration.dateAccomplished,
      },
    }));
  }, [myInformation]);

  useEffect(() => {
    writeStoredState(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  const updatePersonalInfo = (
    key: keyof PersonalSectionState,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [key]: value,
      },
    }));
  };

  const updateResidentialAddress = (
    key: keyof ResidentialAddressState,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      residentialAddress: {
        ...current.residentialAddress,
        [key]: value,
      },
    }));
  };

  const updatePermanentAddress = (
    key: keyof ResidentialAddressState,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      permanentAddress: {
        ...current.permanentAddress,
        [key]: value,
      },
    }));
  };

  const updateGovernmentIds = (
    key: keyof GovernmentIdsState,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      governmentIds: {
        ...current.governmentIds,
        [key]: value,
      },
    }));
  };

  const updateFamilyBackground = (
    key: Exclude<keyof FamilyBackgroundState, "children">,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      familyBackground: {
        ...current.familyBackground,
        [key]: value,
      },
    }));
  };

  const addChild = () => {
    setState((current) => ({
      ...current,
      familyBackground: {
        ...current.familyBackground,
        children: [...current.familyBackground.children, createDefaultChildEntry()],
      },
    }));
  };

  const updateChild = (
    id: string,
    field: keyof Omit<ChildEntry, "id">,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      familyBackground: {
        ...current.familyBackground,
        children: current.familyBackground.children.map((item) =>
          item.id === id ? { ...item, [field]: value } : item,
        ),
      },
    }));
  };

  const updateEducationalBackground = (
    level: EducationLevelKey,
    field: keyof EducationEntry,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      educationalBackground: {
        ...current.educationalBackground,
        [level]: {
          ...current.educationalBackground[level],
          [field]: value,
        },
      },
    }));
  };

  const addCivilServiceEligibility = () => {
    setState((current) => ({
      ...current,
      civilServiceEligibility: [
        ...current.civilServiceEligibility,
        createDefaultCivilServiceEligibilityEntry(),
      ],
    }));
  };

  const updateCivilServiceEligibility = (
    id: string,
    field: keyof Omit<CivilServiceEligibilityEntry, "id">,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      civilServiceEligibility: current.civilServiceEligibility.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const updateAdditionalInformation = <
    TKey extends keyof AdditionalInformationState,
  >(
    key: TKey,
    field:
      | keyof AdditionalInformationState[TKey]
      | "idNumber",
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      additionalInformation: {
        ...current.additionalInformation,
        [key]: {
          ...current.additionalInformation[key],
          [field]: value,
        },
      },
    }));
  };

  const updateDeclaration = (
    key: keyof DeclarationState,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      declaration: {
        ...current.declaration,
        [key]: value,
      },
    }));
  };

  const addSimpleEntry = (
    key:
      | "workExperience"
      | "voluntaryWork"
      | "training"
      | "awards"
      | "memberships",
  ) => {
    setState((current) => ({
      ...current,
      [key]: [
        ...current[key],
        createDefaultSimpleEntry(),
      ],
    }));
  };

  const updateSimpleEntry = (
    key:
      | "workExperience"
      | "voluntaryWork"
      | "training"
      | "awards"
      | "memberships",
    id: string,
    field: keyof SimpleEntry,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      [key]: current[key].map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addReference = () => {
    setState((current) => ({
      ...current,
      references: [
        ...current.references,
        { id: createId(), name: "", contact: "", address: "" },
      ],
    }));
  };

  const updateReference = (
    id: string,
    field: keyof ReferenceEntry,
    value: string,
  ) => {
    setState((current) => ({
      ...current,
      references: current.references.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const removeEntry = () => {
    if (!deleteTarget) return;
    if (deleteTarget.collection === "children") {
      setState((current) => ({
        ...current,
        familyBackground: {
          ...current.familyBackground,
          children: current.familyBackground.children.filter(
            (item) => item.id !== deleteTarget.id,
          ),
        },
      }));
    } else {
      setState((current) => ({
        ...current,
        [deleteTarget.collection]: current[deleteTarget.collection].filter(
          (item) => item.id !== deleteTarget.id,
        ),
      }));
    }
    setDeleteTarget(null);
  };

  const addSkill = () => {
    const cleaned = newSkill.trim();
    if (!cleaned) return;
    setState((current) => ({ ...current, skills: [...current.skills, cleaned] }));
    setNewSkill("");
  };

  const clearForm = () => {
    setState(createDefaultState());
    setNewSkill("");
    clearStoredState(storageKey);
  };

  const printedSectionCount = Object.values(sectionsToPrint).filter(Boolean).length;
  const allSectionsSelected = Object.values(sectionsToPrint).every(Boolean);
  const includedSections = printSectionDefinitions
    .filter(({ key }) => sectionsToPrint[key])
    .map(({ id }) => id);

  const openPrintOptions = () => setPrintOptionsOpen(true);
  const openPreview = () => {
    setPrintOptionsOpen(false);
    setPreviewOpen(true);
  };
  const printNow = () => {
    setPreviewOpen(false);
    setPrintOptionsOpen(false);
    document.body.classList.add("pds-printing");
    window.setTimeout(() => {
      window.print();
    }, 0);
  };

  const printSheet = (
    <div className="hidden print:block pds-print-root">
      <div className="mx-auto w-fit bg-white">
        <PDSPrintSheet
          myInformation={myInformation}
          state={state}
          paperSize={paperSize}
          printMode={printMode}
          includedSections={includedSections}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 print:space-y-4">
      <Accordion
        type="multiple"
        defaultValue={["personal"]}
        className="space-y-4 print:space-y-3"
      >
        <SectionShell title="I. PERSONAL INFORMATION" value="personal">
          <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
            <SectionBlockTitle title="Name" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <EditableField
                label="Surname"
                required
                value={state.personalInfo.lastName}
                onChange={(value) => updatePersonalInfo("lastName", value)}
              />
              <EditableField
                label="First Name"
                required
                value={state.personalInfo.firstName}
                onChange={(value) => updatePersonalInfo("firstName", value)}
              />
              <EditableField
                label="Middle Name"
                value={state.personalInfo.middleName}
                onChange={(value) => updatePersonalInfo("middleName", value)}
              />
              <EditableField
                label="Name Extension"
                value={state.personalInfo.nameExtension}
                onChange={(value) => updatePersonalInfo("nameExtension", value)}
              />
            </div>

            <SectionBlockTitle title="Birth And Status" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <EditableField
                label="Date of Birth"
                type="date"
                value={state.personalInfo.dateOfBirth}
                onChange={(value) => updatePersonalInfo("dateOfBirth", value)}
              />
              <EditableField
                label="Place of Birth"
                value={state.personalInfo.placeOfBirth}
                onChange={(value) => updatePersonalInfo("placeOfBirth", value)}
              />
              <RadioGroup
                label="Sex at Birth"
                options={["Male", "Female"]}
                selected={state.personalInfo.gender}
                onChange={(value) => updatePersonalInfo("gender", value)}
              />
              <SelectField
                label="Civil Status"
                value={state.personalInfo.civilStatus}
                options={["Single", "Married", "Widowed", "Separated", "Other/s"]}
                onChange={(value) => updatePersonalInfo("civilStatus", value)}
              />
              <SelectField
                label="Citizenship Status"
                value={state.personalInfo.citizenshipStatus}
                options={["Filipino", "Dual Citizenship"]}
                onChange={(value) =>
                  updatePersonalInfo("citizenshipStatus", value)
                }
              />
              <SelectField
                label="Dual Citizenship Mode"
                value={state.personalInfo.dualCitizenshipMode}
                placeholder="Select mode (if dual citizenship)"
                options={["by birth", "by naturalization"]}
                onChange={(value) =>
                  updatePersonalInfo("dualCitizenshipMode", value)
                }
              />
              <EditableField
                label="Citizenship Country"
                value={state.personalInfo.citizenshipCountry}
                onChange={(value) =>
                  updatePersonalInfo("citizenshipCountry", value)
                }
              />
              <EditableField
                label="Blood Type"
                value={state.personalInfo.bloodType}
                onChange={(value) => updatePersonalInfo("bloodType", value)}
              />
              <EditableField
                label="Height (m)"
                value={state.personalInfo.heightCm}
                onChange={(value) => updatePersonalInfo("heightCm", value)}
              />
              <EditableField
                label="Weight (kg)"
                value={state.personalInfo.weightKg}
                onChange={(value) => updatePersonalInfo("weightKg", value)}
              />
            </div>

            <SectionBlockTitle title="Government Issued IDs" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <EditableField
                label="UMID ID No."
                value={state.governmentIds.umidNumber}
                onChange={(value) => updateGovernmentIds("umidNumber", value)}
              />
              <EditableField
                label="PAG-IBIG ID No."
                value={state.governmentIds.pagibigNumber}
                onChange={(value) => updateGovernmentIds("pagibigNumber", value)}
              />
              <EditableField
                label="PhilHealth No."
                value={state.governmentIds.philhealthNumber}
                onChange={(value) =>
                  updateGovernmentIds("philhealthNumber", value)
                }
              />
              <EditableField
                label="PhilSys Number (PSN)"
                value={state.governmentIds.philSysNumber}
                onChange={(value) =>
                  updateGovernmentIds("philSysNumber", value)
                }
              />
              <EditableField
                label="TIN No."
                value={state.governmentIds.tinNumber}
                onChange={(value) => updateGovernmentIds("tinNumber", value)}
              />
              <EditableField
                label="Agency Employee No."
                value={state.governmentIds.agencyEmployeeNumber}
                onChange={(value) =>
                  updateGovernmentIds("agencyEmployeeNumber", value)
                }
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <AddressEditorCard
                title="Residential Address"
                address={state.residentialAddress}
                onChange={updateResidentialAddress}
                includeContact
              />
              <AddressEditorCard
                title="Permanent Address"
                address={state.permanentAddress}
                onChange={updatePermanentAddress}
              />
            </div>
          </div>
        </SectionShell>

        <SectionShell title="II. FAMILY BACKGROUND" value="family">
          <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionBlockTitle title="Spouse Information" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <EditableField
                label="Spouse Surname"
                value={state.familyBackground.spouseLastName}
                onChange={(value) =>
                  updateFamilyBackground("spouseLastName", value)
                }
              />
              <EditableField
                label="Spouse First Name"
                value={state.familyBackground.spouseFirstName}
                onChange={(value) =>
                  updateFamilyBackground("spouseFirstName", value)
                }
              />
              <EditableField
                label="Spouse Middle Name"
                value={state.familyBackground.spouseMiddleName}
                onChange={(value) =>
                  updateFamilyBackground("spouseMiddleName", value)
                }
              />
              <EditableField
                label="Spouse Name Extension"
                value={state.familyBackground.spouseNameExtension}
                onChange={(value) =>
                  updateFamilyBackground("spouseNameExtension", value)
                }
              />
              <EditableField
                label="Occupation"
                value={state.familyBackground.spouseOccupation}
                onChange={(value) =>
                  updateFamilyBackground("spouseOccupation", value)
                }
              />
              <EditableField
                label="Employer/Business Name"
                value={state.familyBackground.spouseEmployerBusinessName}
                onChange={(value) =>
                  updateFamilyBackground("spouseEmployerBusinessName", value)
                }
              />
              <EditableField
                label="Business Address"
                value={state.familyBackground.spouseBusinessAddress}
                onChange={(value) =>
                  updateFamilyBackground("spouseBusinessAddress", value)
                }
              />
              <EditableField
                label="Telephone No."
                value={state.familyBackground.spouseTelephoneNo}
                onChange={(value) =>
                  updateFamilyBackground("spouseTelephoneNo", value)
                }
              />
            </div>

            <ChildrenEditor
              items={state.familyBackground.children}
              onAdd={addChild}
              onChange={updateChild}
              onDelete={(id) =>
                setDeleteTarget({ collection: "children", id })
              }
            />

            <SectionBlockTitle title="Parents" />
            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <h4 className="text-lg font-semibold text-slate-900">Father</h4>
                <EditableField
                  label="Surname"
                  value={state.familyBackground.fatherLastName}
                  onChange={(value) =>
                    updateFamilyBackground("fatherLastName", value)
                  }
                />
                <EditableField
                  label="First Name"
                  value={state.familyBackground.fatherFirstName}
                  onChange={(value) =>
                    updateFamilyBackground("fatherFirstName", value)
                  }
                />
                <EditableField
                  label="Middle Name"
                  value={state.familyBackground.fatherMiddleName}
                  onChange={(value) =>
                    updateFamilyBackground("fatherMiddleName", value)
                  }
                />
                <EditableField
                  label="Name Extension"
                  value={state.familyBackground.fatherNameExtension}
                  onChange={(value) =>
                    updateFamilyBackground("fatherNameExtension", value)
                  }
                />
              </div>
              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <h4 className="text-lg font-semibold text-slate-900">
                  Mother's Maiden Name
                </h4>
                <EditableField
                  label="Surname"
                  value={state.familyBackground.motherLastName}
                  onChange={(value) =>
                    updateFamilyBackground("motherLastName", value)
                  }
                />
                <EditableField
                  label="First Name"
                  value={state.familyBackground.motherFirstName}
                  onChange={(value) =>
                    updateFamilyBackground("motherFirstName", value)
                  }
                />
                <EditableField
                  label="Middle Name"
                  value={state.familyBackground.motherMiddleName}
                  onChange={(value) =>
                    updateFamilyBackground("motherMiddleName", value)
                  }
                />
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell title="III. EDUCATIONAL BACKGROUND" value="education">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-6 text-2xl font-semibold text-slate-900">
              Educational Background
            </h3>
            <div className="space-y-4">
              {educationLevelDefinitions.map(({ key, label }) => (
                <div key={key} className="rounded-2xl border border-slate-200 p-4">
                  <h4 className="mb-4 text-lg font-semibold text-slate-900">
                    {label}
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <EditableField
                      label="Name of School"
                      value={state.educationalBackground[key].school}
                      onChange={(value) =>
                        updateEducationalBackground(key, "school", value)
                      }
                    />
                    <EditableField
                      label="Basic Education/Degree/Course"
                      value={state.educationalBackground[key].course}
                      onChange={(value) =>
                        updateEducationalBackground(key, "course", value)
                      }
                    />
                    <EditableField
                      label="Period of Attendance From"
                      value={state.educationalBackground[key].attendanceFrom}
                      onChange={(value) =>
                        updateEducationalBackground(key, "attendanceFrom", value)
                      }
                    />
                    <EditableField
                      label="Period of Attendance To"
                      value={state.educationalBackground[key].attendanceTo}
                      onChange={(value) =>
                        updateEducationalBackground(key, "attendanceTo", value)
                      }
                    />
                    <EditableField
                      label="Highest Level/Units Earned"
                      value={state.educationalBackground[key].highestLevel}
                      onChange={(value) =>
                        updateEducationalBackground(key, "highestLevel", value)
                      }
                    />
                    <EditableField
                      label="Year Graduated"
                      value={state.educationalBackground[key].yearGraduated}
                      onChange={(value) =>
                        updateEducationalBackground(key, "yearGraduated", value)
                      }
                    />
                    <div className="md:col-span-2 xl:col-span-3">
                      <EditableField
                        label="Scholarship/Academic Honors Received"
                        value={state.educationalBackground[key].honors}
                        onChange={(value) =>
                          updateEducationalBackground(key, "honors", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell title="IV. CIVIL SERVICE ELIGIBILITY" value="civil">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionIntro
              title="Civil Service Eligibility"
              actionLabel="Add Eligibility"
              onAction={addCivilServiceEligibility}
            />
            <div className="space-y-4">
              {state.civilServiceEligibility.length === 0 && (
                <EmptyMessage message="No civil service eligibility entries yet." />
              )}
              {state.civilServiceEligibility.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Eligibility {index + 1}
                    </p>
                    <IconActions
                      onDelete={() =>
                        setDeleteTarget({
                          collection: "civilServiceEligibility",
                          id: item.id,
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <EditableField
                      label="Career Service / RA 1080 / Board / Bar / Special Law"
                      value={item.eligibility}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "eligibility", value)
                      }
                    />
                    <EditableField
                      label="Rating"
                      value={item.rating}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "rating", value)
                      }
                    />
                    <EditableField
                      label="Date of Examination/Conferment"
                      value={item.examDate}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "examDate", value)
                      }
                    />
                    <EditableField
                      label="Place of Examination/Conferment"
                      value={item.examPlace}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "examPlace", value)
                      }
                    />
                    <EditableField
                      label="License Number"
                      value={item.licenseNumber}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "licenseNumber", value)
                      }
                    />
                    <EditableField
                      label="Validity"
                      value={item.validity}
                      onChange={(value) =>
                        updateCivilServiceEligibility(item.id, "validity", value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell title="V. WORK EXPERIENCE" value="work">
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionIntro
              title="Work Experience"
              actionLabel="Add Work Experience"
              onAction={() => addSimpleEntry("workExperience")}
            />
            <p className="mb-5 text-sm text-slate-500">
              Include private employment. Start from your most recent work.
            </p>
            <div className="space-y-4">
              {state.workExperience.length === 0 && (
                <EmptyMessage message="No work experience entries yet." />
              )}
              {state.workExperience.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Work Experience {index + 1}
                    </p>
                    <IconActions
                      onDelete={() =>
                        setDeleteTarget({ collection: "workExperience", id: item.id })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <EditableField
                      label="Inclusive Dates From"
                      type="date"
                      value={item.fromDate}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "fromDate", value)
                      }
                    />
                    <EditableField
                      label="Inclusive Dates To"
                      type="date"
                      value={item.toDate}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "toDate", value)
                      }
                    />
                    <EditableField
                      label="Position Title"
                      value={item.title}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "title", value)
                      }
                    />
                    <EditableField
                      label="Department / Agency / Office / Company"
                      value={item.subtitle}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "subtitle", value)
                      }
                    />
                    <EditableField
                      label="Status of Appointment"
                      value={item.extraOne}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "extraOne", value)
                      }
                    />
                    <SelectField
                      label="Gov't Service (Y/N)"
                      value={item.extraTwo}
                      placeholder="Select Y or N"
                      options={["Y", "N"]}
                      onChange={(value) =>
                        updateSimpleEntry("workExperience", item.id, "extraTwo", value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell
          title="VI. VOLUNTARY WORK OR INVOLVEMENT IN CIVIC / NON-GOVERNMENT / PEOPLE / VOLUNTARY ORGANIZATION/S"
          value="voluntary"
        >
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionIntro
              title="Voluntary Work"
              actionLabel="Add Voluntary Work"
              onAction={() => addSimpleEntry("voluntaryWork")}
            />
            <div className="space-y-4">
              {state.voluntaryWork.length === 0 && (
                <EmptyMessage message="No voluntary work entries yet." />
              )}
              {state.voluntaryWork.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Voluntary Work {index + 1}
                    </p>
                    <IconActions
                      onDelete={() =>
                        setDeleteTarget({ collection: "voluntaryWork", id: item.id })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="md:col-span-2 xl:col-span-3">
                      <EditableField
                        label="Name & Address of Organization"
                        value={item.title}
                        onChange={(value) =>
                          updateSimpleEntry("voluntaryWork", item.id, "title", value)
                        }
                      />
                    </div>
                    <EditableField
                      label="Inclusive Dates From"
                      type="date"
                      value={item.fromDate}
                      onChange={(value) =>
                        updateSimpleEntry("voluntaryWork", item.id, "fromDate", value)
                      }
                    />
                    <EditableField
                      label="Inclusive Dates To"
                      type="date"
                      value={item.toDate}
                      onChange={(value) =>
                        updateSimpleEntry("voluntaryWork", item.id, "toDate", value)
                      }
                    />
                    <EditableField
                      label="Number of Hours"
                      value={item.extraOne}
                      onChange={(value) =>
                        updateSimpleEntry("voluntaryWork", item.id, "extraOne", value)
                      }
                    />
                    <div className="md:col-span-2 xl:col-span-3">
                      <EditableField
                        label="Position / Nature of Work"
                        value={item.subtitle}
                        onChange={(value) =>
                          updateSimpleEntry("voluntaryWork", item.id, "subtitle", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell
          title="VII. LEARNING AND DEVELOPMENT (L&D) INTERVENTIONS / TRAINING PROGRAMS ATTENDED"
          value="training"
        >
          <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <SectionIntro
              title="Learning and Development (L&D)"
              actionLabel="Add Training Program"
              onAction={() => addSimpleEntry("training")}
            />
            <div className="space-y-4">
              {state.training.length === 0 && (
                <EmptyMessage message="No learning and development entries yet." />
              )}
              {state.training.map((item, index) => (
                <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-900">
                      Training Program {index + 1}
                    </p>
                    <IconActions
                      onDelete={() =>
                        setDeleteTarget({ collection: "training", id: item.id })
                      }
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <div className="md:col-span-2 xl:col-span-3">
                      <EditableField
                        label="Title of Learning and Development Interventions / Training Programs"
                        value={item.title}
                        onChange={(value) =>
                          updateSimpleEntry("training", item.id, "title", value)
                        }
                      />
                    </div>
                    <EditableField
                      label="Inclusive Dates From"
                      type="date"
                      value={item.fromDate}
                      onChange={(value) =>
                        updateSimpleEntry("training", item.id, "fromDate", value)
                      }
                    />
                    <EditableField
                      label="Inclusive Dates To"
                      type="date"
                      value={item.toDate}
                      onChange={(value) =>
                        updateSimpleEntry("training", item.id, "toDate", value)
                      }
                    />
                    <EditableField
                      label="Number of Hours"
                      value={item.extraOne}
                      onChange={(value) =>
                        updateSimpleEntry("training", item.id, "extraOne", value)
                      }
                    />
                    <EditableField
                      label="Type of L&D"
                      value={item.extraTwo}
                      onChange={(value) =>
                        updateSimpleEntry("training", item.id, "extraTwo", value)
                      }
                    />
                    <div className="md:col-span-2 xl:col-span-3">
                      <EditableField
                        label="Conducted / Sponsored By"
                        value={item.subtitle}
                        onChange={(value) =>
                          updateSimpleEntry("training", item.id, "subtitle", value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionShell>

        <SectionShell title="VIII. OTHER INFORMATION" value="other">
          <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              These three lists will be printed in the Section VIII table.
            </p>
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-slate-900">
                    31. Special Skills and Hobbies
                  </h4>
                  <Button type="button" size="sm" onClick={addSkill}>
                    <i className="fas fa-plus text-xs"></i>
                    Add
                  </Button>
                </div>
                <input
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                  placeholder="Type a skill or hobby, then add it"
                  className="input-field h-12 rounded-xl"
                />
                <div className="space-y-3">
                  {state.skills.length === 0 && (
                    <EmptyMessage message="No skills or hobbies added yet." />
                  )}
                  {state.skills.map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2"
                    >
                      <span className="text-sm text-slate-800">{skill}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setState((current) => ({
                            ...current,
                            skills: current.skills.filter((item) => item !== skill),
                          }))
                        }
                        className="text-red-600"
                      >
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-slate-900">
                    32. Non-Academic Distinctions / Recognition
                  </h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSimpleEntry("awards")}
                  >
                    <i className="fas fa-plus text-xs"></i>
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {state.awards.length === 0 && (
                    <EmptyMessage message="No distinctions or recognitions added yet." />
                  )}
                  {state.awards.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          Recognition {index + 1}
                        </p>
                        <IconActions
                          onDelete={() =>
                            setDeleteTarget({ collection: "awards", id: item.id })
                          }
                        />
                      </div>
                      <EditableField
                        label="Recognition / Distinction"
                        value={item.title}
                        onChange={(value) =>
                          updateSimpleEntry("awards", item.id, "title", value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-semibold text-slate-900">
                    33. Membership in Association / Organization
                  </h4>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => addSimpleEntry("memberships")}
                  >
                    <i className="fas fa-plus text-xs"></i>
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {state.memberships.length === 0 && (
                    <EmptyMessage message="No association or organization memberships added yet." />
                  )}
                  {state.memberships.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">
                          Membership {index + 1}
                        </p>
                        <IconActions
                          onDelete={() =>
                            setDeleteTarget({
                              collection: "memberships",
                              id: item.id,
                            })
                          }
                        />
                      </div>
                      <EditableField
                        label="Association / Organization"
                        value={item.title}
                        onChange={(value) =>
                          updateSimpleEntry("memberships", item.id, "title", value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          title="IX. ADDITIONAL INFORMATION, REFERENCES & DECLARATION"
          value="additional"
        >
          <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4">
              <YesNoQuestionCard
                name="relation-third-degree"
                title="34.a Are you related by consanguinity or affinity to the appointing or recommending authority, or to the chief of bureau or office, or to the person who has immediate supervision over you in the Office, Bureau or Department where you will be appointed, within the third degree?"
                value={state.additionalInformation.relationThirdDegree}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("relationThirdDegree", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("relationThirdDegree", "details", value)
                }
              />

              <YesNoQuestionCard
                name="relation-fourth-degree"
                title="34.b Are you related within the fourth degree (for Local Government Unit - Career Employees)?"
                value={state.additionalInformation.relationFourthDegree}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("relationFourthDegree", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("relationFourthDegree", "details", value)
                }
              />

              <YesNoQuestionCard
                name="admin-offense"
                title="35.a Have you ever been found guilty of any administrative offense?"
                value={state.additionalInformation.adminOffense}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("adminOffense", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("adminOffense", "details", value)
                }
              />

              <YesNoQuestionCard
                name="criminal-charge"
                title="35.b Have you been criminally charged before any court?"
                value={state.additionalInformation.criminalCharge}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("criminalCharge", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("criminalCharge", "details", value)
                }
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <EditableField
                    label="Date Filed"
                    type="date"
                    value={state.additionalInformation.criminalCharge.dateFiled}
                    onChange={(value) =>
                      updateAdditionalInformation("criminalCharge", "dateFiled", value)
                    }
                  />
                  <EditableField
                    label="Status of Case/s"
                    value={state.additionalInformation.criminalCharge.statusOfCase}
                    onChange={(value) =>
                      updateAdditionalInformation("criminalCharge", "statusOfCase", value)
                    }
                  />
                </div>
              </YesNoQuestionCard>

              <YesNoQuestionCard
                name="convicted-crime"
                title="36. Have you ever been convicted of any crime or violation of any law, decree, ordinance, or regulation by any court or tribunal?"
                value={state.additionalInformation.convictedCrime}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("convictedCrime", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("convictedCrime", "details", value)
                }
              />

              <YesNoQuestionCard
                name="separated-service"
                title="37. Have you ever been separated from the service in any of the following modes: resignation, retirement, dropped from the rolls, dismissal, termination, end of term, finished contract or phased out (abolition) in the public or private sector?"
                value={state.additionalInformation.separatedService}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("separatedService", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("separatedService", "details", value)
                }
              />

              <YesNoQuestionCard
                name="candidate-election"
                title="38.a Have you been a candidate in a national or local election held within the last year (except Barangay election)?"
                value={state.additionalInformation.candidateElection}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("candidateElection", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("candidateElection", "details", value)
                }
              />

              <YesNoQuestionCard
                name="resigned-during-campaign"
                title="38.b Have you resigned from the government service during the three (3)-month period before the last election to promote/actively campaign for a national or local candidate?"
                value={state.additionalInformation.resignedDuringCampaign}
                onAnswerChange={(value) =>
                  updateAdditionalInformation(
                    "resignedDuringCampaign",
                    "answer",
                    value,
                  )
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation(
                    "resignedDuringCampaign",
                    "details",
                    value,
                  )
                }
              />

              <YesNoQuestionCard
                name="immigrant-status"
                title="39. Have you acquired the status of an immigrant or permanent resident of another country?"
                detailLabel="If YES, give details (country)"
                value={state.additionalInformation.immigrantStatus}
                onAnswerChange={(value) =>
                  updateAdditionalInformation("immigrantStatus", "answer", value)
                }
                onDetailsChange={(value) =>
                  updateAdditionalInformation("immigrantStatus", "details", value)
                }
              />

              <div className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-lg font-semibold text-slate-900">
                  40. Pursuant to: (a) Indigenous People&apos;s Act (RA 8371); (b)
                  Magna Carta for Disabled Persons (RA 7277, as amended); and (c)
                  Expanded Solo Parents Welfare Act (RA 11861), please answer the
                  following items
                </h4>
                <div className="mt-4 space-y-4">
                  <YesNoQuestionCard
                    name="indigenous-group"
                    title="40.a Are you a member of any indigenous group?"
                    detailLabel="If YES, please specify"
                    value={state.additionalInformation.indigenousGroup}
                    onAnswerChange={(value) =>
                      updateAdditionalInformation("indigenousGroup", "answer", value)
                    }
                    onDetailsChange={(value) =>
                      updateAdditionalInformation("indigenousGroup", "details", value)
                    }
                  />

                  <YesNoQuestionCard
                    name="disability"
                    title="40.b Are you a person with disability?"
                    detailLabel="If YES, please specify"
                    value={state.additionalInformation.disability}
                    onAnswerChange={(value) =>
                      updateAdditionalInformation("disability", "answer", value)
                    }
                    onDetailsChange={(value) =>
                      updateAdditionalInformation("disability", "details", value)
                    }
                  >
                    <EditableField
                      label="Disability ID No."
                      value={state.additionalInformation.disability.idNumber}
                      onChange={(value) =>
                        updateAdditionalInformation("disability", "idNumber", value)
                      }
                    />
                  </YesNoQuestionCard>

                  <YesNoQuestionCard
                    name="solo-parent"
                    title="40.c Are you a solo parent?"
                    detailLabel="If YES, please specify"
                    value={state.additionalInformation.soloParent}
                    onAnswerChange={(value) =>
                      updateAdditionalInformation("soloParent", "answer", value)
                    }
                    onDetailsChange={(value) =>
                      updateAdditionalInformation("soloParent", "details", value)
                    }
                  >
                    <EditableField
                      label="Solo Parent ID No."
                      value={state.additionalInformation.soloParent.idNumber}
                      onChange={(value) =>
                        updateAdditionalInformation("soloParent", "idNumber", value)
                      }
                    />
                  </YesNoQuestionCard>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <SectionIntro
                title="41. References (Person not related by consanguinity or affinity to applicant/appointee)"
                actionLabel="Add Reference"
                onAction={addReference}
              />
              <div className="space-y-4">
                {state.references.length === 0 && (
                  <EmptyMessage message="No references added yet." />
                )}
                {state.references.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="font-semibold text-slate-900">
                        Reference {index + 1}
                      </p>
                      <IconActions
                        onDelete={() =>
                          setDeleteTarget({ collection: "references", id: item.id })
                        }
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      <EditableField
                        label="Name"
                        value={item.name}
                        onChange={(value) => updateReference(item.id, "name", value)}
                      />
                      <EditableField
                        label="Office / Residential Address"
                        value={item.address}
                        onChange={(value) =>
                          updateReference(item.id, "address", value)
                        }
                      />
                      <EditableField
                        label="Contact No. and/or Email"
                        value={item.contact}
                        onChange={(value) =>
                          updateReference(item.id, "contact", value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
              <SectionBlockTitle title="42. Declaration and Government ID" />
              <p className="mb-4 text-sm text-slate-500">
                This information will populate the declaration area on the last page
                of the printed PDS.
              </p>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <EditableField
                  label="Government Issued ID"
                  value={state.declaration.governmentIdType}
                  onChange={(value) => updateDeclaration("governmentIdType", value)}
                />
                <EditableField
                  label="ID / License / Passport No."
                  value={state.declaration.governmentIdNumber}
                  onChange={(value) =>
                    updateDeclaration("governmentIdNumber", value)
                  }
                />
                <EditableField
                  label="Place of Issue"
                  value={state.declaration.governmentIdIssuePlace}
                  onChange={(value) =>
                    updateDeclaration("governmentIdIssuePlace", value)
                  }
                />
                <EditableField
                  label="Government ID Issue Date"
                  type="date"
                  value={state.declaration.governmentIdIssueDate}
                  onChange={(value) =>
                    updateDeclaration("governmentIdIssueDate", value)
                  }
                />
                <EditableField
                  label="Date Accomplished"
                  type="date"
                  value={state.declaration.dateAccomplished}
                  onChange={(value) => updateDeclaration("dateAccomplished", value)}
                />
              </div>
            </div>
          </div>
        </SectionShell>
      </Accordion>

      <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 print:hidden sm:flex-row sm:items-center sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={clearForm} className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
          <i className="fas fa-trash text-sm"></i>
          Clear Form
        </Button>
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" size="lg" onClick={openPrintOptions}>
            <i className="fas fa-print text-sm"></i>
            Print Form
          </Button>
          <Button type="button" size="lg">
            <i className="fas fa-save text-sm"></i>
            Save PDS
          </Button>
        </div>
      </div>

      <Dialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete entry?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this record from the PDS?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={removeEntry}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={printOptionsOpen} onOpenChange={setPrintOptionsOpen}>
        <DialogContent className="max-w-[540px] rounded-2xl p-0 print:hidden">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl">Print Options</DialogTitle>
            </DialogHeader>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Paper Size
                </label>
                <Select
                  value={paperSize}
                  onValueChange={(value) => setPaperSize(value as PaperSize)}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4 (210 x 297 mm)</SelectItem>
                    <SelectItem value="Letter">Letter (8.5 x 11 in)</SelectItem>
                    <SelectItem value="Legal">Legal (8.5 x 14 in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Print Mode
                </label>
                <Select
                  value={printMode}
                  onValueChange={(value) => setPrintMode(value as PrintMode)}
                >
                  <SelectTrigger className="h-12 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="filled">Filled Form</SelectItem>
                    <SelectItem value="blank">Blank Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Sections to Print
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setSectionsToPrint(
                      Object.fromEntries(
                        printSectionDefinitions.map(({ key }) => [
                          key,
                          !allSectionsSelected,
                        ]),
                      ) as Record<PrintSectionKey, boolean>,
                    )
                  }
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {allSectionsSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
              <div className="grid max-h-[200px] gap-3 overflow-auto rounded-xl border border-slate-200 p-4">
                {printSectionDefinitions.map(({ key, label }) => (
                  <label
                    key={key}
                    className="flex items-center gap-3 text-sm text-slate-800"
                  >
                    <input
                      type="checkbox"
                      checked={sectionsToPrint[key as PrintSectionKey]}
                      onChange={(event) =>
                        setSectionsToPrint((current) => ({
                          ...current,
                          [key]: event.target.checked,
                        }))
                      }
                      className="h-4 w-4 accent-blue-600"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <DialogFooter className="mt-8 justify-center sm:justify-center">
              <Button type="button" variant="outline" onClick={() => setPrintOptionsOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="outline" onClick={openPreview}>
                <i className="fas fa-eye text-sm"></i>
                Print Preview
              </Button>
              <Button type="button" onClick={printNow}>
                <i className="fas fa-print text-sm"></i>
                Print Form
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {previewOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-[#121212] print:hidden">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 text-white">
            <div>
              <h2 className="text-3xl font-semibold">Print Preview</h2>
              <p className="mt-1 text-sm text-white/60">
                {paperSize} - {printMode === "filled" ? "Filled Form" : "Blank Form"} - {printedSectionCount} Sections
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewOpen(false)}
                className="border-white/20 bg-transparent text-white hover:bg-white/5 hover:text-white"
              >
                <i className="fas fa-times text-sm"></i>
                Close Preview
              </Button>
              <Button type="button" onClick={printNow}>
                <i className="fas fa-print text-sm"></i>
                Print Now
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto w-fit bg-white shadow-2xl">
              <PDSPrintSheet
                myInformation={myInformation}
                state={state}
                paperSize={paperSize}
                printMode={printMode}
                includedSections={includedSections}
              />
            </div>
          </div>
        </div>
      )}

      {createPortal(printSheet, document.body)}
    </div>
  );
};

const PDSPrintSheet = ({
  myInformation,
  state,
  paperSize,
  printMode,
  includedSections,
}: {
  myInformation: PersonalInformation | null;
  state: PDSState;
  paperSize: PaperSize;
  printMode: PrintMode;
  includedSections: PDSPrintSectionId[];
}) => {
  const educationRows = educationLevelDefinitions.map(({ key, label }) => {
    const item = state.educationalBackground[key];

    return {
      level: label,
      school: item.school,
      course: item.course,
      attendanceFrom: item.attendanceFrom,
      attendanceTo: item.attendanceTo,
      highestLevel: item.highestLevel,
      yearGraduated: item.yearGraduated,
      honors: item.honors,
    };
  });

  const otherInformationRowCount = Math.max(
    state.skills.length,
    state.awards.length,
    state.memberships.length,
    1,
  );

  const formData: PDSPrintTemplateData = {
    personal: {
      lastName: state.personalInfo.lastName || myInformation?.last_name || "",
      firstName: state.personalInfo.firstName || myInformation?.first_name || "",
      middleName:
        state.personalInfo.middleName || myInformation?.middle_name || "",
      nameExtension: state.personalInfo.nameExtension,
      dateOfBirth:
        state.personalInfo.dateOfBirth || myInformation?.date_of_birth || "",
      placeOfBirth: state.personalInfo.placeOfBirth,
      sex: state.personalInfo.gender || myInformation?.gender || "",
      civilStatus:
        state.personalInfo.civilStatus || myInformation?.civil_status || "",
      citizenshipStatus:
        state.personalInfo.citizenshipStatus ||
        state.personalInfo.citizenship ||
        "Filipino",
      dualCitizenshipMode: state.personalInfo.dualCitizenshipMode,
      citizenshipCountry: state.personalInfo.citizenshipCountry,
      heightMeters: state.personalInfo.heightCm,
      weightKg: state.personalInfo.weightKg,
      bloodType: state.personalInfo.bloodType,
    },
    governmentIds: {
      ...state.governmentIds,
      tinNumber: state.governmentIds.tinNumber || myInformation?.tin || "",
      agencyEmployeeNumber:
        state.governmentIds.agencyEmployeeNumber ||
        myInformation?.employee_id ||
        "",
    },
    residentialAddress: {
      ...state.residentialAddress,
      street: state.residentialAddress.street || myInformation?.home_address || "",
      mobileNo:
        state.residentialAddress.mobileNo || myInformation?.mobile_number || "",
      emailAddress:
        state.residentialAddress.emailAddress || myInformation?.email || "",
    },
    permanentAddress: state.permanentAddress,
    familyBackground: {
      ...state.familyBackground,
      children: state.familyBackground.children.map((item) => ({
        name: item.name,
        dateOfBirth: item.dateOfBirth,
      })),
    },
    educationRows,
    civilServiceRows: state.civilServiceEligibility.map((item) => ({
      eligibility: item.eligibility,
      rating: item.rating,
      examDate: item.examDate,
      examPlace: item.examPlace,
      licenseNumber: item.licenseNumber,
      validity: item.validity,
    })),
    workExperienceRows: state.workExperience.map((item) => ({
      fromDate: item.fromDate,
      toDate: item.toDate,
      positionTitle: item.title,
      departmentAgencyOfficeCompany: item.subtitle,
      statusOfAppointment: item.extraOne,
      governmentService: item.extraTwo,
    })),
    voluntaryWorkRows: state.voluntaryWork.map((item) => ({
      organization: item.title,
      fromDate: item.fromDate,
      toDate: item.toDate,
      hours: item.extraOne,
      positionNatureOfWork: item.subtitle,
    })),
    trainingRows: state.training.map((item) => ({
      title: item.title,
      fromDate: item.fromDate,
      toDate: item.toDate,
      hours: item.extraOne,
      typeOfLd: item.extraTwo,
      conductedBy: item.subtitle,
    })),
    otherInformationRows: Array.from({ length: otherInformationRowCount }, (_, index) => ({
      skill: state.skills[index] || "",
      distinction: state.awards[index]?.title || "",
      membership: state.memberships[index]?.title || "",
    })),
    additionalInformation: {
      ...state.additionalInformation,
      relationThirdDegree: { ...state.additionalInformation.relationThirdDegree },
      relationFourthDegree: { ...state.additionalInformation.relationFourthDegree },
      adminOffense: { ...state.additionalInformation.adminOffense },
      criminalCharge: { ...state.additionalInformation.criminalCharge },
      convictedCrime: { ...state.additionalInformation.convictedCrime },
      separatedService: { ...state.additionalInformation.separatedService },
      candidateElection: { ...state.additionalInformation.candidateElection },
      resignedDuringCampaign: {
        ...state.additionalInformation.resignedDuringCampaign,
      },
      immigrantStatus: { ...state.additionalInformation.immigrantStatus },
      indigenousGroup: { ...state.additionalInformation.indigenousGroup },
      disability: { ...state.additionalInformation.disability },
      soloParent: { ...state.additionalInformation.soloParent },
    },
    references: state.references.map((item) => ({
      name: item.name,
      address: item.address,
      contact: item.contact,
    })),
    declaration: { ...state.declaration },
    photoUrl: myInformation?.photo_base64
      ? resolveImageSource(myInformation.photo_base64)
      : "",
  };

  return (
    <PDSPrintTemplate
      formData={formData}
      options={{
        paperSize,
        mode: printMode,
        includedSections,
      }}
    />
  );
};

const SectionShell = ({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: React.ReactNode;
}) => (
  <AccordionItem
    value={value}
    className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
  >
    <AccordionTrigger className="px-6 py-5 text-[1.05rem] font-semibold tracking-tight text-slate-900 hover:bg-white hover:text-slate-900">
      {title}
    </AccordionTrigger>
    <AccordionContent className="px-6 pb-6">{children}</AccordionContent>
  </AccordionItem>
);

const SectionIntro = ({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) => (
  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
    <Button type="button" onClick={onAction}>
      <i className="fas fa-plus text-xs"></i>
      {actionLabel}
    </Button>
  </div>
);

const SectionBlockTitle = ({ title }: { title: string }) => (
  <div className="border-b border-slate-200 pb-3">
    <h3 className="text-lg font-semibold uppercase tracking-[0.16em] text-slate-900">
      {title}
    </h3>
  </div>
);

const SelectField = ({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder?: string;
}) => (
  <label>
    <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
    <Select value={value || undefined} onValueChange={onChange}>
      <SelectTrigger className="h-12 rounded-xl bg-white">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </label>
);

const AddressEditorCard = ({
  title,
  address,
  onChange,
  includeContact = false,
}: {
  title: string;
  address: ResidentialAddressState;
  onChange: (key: keyof ResidentialAddressState, value: string) => void;
  includeContact?: boolean;
}) => (
  <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
    <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
    <div className="grid gap-4 md:grid-cols-2">
      <EditableField
        label="House/Block/Lot No."
        value={address.houseBlockLotNo}
        onChange={(value) => onChange("houseBlockLotNo", value)}
      />
      <EditableField
        label="Street"
        value={address.street}
        onChange={(value) => onChange("street", value)}
      />
      <EditableField
        label="Subdivision/Village"
        value={address.subdivisionVillage}
        onChange={(value) => onChange("subdivisionVillage", value)}
      />
      <EditableField
        label="Barangay"
        value={address.barangay}
        onChange={(value) => onChange("barangay", value)}
      />
      <EditableField
        label="City/Municipality"
        value={address.cityMunicipality}
        onChange={(value) => onChange("cityMunicipality", value)}
      />
      <EditableField
        label="Province"
        value={address.province}
        onChange={(value) => onChange("province", value)}
      />
      <EditableField
        label="ZIP Code"
        value={address.zipCode}
        onChange={(value) => onChange("zipCode", value)}
      />
      {includeContact && (
        <>
          <EditableField
            label="Telephone No."
            value={address.telephoneNo}
            onChange={(value) => onChange("telephoneNo", value)}
          />
          <EditableField
            label="Mobile No."
            value={address.mobileNo}
            onChange={(value) => onChange("mobileNo", value)}
          />
          <EditableField
            label="E-mail Address"
            value={address.emailAddress}
            onChange={(value) => onChange("emailAddress", value)}
          />
        </>
      )}
    </div>
  </div>
);

const ChildrenEditor = ({
  items,
  onAdd,
  onChange,
  onDelete,
}: {
  items: ChildEntry[];
  onAdd: () => void;
  onChange: (
    id: string,
    field: keyof Omit<ChildEntry, "id">,
    value: string,
  ) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="space-y-4 rounded-2xl border border-slate-200 p-4">
    <div className="flex items-center justify-between gap-3">
      <h4 className="text-lg font-semibold text-slate-900">
        23. Name of Children
      </h4>
      <Button type="button" size="sm" onClick={onAdd}>
        <i className="fas fa-plus text-xs"></i>
        Add Child
      </Button>
    </div>
    <div className="space-y-4">
      {items.length === 0 && <EmptyMessage message="No children added yet." />}
      {items.map((item, index) => (
        <div key={item.id} className="rounded-xl border border-slate-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-semibold text-slate-900">Child {index + 1}</p>
            <IconActions onDelete={() => onDelete(item.id)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <EditableField
              label="Full Name"
              value={item.name}
              onChange={(value) => onChange(item.id, "name", value)}
            />
            <EditableField
              label="Date of Birth"
              type="date"
              value={item.dateOfBirth}
              onChange={(value) => onChange(item.id, "dateOfBirth", value)}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const YesNoSelector = ({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (value: "" | "Yes" | "No") => void;
}) => (
  <div className="flex flex-wrap gap-4">
    {(["Yes", "No"] as const).map((option) => (
      <label key={option} className="flex items-center gap-2 text-sm text-slate-900">
        <input
          type="radio"
          name={name}
          value={option}
          checked={value === option}
          onChange={() => onChange(option)}
          className="h-4 w-4 accent-blue-600"
        />
        {option}
      </label>
    ))}
  </div>
);

const YesNoQuestionCard = ({
  name,
  title,
  value,
  onAnswerChange,
  onDetailsChange,
  detailLabel = "If YES, give details",
  children,
}: {
  name: string;
  title: string;
  value: {
    answer: "" | "Yes" | "No";
    details: string;
  };
  onAnswerChange: (value: "" | "Yes" | "No") => void;
  onDetailsChange: (value: string) => void;
  detailLabel?: string;
  children?: React.ReactNode;
}) => (
  <div className="rounded-2xl border border-slate-200 p-4">
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(260px,1fr)]">
      <div>
        <p className="text-sm font-medium leading-6 text-slate-900">{title}</p>
      </div>
      <div className="space-y-4">
        <YesNoSelector
          name={name}
          value={value.answer}
          onChange={onAnswerChange}
        />
        <EditableField
          label={detailLabel}
          value={value.details}
          onChange={onDetailsChange}
        />
        {children}
      </div>
    </div>
  </div>
);

const EditableField = ({
  label,
  value,
  onChange,
  required = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
}) => (
  <label>
    <span className="mb-2 block text-sm font-medium text-slate-800">
      {label} {required && <span className="text-red-500">*</span>}
    </span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      type={type}
      className="input-field h-12 rounded-xl bg-white"
    />
  </label>
);

const RadioGroup = ({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string;
  onChange: (value: string) => void;
}) => (
  <div>
    <span className="mb-2 block text-sm font-medium text-slate-800">{label}</span>
    <div className="flex gap-5 pt-3">
      {options.map((option) => (
        <label key={option} className="flex items-center gap-2 text-base text-slate-900">
          <input
            checked={selected === option}
            className="sr-only"
            name={label}
            onChange={() => onChange(option)}
            type="radio"
            value={option}
          />
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-full border ${
              selected === option ? "border-blue-600" : "border-blue-400"
            }`}
          >
            {selected === option && <span className="h-3 w-3 rounded-full bg-blue-600"></span>}
          </span>
          {option}
        </label>
      ))}
    </div>
  </div>
);

const EmptyMessage = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
    {message}
  </div>
);

const IconActions = ({ onDelete }: { onDelete: () => void }) => (
  <div className="flex items-center gap-2">
    <button
      type="button"
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600"
    >
      <i className="fas fa-pen text-xs"></i>
    </button>
    <button
      type="button"
      onClick={onDelete}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-600"
    >
      <i className="fas fa-trash text-xs"></i>
    </button>
  </div>
);

export default PDSWorkspace;


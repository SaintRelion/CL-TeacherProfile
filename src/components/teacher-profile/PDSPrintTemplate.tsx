import type { PDSPrintQuestion, PDSPrintTemplateData } from "@/pds-schema";
import { PDSPage1 } from "./pds-templates/PDSPage1";
import PDSPage2 from "./pds-templates/PDSPage2";
import { PDSPage3 } from "./pds-templates/PDSPage3";
import { PDSPage4 } from "./pds-templates/PDSPage4";

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

const PAGE_WIDTH = "8.5in";
const PAGE_HEIGHT = "12in";

export interface PDSPrintTemplateOptions {
  mode: PDSPrintMode;
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
    vocational: {},
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

const emptyQuestion = (): PDSPrintQuestion => ({ answer: "", details: "" });

export const PDSPrintTemplate = ({
  formData,
  options,
}: {
  formData: PDSPrintTemplateData;
  options: PDSPrintTemplateOptions;
}) => {
  const show = () => true;
  const data = options.mode === "blank" ? createEmptyFormData() : formData;

  return (
    <div
      id="pds-printable-root"
      className="only-print bg-white font-sans text-black"
      style={{ width: PAGE_WIDTH, minWidth: PAGE_WIDTH }}
    >
      {[
        <PDSPage1 data={data} show={show} />,
        <PDSPage2 data={data} show={show} />,
        <PDSPage3 data={data} show={show} />,
        <PDSPage4 data={data} show={show} />,
      ].map((page, i) => (
        <div
          key={i}
          className={i === 0 ? "" : "print-page"}
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            overflow: "hidden",
            boxSizing: "border-box",
            border: "2px solid black",
            borderTop: i === 0 ? "2px solid black" : "none",
            background: "white",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {page}
        </div>
      ))}
    </div>
  );
};

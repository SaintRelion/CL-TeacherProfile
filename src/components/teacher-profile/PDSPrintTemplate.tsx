import type { PDSPrintQuestion, PDSPrintTemplateData } from "@/pds-schema";
import type { CSSProperties } from "react";
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
  const show = (id: string) =>
    options.includedSections.includes(id as PDSPrintSectionId);

  // Use blank data if mode is blank, otherwise use the transformed formData
  const data = options.mode === "blank" ? createEmptyFormData() : formData;

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
        <PDSPage1 data={formData} show={show} />
        <PDSPage2 data={data} show={show} />
        <PDSPage3 data={data} show={show} />
        <PDSPage4 data={data} show={show} />
      </div>
    </div>
  );
};

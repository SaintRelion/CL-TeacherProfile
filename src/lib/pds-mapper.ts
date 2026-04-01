/* pds-mapper.ts */

import type {
  PDSDataNode,
  PDSDataValue,
  PDSPrintAddress,
  PDSPrintTemplateData,
} from "@/pds-schema";

const toNode = (val: PDSDataValue): PDSDataNode =>
  (val && typeof val === "object" && !Array.isArray(val)
    ? val
    : {}) as PDSDataNode;

const toList = <T = PDSDataNode>(val: PDSDataValue): T[] =>
  (Array.isArray(val) ? val : []) as T[];

export const transformDbToPrintData = (
  db: PDSDataNode,
): PDSPrintTemplateData => {
  const p = toNode(db.personalInfo);
  const fam = toNode(db.familyBackground);
  const addr = toNode(p.addressGroup);
  const addInfo = toNode(db.additionalInformation);

  // Section I & II Mappings
  const residential = toNode(addr.residentialAddress);
  const permanent = toNode(addr.permanentAddress);
  const spouse = toNode(fam.spouseInfo);
  const parents = toNode(fam.parentsGroup);

  // Section VIII Zipping Logic
  const otherInfo = toNode(db.otherInformation);
  const skillList = toList(otherInfo.skills);
  const awardList = toList(otherInfo.awards);
  const memberList = toList(otherInfo.memberships);

  const maxOtherRows = Math.max(
    skillList.length,
    awardList.length,
    memberList.length,
  );
  const zippedOtherRows = Array.from({ length: maxOtherRows }).map((_, i) => ({
    skill: (skillList[i]?.skill as string) || "",
    distinction: (awardList[i]?.title as string) || "",
    membership: (memberList[i]?.title as string) || "",
  }));

  return {
    // --- SECTION I ---
    personalInfo: {
      nameGroup: toNode(
        p.nameGroup,
      ) as unknown as PDSPrintTemplateData["personalInfo"]["nameGroup"],
      birthAndStatus: toNode(
        p.birthAndStatus,
      ) as unknown as PDSPrintTemplateData["personalInfo"]["birthAndStatus"],
      citizenshipGroup: toNode(
        p.citizenshipGroup,
      ) as unknown as PDSPrintTemplateData["personalInfo"]["citizenshipGroup"],
      physicalAttributes: toNode(
        p.physicalAttributes,
      ) as unknown as PDSPrintTemplateData["personalInfo"]["physicalAttributes"],
      governmentIds: toNode(
        p.governmentIds,
      ) as unknown as PDSPrintTemplateData["personalInfo"]["governmentIds"],
      addressGroup: {
        residentialAddress: residential as PDSPrintAddress,
        permanentAddress: permanent as PDSPrintAddress,
      },
    },

    // --- SECTION II ---
    familyBackground: {
      spouseInfo: toNode(
        spouse,
      ) as unknown as PDSPrintTemplateData["familyBackground"]["spouseInfo"],
      children: toList(fam.children),
      parentsGroup: {
        fatherInfo: toNode(
          parents.fatherInfo,
        ) as unknown as PDSPrintTemplateData["familyBackground"]["parentsGroup"]["fatherInfo"],
        motherInfo: toNode(
          parents.motherInfo,
        ) as unknown as PDSPrintTemplateData["familyBackground"]["parentsGroup"]["motherInfo"],
      },
    },

    // --- SECTION III ---
    educationalBackground: toNode(
      db.educationalBackground,
    ) as unknown as PDSPrintTemplateData["educationalBackground"],

    // --- SECTION IV (MISSING BEFORE) ---
    civilServiceEligibility: {
      eligibilityEntries: toList(
        toNode(db.civilServiceEligibility).eligibilityEntries,
      ),
    },

    // --- SECTION V (MISSING BEFORE) ---
    workExperience: {
      workEntries: toList(toNode(db.workExperience).workEntries),
    },

    // --- SECTION VI (MISSING BEFORE) ---
    voluntaryWork: {
      voluntaryWorkEntries: toList(
        toNode(db.voluntaryWork).voluntaryWorkEntries,
      ),
    },

    // --- SECTION VII (MISSING BEFORE) ---
    training: {
      trainingEntries: toList(toNode(db.training).trainingEntries),
    },

    // --- SECTION VIII (MISSING BEFORE) ---
    otherInformation: {
      skills: skillList,
      awards: awardList,
      memberships: memberList,
    },

    // --- SECTION IX ---
    additionalInformation: {
      legalQuestions: toNode(
        addInfo.legalQuestions,
      ) as unknown as PDSPrintTemplateData["additionalInformation"]["legalQuestions"],

      specialLegalStatus: toNode(
        addInfo.specialLegalStatus,
      ) as unknown as PDSPrintTemplateData["additionalInformation"]["specialLegalStatus"],

      references: toList(addInfo.references),

      declaration: toNode(
        addInfo.declaration,
      ) as unknown as PDSPrintTemplateData["additionalInformation"]["declaration"],
    },

    // --- TEMPLATE ROW BRIDGES ---
    educationRows: db.educationalBackground
      ? [
          {
            level: "Elementary",
            ...toNode(toNode(db.educationalBackground).elementary),
          },
          {
            level: "Secondary",
            ...toNode(toNode(db.educationalBackground).secondary),
          },
          {
            level: "College",
            ...toNode(toNode(db.educationalBackground).college),
          },
          {
            level: "Graduate Studies",
            ...toNode(toNode(db.educationalBackground).graduateStudies),
          },
        ]
      : [],

    civilServiceRows: toList(
      toNode(db.civilServiceEligibility).eligibilityEntries,
    ),

    workExperienceRows: toList(toNode(db.workExperience).workEntries).map(
      (w) => ({
        fromDate: w.fromDate as string,
        toDate: w.toDate as string,
        positionTitle: w.title as string,
        departmentAgencyOfficeCompany: w.subtitle as string,
        statusOfAppointment: w.extraOne as string,
        governmentService: w.extraTwo as string,
      }),
    ),

    voluntaryWorkRows: toList(
      toNode(db.voluntaryWork).voluntaryWorkEntries,
    ).map((v) => ({
      organization: v.title as string,
      fromDate: v.fromDate as string,
      toDate: v.toDate as string,
      hours: String(v.extraOne || ""),
      positionNatureOfWork: v.subtitle as string,
    })),

    trainingRows: toList(toNode(db.training).trainingEntries).map((t) => ({
      title: t.title as string,
      fromDate: t.fromDate as string,
      toDate: t.toDate as string,
      hours: String(t.extraOne || ""),
      typeOfLd: t.extraTwo as string,
      conductedBy: t.subtitle as string,
    })),

    otherInformationRows: zippedOtherRows,
    references: toList(addInfo.references),
    declaration: toNode(
      addInfo.declaration,
    ) as unknown as PDSPrintTemplateData["declaration"],
    photoUrl: (p.photo_base64 as string) || "",
  };
};

import { padRows, type PDSPrintQuestion } from "@/pds-schema";
import {
  sideLabelBg,
  labelBg,
  borderClass,
  type PDSPageProps,
} from "./Reusable";

export const PDSPage4 = ({ data, show }: PDSPageProps) => {
  const toValue = (value?: string | number | null | boolean): string => {
    if (value === undefined || value === null) return "";
    return String(value);
  };

  const referenceRows = padRows(data.additionalInformation?.references, 3);

  const QuestionRow = ({
    number,
    question,
    value,
    extra,
  }: {
    number: string;
    question: string;
    value?: PDSPrintQuestion;
    extra?: string[];
  }) => (
    <div
      className="grid grid-cols-12 border-b border-black bg-white"
      style={{ minHeight: "70pt" }}
    >
      <div className={`col-span-7 flex self-stretch border-r border-black p-1`}>
        <div className="w-8 flex-shrink-0 text-[7pt] font-normal">{number}</div>
        <div className="text-[7pt] font-normal">{question}</div>
      </div>
      <div className="col-span-5 flex flex-col p-1 text-[7pt] font-normal">
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={value?.answer === "Yes"} readOnly />{" "}
            Yes
          </label>
          <label className="flex items-center gap-1">
            <input type="checkbox" checked={value?.answer === "No"} readOnly />{" "}
            No
          </label>
        </div>
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex gap-1">
            If YES, give details:
            <span className="flex-grow border-b border-black px-1 text-[7pt] uppercase">
              {toValue(value?.details)}
            </span>
          </div>
          {extra?.map((ext, idx) => (
            <div key={idx} className="flex gap-1">
              <span className="flex-grow border-b border-black px-1 pb-[5pt] text-[7pt] uppercase">
                {ext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="relative flex flex-col font-sans text-black"
      style={{ height: "100%", minHeight: 0, width: "100%", padding: "6px" }}
    >
      {/* --- SECTION IX. QUESTIONS & DECLARATION --- */}
      {show("additionalInformation") && (
        <div
          className="flex flex-grow flex-col border-t border-l border-black"
          style={{ minHeight: 0 }}
        >
          <div className="border-t border-black">
            <QuestionRow
              number="34.a"
              question="Are you related by consanguinity or affinity to the appointing authority within the third degree?"
              value={
                data.additionalInformation?.legalQuestions?.relationThirdDegree
              }
            />
            <QuestionRow
              number="35.a"
              question="Have you ever been found guilty of any administrative offense?"
              value={data.additionalInformation?.legalQuestions?.adminOffense}
            />
            <QuestionRow
              number="35.b"
              question="Have you been criminally charged before any court?"
              value={data.additionalInformation?.legalQuestions?.criminalCharge}
              extra={[
                `Date Filed: ${toValue(data?.additionalInformation?.legalQuestions?.criminalCharge?.dateFiled)}`,
                `Status: ${toValue(data?.additionalInformation?.legalQuestions?.criminalCharge?.statusOfCase)}`,
              ]}
            />
            <QuestionRow
              number="40.a"
              question="Are you a member of any indigenous group?"
              value={
                data.additionalInformation?.specialLegalStatus?.indigenousGroup
              }
            />
            <QuestionRow
              number="40.b"
              question="Are you a person with disability?"
              value={data.additionalInformation?.specialLegalStatus?.disability}
              extra={[
                `ID No.: ${toValue(data?.additionalInformation?.specialLegalStatus?.disability?.idNumber)}`,
              ]}
            />
          </div>

          {/* REFERENCES TABLE */}
          <div className="mt-0 border-b border-black">
            <div
              className={`${sideLabelBg} border-b border-black px-2 pb-[5pt] text-[7pt] font-normal uppercase`}
            >
              41. REFERENCES{" "}
              <span className="normal-case italic">
                (Person not related by consanguinity or affinity to
                applicant/appointee)
              </span>
            </div>
            <table className="w-full table-fixed border-collapse">
              <thead>
                <tr
                  className={`${labelBg} text-center text-[7pt] font-normal uppercase`}
                >
                  <th
                    className={`${borderClass} w-[40%] px-1 pb-[4pt] font-normal`}
                  >
                    NAME
                  </th>
                  <th
                    className={`${borderClass} w-[40%] px-1 pb-[4pt] font-normal`}
                  >
                    OFFICE / RESIDENTIAL ADDRESS
                  </th>
                  <th
                    className={`${borderClass} w-[20%] !border-r-0 px-1 pb-[4pt] font-normal`}
                  >
                    CONTACT NO.
                  </th>
                </tr>
              </thead>
              <tbody>
                {referenceRows.map((row, index) => (
                  <tr key={index} className="bg-white text-[7pt] font-normal">
                    <td
                      className={`${borderClass} px-1 pb-[10pt] uppercase`}
                      style={{ paddingTop: "1.2rem" }}
                    >
                      {toValue(row.name)}
                    </td>
                    <td
                      className={`${borderClass} px-1 pb-[10pt] uppercase`}
                      style={{ paddingTop: "1.2rem" }}
                    >
                      {toValue(row.address)}
                    </td>
                    <td
                      className={`${borderClass} !border-r-0 px-1 pb-[10pt] text-center uppercase`}
                      style={{ paddingTop: "1.2rem" }}
                    >
                      {toValue(row.contact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- DECLARATION / OATH & FOOTER SECTION --- */}
          <div className="flex flex-col">
            {/* Oath & Photo Row */}
            <div className="flex border-b border-black bg-white">
              <div className="flex-grow p-4 text-justify text-[7pt] leading-tight font-normal">
                <span className="font-normal">42.</span> I declare under oath
                that I have personally accomplished this Personal Data Sheet
                which is a true, correct, and complete statement pursuant to the
                provisions of pertinent laws, rules, and regulations of the
                Republic of the Philippines. I authorize the agency
                head/authorized representative to verify/validate the contents
                stated herein. I agree that any misrepresentation made in this
                document and its attachments shall cause the filing of
                administrative/criminal case/s against me.
              </div>
              <div className="flex w-[160px] flex-shrink-0 items-center justify-center border-l border-black p-2">
                <div className="flex h-[4.5cm] w-[3.5cm] flex-col items-center justify-center border border-black bg-white p-2 text-center text-[7pt] font-normal text-gray-500">
                  ID picture
                  <br />
                  (Passport size)
                  <br />
                  <br />
                  Computer generated
                  <br />
                  or photocopied picture
                  <br />
                  is not acceptable
                </div>
              </div>
            </div>

            {/* Govt ID, Signature, and Thumbmark Row */}
            <div className="flex border-b border-black bg-white">
              {/* Govt ID Box */}
              <div className="flex w-[40%] flex-col border border-black">
                <div
                  className={`${labelBg} border-b border-black px-1 pb-[8pt] text-[7pt] leading-tight font-normal`}
                >
                  Government Issued ID (i.e.Passport, GSIS, SSS, PRC, Driver's
                  License, etc.)
                  <br />
                  PLEASE INDICATE ID Number and Date of Issuance
                </div>
                <div className="flex flex-col gap-3 p-2">
                  <div className="flex py-1 text-[7pt] font-normal">
                    Government Issued ID:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[7pt] uppercase">
                      {toValue(data.declaration?.governmentIdType)}
                    </span>
                  </div>
                  <div className="flex py-1 text-[7pt] font-normal">
                    ID/License/Passport No.:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[7pt] uppercase">
                      {toValue(data.declaration?.governmentIdNumber)}
                    </span>
                  </div>
                  <div className="flex py-1 text-[7pt] font-normal">
                    Date/Place of Issuance:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[7pt] uppercase">
                      {toValue(data.declaration?.dateAccomplished)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature & Date Box */}
              <div className="flex w-[40%] flex-col border border-black">
                {/* Red hint text area */}
                <div className="flex-grow p-8 text-center text-[7pt] font-normal text-red-600 italic"></div>
                {/* Signature label */}
                <div className="border-t border-b border-black bg-[#f2f2f2] py-[3pt] text-center text-[7pt] font-normal">
                  Signature (Sign inside the box)
                </div>
                <div className="p-3 text-center text-[7pt] font-normal text-red-600 italic"></div>
                {/* Date Accomplished */}
                <div className="border-t border-black bg-[#f2f2f2] py-[3pt] text-center text-[7pt] font-normal">
                  {toValue(data.declaration?.dateAccomplished) ||
                    "Date Accomplished"}
                </div>
              </div>

              {/* Thumbmark Box */}
              <div className="flex w-[20%] flex-col items-center justify-center p-2">
                <div className="h-[80px] w-[60px] border border-black bg-white"></div>
                <div className="mt-1 text-center text-[7pt] font-normal">
                  Right Thumbmark
                </div>
              </div>
            </div>

            {/* Sworn Statement Row */}
            <div className="mt-3 flex flex-col bg-white p-2">
              <div className="text-center text-[8pt] leading-loose font-normal">
                SUBSCRIBED AND SWORN to before me this{" "}
                <span className="inline-block w-40 border-b border-black"></span>
                , affiant exhibiting his/her validly issued government ID as
                indicated above.
              </div>
              <div className="mt-10 flex w-[300px] flex-col self-center">
                <div className="border border-black pb-[70pt] text-center text-[9pt] font-normal text-red-600 italic">
                  {/* (wet signature/e-signature/digital certificate except for
                  notary public) */}
                </div>
                <div
                  className={`border border-t-0 border-black bg-[#f2f2f2] py-[3pt] text-center text-[7pt] font-normal`}
                >
                  Person Administering Oath
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4 IDENTIFIER */}
      <div className="mt-auto pt-1 text-right text-[6pt] font-normal text-black italic">
        CS FORM 212 (Revised 2025), Page 4 of 4
      </div>
    </div>
  );
};

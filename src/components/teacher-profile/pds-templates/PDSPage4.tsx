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

  // PDS Page 4 typically expects exactly 3 rows for Character References
  const referenceRows = padRows(data.additionalInformation?.references, 3);

  // Helper for rendering the complex Question rows
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
    <div className="grid grid-cols-12 border-b border-black bg-white">
      <div className={`col-span-7 flex border-r border-black p-1`}>
        <div className="w-8 flex-shrink-0 text-[12px] font-normal">
          {number}
        </div>
        <div className="text-[12px] font-normal">{question}</div>
      </div>
      <div className="col-span-5 flex flex-col p-1 text-[12px] font-normal">
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
            <span className="flex-grow border-b border-black px-1 text-[12px] uppercase">
              {toValue(value?.details)}
            </span>
          </div>
          {extra?.map((ext, idx) => (
            <div key={idx} className="flex gap-1">
              <span className="flex-grow border-b border-black px-1 text-[12px] uppercase">
                {ext}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col font-sans text-black">
      {/* --- SECTION IX. QUESTIONS & DECLARATION --- */}
      {show("additionalInformation") && (
        <div className="flex flex-grow flex-col border-t border-l border-black">
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
              className={`${sideLabelBg} border-b border-black px-2 py-0.5 text-[12px] font-normal uppercase`}
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
                  className={`${labelBg} text-center text-[12px] font-normal uppercase`}
                >
                  <th className={`${borderClass} w-[40%] p-1 font-normal`}>
                    NAME
                  </th>
                  <th className={`${borderClass} w-[40%] p-1 font-normal`}>
                    OFFICE / RESIDENTIAL ADDRESS
                  </th>
                  <th
                    className={`${borderClass} w-[20%] !border-r-0 p-1 font-normal`}
                  >
                    CONTACT NO.
                  </th>
                </tr>
              </thead>
              <tbody>
                {referenceRows.map((row, index) => (
                  <tr key={index} className="bg-white text-[12px] font-normal">
                    <td className={`${borderClass} p-3 uppercase`}>
                      {toValue(row.name)}
                    </td>
                    <td className={`${borderClass} p-3 uppercase`}>
                      {toValue(row.address)}
                    </td>
                    <td
                      className={`${borderClass} !border-r-0 p-3 text-center uppercase`}
                    >
                      {toValue(row.contact)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* --- DECLARATION / OATH & FOOTER SECTION --- */}
          <div className="mt-auto flex flex-col">
            {/* Oath & Photo Row */}
            <div className="flex border-b border-black bg-white">
              <div className="flex-grow p-4 text-justify text-[12px] leading-tight font-normal">
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
                <div className="flex h-[4.5cm] w-[3.5cm] flex-col items-center justify-center border border-black bg-white p-2 text-center text-[12px] font-normal text-gray-500">
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
              <div className="flex w-[40%] flex-col border-r border-black">
                <div
                  className={`${labelBg} border-b border-black p-1 text-[12px] leading-tight font-normal`}
                >
                  Government Issued ID (i.e.Passport, GSIS, SSS, PRC, Driver's
                  License, etc.)
                  <br />
                  PLEASE INDICATE ID Number and Date of Issuance
                </div>
                <div className="flex flex-col gap-1 p-2">
                  <div className="flex text-[12px] font-normal">
                    Government Issued ID:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[12px] uppercase">
                      {toValue(data.declaration?.governmentIdType)}
                    </span>
                  </div>
                  <div className="flex text-[12px] font-normal">
                    ID/License/Passport No.:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[12px] uppercase">
                      {toValue(data.declaration?.governmentIdNumber)}
                    </span>
                  </div>
                  <div className="flex text-[12px] font-normal">
                    Date/Place of Issuance:
                    <span className="ml-2 flex-grow border-b border-black px-1 text-[12px] uppercase">
                      {toValue(data.declaration?.dateAccomplished)}{" "}
                      {/* Fallback to accomplished date or add new field */}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature & Date Box */}
              <div className="flex w-[40%] flex-col border-r border-black p-2">
                <div className="mt-4 flex flex-grow flex-col justify-end">
                  <div className="border-b border-black text-center text-[12px] uppercase"></div>
                  <div className="mt-1 text-center text-[12px] font-normal">
                    Signature (Sign inside the box)
                  </div>
                </div>
                <div className="mt-4 flex flex-col">
                  <div className="border-b border-black text-center text-[12px] uppercase">
                    {toValue(data.declaration?.dateAccomplished)}
                  </div>
                  <div className="mt-1 text-center text-[12px] font-normal">
                    Date Accomplished
                  </div>
                </div>
              </div>

              {/* Thumbmark Box */}
              <div className="flex w-[20%] flex-col items-center justify-center p-2">
                <div className="h-[80px] w-[60px] border border-black bg-white"></div>
                <div className="mt-1 text-center text-[12px] font-normal">
                  Right Thumbmark
                </div>
              </div>
            </div>

            {/* Sworn Statement Row */}
            <div className="flex flex-col bg-white p-2">
              <div className="text-center text-[12px] leading-loose font-normal">
                SUBSCRIBED AND SWORN to before me this{" "}
                <span className="inline-block w-40 border-b border-black"></span>
                , affiant exhibiting his/her validly issued government ID as
                indicated above.
              </div>
              <div className="mt-6 flex w-[300px] flex-col items-center self-center">
                <div className="w-full border-b border-black"></div>
                <div className="mt-1 text-center text-[12px] font-normal">
                  Person Administering Oath
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE 4 IDENTIFIER */}
      <div className="absolute right-0 -bottom-4 text-[12px] font-normal text-black italic">
        CS FORM 212 (Revised 2025), Page 4 of 4
      </div>
    </div>
  );
};

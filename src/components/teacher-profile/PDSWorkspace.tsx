import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { PDS_CONFIG, type PDSDataNode } from "@/pds-schema";
import { RenderSection } from "./PDSRenderers";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import type { UpdateUser, User } from "@/models/user";
import { toast } from "@saintrelion/notifications";
import { useState } from "react";
import { PDSPrintable } from "./PDSPrintable";

export interface PDSFormData {
  personalInfo: PDSDataNode;
  familyBackground: PDSDataNode & {
    children: PDSDataNode[];
  };
  educationalBackground: PDSDataNode;
  civilServiceEligibility: {
    eligibilityEntries: PDSDataNode[];
  };
  workExperience: {
    workEntries: PDSDataNode[];
  };
  voluntaryWork: {
    voluntaryWorkEntries: PDSDataNode[];
  };
  training: {
    trainingEntries: PDSDataNode[];
  };
  otherInformation: PDSDataNode;
  additionalInformation: PDSDataNode;
  [key: string]: PDSDataNode | PDSDataNode[] | undefined;
}

const blankPDS: PDSFormData = {
  personalInfo: {},
  familyBackground: { children: [] },
  civilServiceEligibility: { eligibilityEntries: [] },
  workExperience: { workEntries: [] },
  voluntaryWork: { voluntaryWorkEntries: [] },
  training: { trainingEntries: [] },
  educationalBackground: {},
  otherInformation: { awards: [], skills: [], memberships: [] },
  additionalInformation: { references: [] },
};

export const PDSWorkspace = ({ user }: { user: User }) => {
  const [printOpen, setPrintOpen] = useState(false);

  const { useUpdate: updateUser } = useResourceLocked<never, never, UpdateUser>(
    "user",
    { showToast: false },
  );

  const methods = useForm<PDSFormData>({
    defaultValues: user.pds || blankPDS,
    mode: "onChange",
  });

  const onPDSSubmit: SubmitHandler<PDSFormData> = async (data) => {
    try {
      console.log(data);
      await updateUser.run({
        id: user.id,
        payload: { pds: data },
      });
      toast.success("PDS Updated");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong updating profile");
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="relative space-y-6 print:space-y-4">
        {/* Main Form Content */}
        <Accordion
          type="multiple"
          defaultValue={["personalInfo"]}
          className="space-y-4 print:space-y-3"
        >
          {PDS_CONFIG.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <AccordionTrigger className="px-6 py-5 text-[1.05rem] font-semibold tracking-tight text-slate-900 no-underline hover:bg-white hover:text-slate-900">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-2 pb-6">
                <RenderSection config={section} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* FLOATING ACTION DOCK */}
        <div className="fixed right-8 bottom-8 z-50 flex flex-col items-end gap-5 print:hidden">
          {/* 1. PRINT ACTION */}
          <div className="group relative flex items-center justify-end">
            {/* Label (Optional Click) */}
            <div className="pointer-events-none absolute right-full mr-4 translate-x-4 scale-90 whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
              <div className="rounded-xl bg-slate-900 px-5 py-2 text-[10px] font-black tracking-widest text-white uppercase shadow-2xl ring-1 ring-white/10">
                Configure & Print PDS
              </div>
            </div>

            {/* PRIMARY CLICK TARGET: The Icon */}
            <button
              type="button"
              onClick={() => setPrintOpen(true)} // Clicking the icon opens the dialog
              className="flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-lg transition-all duration-300 hover:border-slate-900 hover:text-slate-900 hover:shadow-slate-200 active:scale-90"
            >
              <i className="fas fa-print text-lg"></i>
            </button>
          </div>

          {/* 2. SYNC ACTION */}
          <div className="group relative flex items-center justify-end">
            {/* Label (Optional Click) */}
            <div className="pointer-events-none absolute right-full mr-4 translate-x-4 scale-90 whitespace-nowrap opacity-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:scale-100 group-hover:opacity-100">
              <div className="rounded-xl bg-emerald-950 px-5 py-2 text-[11px] font-bold tracking-widest text-white uppercase shadow-2xl ring-1 ring-white/20 backdrop-blur-md">
                <span className="flex items-center gap-2">
                  <i className="fas fa-sync-alt animate-spin-slow"></i>
                  Ready to Sync?
                </span>
              </div>
            </div>

            {/* PRIMARY CLICK TARGET: The Icon */}
            <button
              type="button"
              onClick={methods.handleSubmit(onPDSSubmit)} // Clicking the icon saves the form
              className="animate-bounce-subtle relative flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-full border border-emerald-200 bg-white text-emerald-600 shadow-xl transition-all duration-300 group-hover:animate-none group-hover:border-emerald-500 group-hover:shadow-emerald-500/30 active:scale-90"
            >
              <div className="relative z-10 transition-transform duration-300 group-hover:rotate-12">
                <i className="fas fa-id-card-alt text-lg"></i>
              </div>

              {/* Pulse Effect stays as visual eye-candy */}
              <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10 [animation-duration:3s]" />
              <div className="absolute inset-0 scale-0 rounded-full bg-emerald-50/50 transition-transform duration-500 group-hover:scale-100" />
            </button>
          </div>

          <style>{`
    @keyframes bounce-subtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
    .animate-spin-slow { animation: spin 3s linear infinite; }
  `}</style>
        </div>

        <PDSPrintable
          isOpen={printOpen}
          onOpenChange={setPrintOpen}
          user={user}
        />
      </div>
    </FormProvider>
  );
};

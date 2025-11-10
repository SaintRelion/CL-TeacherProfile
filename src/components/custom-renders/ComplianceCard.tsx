import { teacherTheme } from "@/themes";
import { RenderCard } from "@saintrelion/ui";
import { BadgeCheck } from "lucide-react";

export const ComplianceCard = () => (
  <RenderCard
    wrapperStructuralTokens={["paddingMd", "roundedLg", "fullWidth"]}
    wrapperVisualTokens={["surfaceBg"]}
    headerStructuralTokens={["marginBottomAuto"]}
    headerVisualTokens={["primaryText"]}
    contentStructuralTokens={["gapSm"]}
    contentVisualTokens={["surfaceText"]}
  >
    <div className="flex items-center justify-between gap-5">
      <div className="flex items-center justify-between gap-2">
        <BadgeCheck className={`${teacherTheme.colors.successText} h-6 w-6`} />
        <div className="flex flex-col">
          <h3 className={`${teacherTheme.fontSize.headerFont}`}>
            Teaching Licenses
          </h3>
          <p className={`${teacherTheme.colors.successText}`}>
            All current and valid
          </p>
        </div>
      </div>
      <p className="text-xl font-bold text-green-500">100%</p>
    </div>
  </RenderCard>
);

import { teacherTheme } from "@/themes";
import { RenderCard } from "@saintrelion/ui";
import { BadgeCheck } from "lucide-react";

export const RecentActivityCard = () => (
  <RenderCard
    wrapperStructuralTokens={["paddingMd", "roundedLg", "fullWidth"]}
    wrapperVisualTokens={["surfaceBg"]}
    headerStructuralTokens={["marginBottomAuto"]}
    headerVisualTokens={["primaryText"]}
    contentStructuralTokens={["gapSm"]}
    contentVisualTokens={["surfaceText"]}
  >
    <div className="flex items-center justify-start gap-2">
      <BadgeCheck className={`${teacherTheme.colors.successText} h-6 w-6`} />
      <div className="flex flex-col">
        <h3 className={`${teacherTheme.fontSize.headerFont}`}>
          New teacher profile created
        </h3>
        <p className="text-xs">Dr. Elena Rodriguez - Mathematics Department</p>
      </div>
    </div>
  </RenderCard>
);

import { teacherTheme } from "@/themes";
import { RenderCard } from "@saintrelion/ui";

export const KpiCard = ({
  title,
  value,
  notice,
}: {
  title: string;
  value: string;
  notice: string;
}) => (
  <RenderCard
    wrapperStructuralTokens={[
      "comfortablePadding",
      "defaultRounded",
      "mediumShadow",
    ]}
    wrapperVisualTokens={["surfaceBg", "defaultBorder"]}
    headerStructuralTokens={["autoBottomMarging"]}
    headerVisualTokens={["secondaryText"]}
    contentStructuralTokens={["comfortableGap", "headerFont"]}
    contentVisualTokens={["primaryText"]}
  >
    <div className="flex flex-col items-center">
      <h2
        className={`${teacherTheme.colors.secondaryText} ${teacherTheme.fontSize.smallFont}`}
      >
        {title}
      </h2>
      <p className={`${teacherTheme.colors.secondaryText} text-4xl font-bold`}>
        {value}
      </p>
      <p
        className={`${teacherTheme.colors.successText} ${teacherTheme.fontSize.smallFont} `}
      >
        {notice}
      </p>
    </div>
  </RenderCard>
);

import { teacherTheme } from "@/themes";
import { RenderCard } from "@saintrelion/ui";

export const CertificationsCard = () => (
  <RenderCard>
    <div className="rounded-md border-1 p-5">
      <div className="flex gap-5">
        <p className={`${teacherTheme.fontSize.mediumFont}`}>
          Professional Teaching License
        </p>
        <p className={`${teacherTheme.colors.successText}`}>Valid</p>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p>License Number</p>
          <p>PRC-123456789</p>
        </div>
        <div className="flex flex-col">
          <p>Issue Date</p>
          <p>June 15, 2012</p>
        </div>
        <div className="flex flex-col">
          <p>Expiry Date</p>
          <p>June 15, 2027</p>
        </div>
      </div>
      <p
        className={`${teacherTheme.colors.accentText} rounded-sm bg-amber-200 p-3`}
      >
        Renewal required within 4 months
      </p>
    </div>
  </RenderCard>
);

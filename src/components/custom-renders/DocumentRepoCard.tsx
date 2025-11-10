import { teacherTheme } from "@/themes";
import { RenderCard } from "@saintrelion/ui";
import { Download, Eye, FileText } from "lucide-react";

export const DocumentRepoCard = () => (
  <RenderCard>
    <div className="flex items-center justify-between rounded-md border-1 p-5">
      <div className="flex items-center gap-3">
        <FileText className={`${teacherTheme.colors.accentText}`} />
        <div>
          <p>Birth Certificate</p>
          <p className={`${teacherTheme.fontSize.smallFont}`}>
            Uploaded: Sept 15, 2025
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Eye className={`${teacherTheme.colors.primaryText}`} />
        <Download className={`${teacherTheme.colors.primaryText}`} />
      </div>
    </div>
  </RenderCard>
);

import { RenderCard } from "@saintrelion/ui";
import { teacherTheme } from "@/themes";

export const TeacherCard = () => (
  <RenderCard>
    <div className="rounded-xl border-1 p-3">
      <img
        src="/teacher-photo.jpg"
        alt="Dr. Elena Rodriguez"
        className="h-30 w-30 rounded-full"
      />
      <div className="flex items-center ">
        <div>
          <h3 className={`${teacherTheme.fontSize.headerFont}`}>
            Dr. Elena Rodriguez
          </h3>
          <p
            className={`${teacherTheme.fontSize.bodyFont} text-sm text-gray-600`}
          >
            Mathematics Department
          </p>
        </div>
      </div>
      <div className="mt-2 text-sm">
        <div className="flex flex-col space-y-2 border-b-1 border-gray-300 py-2">
          <div className="flex justify-between">
            <p className="text-gray-600">Employee ID:</p>
            <p className="text-md">TCH-2021-001</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Years of Service:</p>
            <p className="text-md">8 years</p>
          </div>
        </div>
        <button
          className={`mt-2 rounded-sm px-3 py-1 ${teacherTheme.colors.primaryBg} text-white`}
        >
          View Profile
        </button>
      </div>
    </div>
  </RenderCard>
);

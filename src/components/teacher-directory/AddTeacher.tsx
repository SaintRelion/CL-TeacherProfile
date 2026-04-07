import { type CreateTeacherPerformance } from "@/models/TeacherPerformance";
import { useAuth } from "@saintrelion/auth-lib";
import { useResourceLocked } from "@saintrelion/data-access-layer";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

export default function AddTeacherForm() {
  const auth = useAuth();

  const { useInsert: insertTeacherPerformance } = useResourceLocked<
    never,
    CreateTeacherPerformance
  >("teacherperformance", { showToast: false });

  const handleAddTeacher = async (data: Record<string, string>) => {
    console.log("Teacher added:", data);

    const userId = await auth.register(
      { username: data.username, roles: ["teacher"] },
      "123456",
    );

    if (userId != null) {
      insertTeacherPerformance.run({ user: userId, rating: "5" });
    }
  };

  return (
    <RenderForm wrapperClassName="space-y-4">
      <RenderFormField
        field={{
          label: "Username *",
          type: "text",
          name: "username",
        }}
        labelClassName="mb-2 block text-sm font-medium text-gray-700"
        inputClassName="w-full rounded-lg border border-gray-300 px-4 py-2 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

      <RenderFormButton
        buttonLabel="Add Teacher"
        onSubmit={handleAddTeacher}
        isDisabled={auth.isLocked}
        buttonClassName="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-blue-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

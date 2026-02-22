import { type CreateTeacherPerformance } from "@/models/Performance";
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
      { username: data.username, roles: ["instructor"] },
      "123456",
    );

    if (userId != null)
      insertTeacherPerformance.run({ userId: userId, rating: "5" });
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
        inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
      />

      <RenderFormButton
        buttonLabel="Add Teacher"
        onSubmit={handleAddTeacher}
        isDisabled={auth.isLocked}
        buttonClassName="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-green-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

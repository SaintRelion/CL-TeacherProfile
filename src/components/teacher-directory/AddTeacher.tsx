import { type TeacherPerformance } from "@/models/Performance";
import { useRegisterUser } from "@saintrelion/auth-lib";
import { useDBOperationsLocked } from "@saintrelion/data-access-layer";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

export default function AddTeacherForm() {
  const registerUser = useRegisterUser();
  const { useInsert: teacherPerformanceInsert } =
    useDBOperationsLocked<TeacherPerformance>("TeacherPerformance");

  const handleAddTeacher = async (data: Record<string, string>) => {
    console.log("Teacher added:", data);

    const result = await registerUser.run({
      info: { username: data.username, role: "instructor" },
      password: "123456",
    });

    if (result != null)
      teacherPerformanceInsert.run({ userId: result.id, rating: "5" });
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
        isDisabled={registerUser.isLocked}
        buttonClassName="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-green-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

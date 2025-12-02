import { registerUser } from "@saintrelion/auth-lib";
import { useLockedAuth } from "@saintrelion/auth-lib/dist/FirebaseAuth";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";

export default function AddTeacherForm() {
  const { run: loginLocking, isLocked: isLoggingIn } =
    useLockedAuth(registerUser);

  const handleAddTeacher = (data: Record<string, string>) => {
    console.log("Teacher added:", data);

    loginLocking(data.email, "12345678", { role: "instructor" });

    alert(`Teacher added successfully!\nUsername: ${data.email}`);
  };

  return (
    <RenderForm wrapperClass="space-y-4" onSubmit={handleAddTeacher}>
      <RenderFormField
        field={{
          label: "Email *",
          type: "email",
          name: "email",
        }}
        labelClassName="mb-2 block text-sm font-medium text-gray-700"
        inputClassName="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
      />

      <RenderFormButton
        buttonLabel="Add Teacher"
        isDisabled={isLoggingIn}
        buttonClassName="w-full rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-md transition-colors hover:bg-green-700 hover:shadow-lg"
      />
    </RenderForm>
  );
}

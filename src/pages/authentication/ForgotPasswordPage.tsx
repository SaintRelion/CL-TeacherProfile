import {
  firebaseSendPasswordReset,
  useLockedAuth,
} from "@saintrelion/auth-lib/dist/FirebaseAuth";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";

export default function ForgotPasswordPage() {
  const { run: lockedPasswordReset, isLocked: isResetting } = useLockedAuth(
    firebaseSendPasswordReset,
  );

  const handleForgotPassword = async (data: Record<string, string>) => {
    if (!data["email"]) return toast.error("Please enter your email");

    lockedPasswordReset(data["email"]);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-gray-800 shadow-2xl md:flex-row">
        {/* Left Panel */}
        <div className="hidden flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center md:flex md:w-1/2">
          <i className="fas fa-chalkboard-teacher mb-5 text-6xl text-white"></i>
          <h2 className="mb-2 text-2xl font-bold">Teacher Profiling System</h2>
          <p className="max-w-sm text-blue-100">
            Empowering educators through technology — securely manage, update,
            and track teacher profiles with ease.
          </p>
          <img
            src="https://img.freepik.com/free-vector/teacher-concept-illustration_114360-7501.jpg?t=st=1731221109~exp=1731224709~hmac=c3a5e20a7daec97f1a2cd9aa06d7e0b94958063f69df5ab2b4e1542b8da7aa23&w=826"
            alt="Teaching Illustration"
            className="mt-8 w-64 rounded-xl shadow-lg"
          />
        </div>

        {/* Right Panel */}
        <div className="flex w-full flex-col justify-center space-y-6 bg-gray-900 p-10 md:w-1/2">
          <div className="mb-4 text-center">
            <h1 className="mb-1 text-3xl font-bold text-white">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-400">
              Enter your email to reset your password
            </p>
          </div>

          <RenderForm
            wrapperClass="mx-auto w-full max-w-sm space-y-5 rounded-xl bg-gray-900 p-6 shadow-lg"
            onSubmit={handleForgotPassword}
          >
            {/* Email Field */}
            <RenderFormField
              field={{
                icon: true,
                label: "Email",
                type: "email",
                name: "email",
                placeholder: "user@gmail.com",
              }}
              labelClassName="mb-1 block text-sm font-medium text-gray-300"
              inputClassName="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              iconClassName="fas fa-envelope absolute top-3 left-3 text-gray-400"
            />

            <RenderFormButton
              isDisabled={isResetting}
              buttonLabel={isResetting ? "Sending..." : "Send Reset Email"}
              buttonClass="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            />

            <div className="text-center text-sm text-gray-400">
              <a href="/login" className="text-blue-400 hover:underline">
                Back to Login
              </a>
            </div>
          </RenderForm>
        </div>
      </div>
    </div>
  );
}

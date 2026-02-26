import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";

export default function ForgotPasswordPage() {
  // const { run: lockedPasswordReset, isLocked: isResetting } =
  //   useLockedAuth(updatePassword);

  const handleForgotPassword = async (data: Record<string, string>) => {
    if (!data["email"]) return toast.error("Please enter your email");

    // lockedPasswordReset(data["email"]);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 lg:flex">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md p-12 text-center">
          {/* Icon */}
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/10 shadow-2xl backdrop-blur-sm">
            <i className="fas fa-key text-5xl text-white"></i>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-white">
            Forgot Password?
          </h1>
          

          {/* Steps */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                1
              </div>
              <p className="text-white">Enter your registered email</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                2
              </div>
              <p className="text-white">Check your inbox for reset link</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                3
              </div>
              <p className="text-white">Create a new secure password</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="flex w-full flex-col justify-center bg-slate-50 px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Icon */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <i className="fas fa-key text-2xl text-white"></i>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              Reset Password
            </h2>
            <p className="mt-2 text-slate-600">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <RenderForm wrapperClassName="space-y-5">
            <div>
              <RenderFormField
                field={{
                  icon: true,
                  label: "Email Address",
                  type: "email",
                  name: "email",
                  placeholder: "Enter your email",
                }}
                labelClassName="mb-2 block text-sm font-medium text-slate-700"
                inputClassName="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none"
                iconClassName="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <RenderFormButton
              buttonLabel="Send Reset Link"
              onSubmit={handleForgotPassword}
              buttonClassName="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
            />
          </RenderForm>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Login
            </a>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500">
              Katipunan Central School & SPED Center
            </p>
            <p className="mt-1 text-xs text-slate-400">
              © 2024 Teacher Profile Management System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

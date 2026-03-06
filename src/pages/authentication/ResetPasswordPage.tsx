import { BASE_API } from "@/sr-config";
import { useNavigate } from "react-router-dom";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { toast } from "@saintrelion/notifications";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const navigate = useNavigate();

  const handleResetPassword = async (data: Record<string, string>) => {
    if (!data["password"]) return toast.error("Please enter a new password");

    try {
      setDone(true);
      const response = await fetch(`${BASE_API}api/accounts/reset-password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data["password"] }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Password reset successfully! You can now log in.");
        navigate("/login");
      } else {
        setDone(false);
        toast.error(result.detail || "Invalid or expired token.");
      }
    } catch (err) {
      const error = err as Record<string, string>;
      toast.error(`Network error. Try again. ${error}`);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="relative hidden w-1/2 items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 lg:flex">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl"></div>
          <div className="absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-md p-12 text-center">
          <div className="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/10 shadow-2xl backdrop-blur-sm">
            <i className="fas fa-lock text-5xl text-white"></i>
          </div>

          <h1 className="mb-4 text-4xl font-bold text-white">Reset Password</h1>
          <p className="mb-8 text-lg text-purple-100">
            Enter a new secure password to regain access to your account.
          </p>

          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                1
              </div>
              <p className="text-white">Click the reset link from your email</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                2
              </div>
              <p className="text-white">Enter your new password</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 font-bold text-white">
                3
              </div>
              <p className="text-white">Login with your updated password</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Form */}
      <div className="flex w-full flex-col justify-center bg-slate-50 px-6 py-12 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
              <i className="fas fa-lock text-2xl text-white"></i>
            </div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900">
              Reset Your Password
            </h2>
            <p className="mt-2 text-slate-600">
              Enter a new password to update your account credentials.
            </p>
          </div>

          <RenderForm wrapperClassName="space-y-5">
            <div>
              <RenderFormField
                field={{
                  icon: true,
                  label: "New Password",
                  type: "password",
                  name: "password",
                  placeholder: "Enter new password",
                }}
                labelClassName="mb-2 block text-sm font-medium text-slate-700"
                inputClassName="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 focus:outline-none"
                iconClassName="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <RenderFormButton
              buttonLabel="Reset Password"
              isDisabled={done}
              onSubmit={handleResetPassword}
              buttonClassName="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl disabled:opacity-50"
            />
          </RenderForm>

          <div className="mt-8 text-center">
            <a
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              <i className="fas fa-arrow-left"></i>
              Back to Login
            </a>
          </div>

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

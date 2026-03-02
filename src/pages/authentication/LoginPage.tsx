import { useAuth } from "@saintrelion/auth-lib";

import {
  RenderForm,
  RenderFormField,
  RenderFormButton,
} from "@saintrelion/forms";

const LoginPage = () => {
  const auth = useAuth();

  const handleLogin = async (data: Record<string, string>) => {
    await auth.login({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-white">
      <div className="flex w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-gray-900/60 shadow-2xl backdrop-blur-xl md:flex-row">
        {/* LEFT PANEL (Hidden on small screens) */}
        <div className="hidden items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-center md:flex md:w-1/2 md:flex-col">
          <h2 className="mb-4 text-3xl font-bold text-white">
            Teacher Profiling System
          </h2>
          <p className="mb-6 max-w-sm text-blue-100">
            Securely manage, update, and track teacher profiles with ease.
          </p>

          <img
            src="https://img.freepik.com/free-vector/teacher-concept-illustration_114360-7501.jpg"
            alt="Teaching Illustration"
            className="w-72 rounded-xl border border-white/20 shadow-xl"
          />
        </div>

        {/* RIGHT PANEL (Login Form) */}
        <div className="flex w-full flex-col justify-center space-y-6 p-8 md:w-1/2 md:p-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold">Welcome Back</h1>
            <p className="mt-1 text-sm text-gray-400">Login to continue</p>
          </div>

          {/* Form */}
          <RenderForm wrapperClassName="w-full max-w-md mx-auto bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl shadow-xl space-y-5">
            <RenderFormField
              field={{
                label: "Username",
                icon: true,
                type: "text",
                name: "username",
                placeholder: "teacher1",
              }}
              labelClassName="mb-1 block text-sm font-medium text-gray-300"
              iconClassName="fas fa-user absolute left-3 top-3 text-gray-400"
              inputClassName="w-full rounded-lg bg-gray-900 border border-gray-700 py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            <RenderFormField
              field={{
                label: "Password",
                icon: true,
                type: "password",
                name: "password",
                placeholder: "••••••••",
              }}
              labelClassName="mb-1 block text-sm font-medium text-gray-300"
              iconClassName="fas fa-lock absolute left-3 top-3 text-white"
              inputClassName="w-full rounded-lg bg-gray-900 border border-gray-700 py-2 pl-10 pr-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-blue-500" />
                <span className="text-gray-300">Remember me</span>
              </label>

              <a
                href="/forgot"
                className="text-blue-400 transition hover:text-blue-300"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <RenderFormButton
              buttonLabel="Login"
              onSubmit={handleLogin}
              isDisabled={auth.isLocked}
              buttonClassName="w-full bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg py-2 font-semibold shadow-lg"
            />
          </RenderForm>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

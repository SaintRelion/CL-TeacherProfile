import { firebaseLoginWithEmail, useAuth } from "@saintrelion/auth-lib";
import { useNavigate } from "react-router-dom";
import {
  RenderForm,
  RenderFormField,
  RenderFormButton,
} from "@saintrelion/forms";
import { useLockedAuth } from "@saintrelion/auth-lib/dist/FirebaseAuth";

const LoginPage = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const { run: loginLocking, isLocked: isLoggingIn } = useLockedAuth(
    firebaseLoginWithEmail,
  );

  const handleLogin = (data: Record<string, string>) => {
    loginLocking(data.email, data.password, setUser, () => {
      navigate("/admin");
    });
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
          {/* Title */}
          <div className="mb-4 text-center">
            <h1 className="mb-1 text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-gray-400">
              Login to your teacher account
            </p>
          </div>

          {/* Form */}
          <RenderForm
            wrapperClass="mx-auto w-full max-w-sm space-y-5 rounded-xl bg-gray-900 p-6 shadow-lg"
            onSubmit={handleLogin}
          >
            <RenderFormField
              field={{
                label: "Email",
                icon: true,
                type: "email",
                name: "email",
                placeholder: "user@gmail.com",
              }}
              labelClassName="mb-1 block text-sm font-medium text-gray-300"
              iconClassName="fas fa-envelope absolute top-3 left-3 text-gray-400"
              inputClassName="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
              iconClassName="fas fa-lock absolute top-3 left-3 text-gray-400"
              inputClassName="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300">Remember me</span>
              </label>
              <a href="/forgot" className="text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <RenderFormButton
              buttonClassName="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
              buttonLabel="Login"
              isDisabled={isLoggingIn}
            />
          </RenderForm>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

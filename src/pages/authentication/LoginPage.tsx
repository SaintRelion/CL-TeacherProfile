import {
  firebaseLoginWithEmail,
  firebaseLoginWithOtherInfo,
  registerUser,
  useAuth,
} from "@saintrelion/auth-lib";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { RenderFormButton } from "../to-be-library/forms/render-form-button";
import { firebaseRegister } from "@saintrelion/data-access-layer";

interface LoginFormInputs {
  email: string;
  password: string;
  remember: boolean;
}

const LoginPage = () => {
  const form = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin: SubmitHandler<LoginFormInputs> = (data) => {
    console.log("Login submitted:", data);
    // You can trigger API call or context login logic here

    firebaseLoginWithEmail(
      data.email,
      data.password,
      setUser,
      (loggedInUser) => {
        navigate("/");

        console.log(loggedInUser.createdAt);
      },
    );

    // registerUser(data.email, data.password, { remember: data.remember });
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
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="mx-auto w-full max-w-sm space-y-5 rounded-xl bg-gray-900 p-6 shadow-lg"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Email
                </label>
                <div className="relative">
                  <i className="fas fa-envelope absolute top-3 left-3 text-gray-400"></i>
                  <input
                    type="email"
                    id="email"
                    {...register("email", { required: "Email is required" })}
                    placeholder="teacher@school.edu"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-3 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <i className="fas fa-lock absolute top-3 left-3 text-gray-400"></i>
                  <input
                    type="password"
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 py-2 pr-10 pl-10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-300">Remember me</span>
                </label>
                <a href="#" className="text-blue-400 hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <RenderFormButton
                buttonClass="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
                buttonLabel="Login"
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

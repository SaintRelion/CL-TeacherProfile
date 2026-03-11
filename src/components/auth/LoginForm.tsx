import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormButton,
  RenderFormField,
} from "@saintrelion/forms";
import { Link } from "react-router-dom";

type LoginFormProps = {
  wrapperClassName?: string;
  onLoginSuccess?: () => void;
};

const LoginForm = ({ wrapperClassName, onLoginSuccess }: LoginFormProps) => {
  const auth = useAuth();

  const handleLogin = async (data: Record<string, string>) => {
    await auth.login({
      username: data.username,
      password: data.password,
    });

    onLoginSuccess?.();
  };

  return (
    <RenderForm wrapperClassName={wrapperClassName ?? "space-y-4"}>
      <RenderFormField
        field={{
          label: "Username",
          icon: true,
          type: "text",
          name: "username",
          placeholder: "Enter your username",
        }}
        labelClassName="mb-1 block text-sm font-medium text-secondary-700"
        iconClassName="fas fa-user absolute left-3 top-3 text-secondary-400"
        inputClassName="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-secondary-900 placeholder-primary-300 focus:border-transparent focus:ring-2 focus:ring-primary-500 focus:outline-none"
      />
      <RenderFormField
        field={{
          label: "Password",
          icon: true,
          type: "password",
          name: "password",
          placeholder: "Enter your password",
        }}
        labelClassName="mb-1 block text-sm font-medium text-secondary-700"
        iconClassName="fas fa-lock absolute left-3 top-3 text-secondary-400"
        inputClassName="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-secondary-900 placeholder-primary-300 focus:border-transparent focus:ring-2 focus:ring-primary-500 focus:outline-none"
      />

      <div className="flex items-center justify-between">
        
        <Link
          to="/forgot"
          className="text-sm text-primary-600 transition-colors hover:text-primary-800"
        >
          Forgot password?
        </Link>
      </div>

      <RenderFormButton
        buttonLabel="Login"
        onSubmit={handleLogin}
        isDisabled={auth.isLocked}
        buttonClassName="w-full rounded-md bg-primary-600 py-2 font-semibold text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
      />
    </RenderForm>
  );
};

export default LoginForm;

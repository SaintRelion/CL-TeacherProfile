import { useState } from "react";
import { useAuth } from "@saintrelion/auth-lib";
import {
  RenderForm,
  RenderFormField,
  RenderFormButton,
} from "@saintrelion/forms";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const LoginModal = ({ open, onClose }: Props) => {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (data: Record<string, string>) => {
    await auth.login({
      username: data.username,
      password: data.password,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gray-800 shadow-2xl md:flex">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-200 hover:text-white"
        >
          ✕
        </button>

        {/* RIGHT PANEL */}
        <div className="w-full p-8 font-bold md:w-1/2">
          <RenderForm wrapperClassName="space-y-5">
            {/* USERNAME */}
            <RenderFormField
              field={{
                label: "USERNAMES",
                icon: true,
                type: "text",
                name: "username",
                placeholder: "teacher1",
              }}
              labelClassName="text-gray-300"
              inputClassName="w-full rounded-lg bg-gray-800 border border-gray-700 py-2 px-3 text-white focus:ring-2 focus:ring-blue-500"
            />

            {/* PASSWORD WITH TOGGLE */}
            <div className="relative">
              <RenderFormField
                field={{
                  label: "PASSWORD",
                  icon: true,
                  type: showPassword ? "text" : "password",
                  name: "password",
                  placeholder: "••••••••",
                }}
                labelClassName="text-gray-300"
                inputClassName="w-full rounded-lg bg-gray-800 border border-gray-700 py-2 pl-3 pr-11 text-white focus:ring-2 focus:ring-blue-500"
              />

              {/* EYE ICON BUTTON */}
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-[38px] right-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <RenderFormButton
              buttonLabel="LOGIN"
              onSubmit={handleLogin}
              isDisabled={auth.isLocked}
              buttonClassName="w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-white font-semibold"
            />
          </RenderForm>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

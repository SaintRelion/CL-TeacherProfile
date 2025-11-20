import { firebaseLogout, useAuth } from "@saintrelion/auth-lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLockedAuth } from "@saintrelion/auth-lib/dist/FirebaseAuth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  const { run: lockingFirebaseLogOut, isLocked: isLoggingOut } =
    useLockedAuth(firebaseLogout);

  return (
    <header className="bg-primary-800 sticky top-0 z-50 text-white shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-accent-500 rounded-lg p-2">
              <i className="fas fa-graduation-cap text-xl text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">TeacherHub Pro</h1>
              <p className="text-primary-200 text-xs">
                Educational Administration Platform
              </p>
            </div>
          </div>

          <div className="mx-8 hidden max-w-md flex-1 md:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teachers, documents, or records..."
                className="bg-primary-700 border-primary-600 placeholder-primary-300 focus:ring-accent-500 w-full rounded-lg border py-2 pr-4 pl-10 text-white focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <i className="fas fa-search text-primary-300 absolute top-1/2 left-3 -translate-y-1/2 transform"></i>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-primary-200 relative p-2 transition-colors hover:text-white">
              <i className="fas fa-bell text-lg"></i>
              <span className="bg-accent-500 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white">
                3
              </span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="group flex cursor-pointer items-center space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"
                    alt="Admin Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium transition-colors duration-150 group-hover:text-white/70">
                    {user.email}
                  </span>
                  <i className="fas fa-chevron-down text-primary-300 group-hover:text-primary-600 text-xs transition-colors duration-150"></i>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="mt-2 w-44 rounded-lg border border-gray-200 bg-white py-2 text-sm text-gray-700 shadow-lg"
              >
                <DropdownMenuItem className="hover:bg-primary-50 hover:text-primary-600 px-4 py-2 transition-colors duration-150">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-primary-50 hover:text-primary-600 px-4 py-2 transition-colors duration-150">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    lockingFirebaseLogOut(() => {
                      navigate("/login");
                    })
                  }
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-4 py-2 font-medium text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;

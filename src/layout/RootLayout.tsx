import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@saintrelion/auth-lib";
import { Outlet } from "react-router-dom";
import { useIsPathPublic } from "@saintrelion/routers";

const RootLayout = () => {
  const isPublic = useIsPathPublic();

  const { user } = useAuth();
  return (
    <>
      {isPublic != "" ? (
        <Outlet />
      ) : (
        <div className="min-h-lvh">
          <Navbar />
          {user.role == "instructor" ? (
            <Outlet />
          ) : (
            <div className="flex min-h-screen">
              <AdminSidebar />
              <Outlet />
            </div>
          )}
        </div>
      )}
    </>
  );
};
export default RootLayout;

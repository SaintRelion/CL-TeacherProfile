import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-lvh">
      <Navbar />
      {location.pathname == "/teacherprofile" ? (
        <Outlet />
      ) : (
        <div className="flex min-h-screen">
          <Sidebar />
          <Outlet />
        </div>
      )}
    </div>
  );
};
export default RootLayout;

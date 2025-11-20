import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-lvh">
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
};
export default RootLayout;

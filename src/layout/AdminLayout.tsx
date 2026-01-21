import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-lvh">
      <Navbar />
      <div className="flex min-h-screen">
        <AdminSidebar />
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;

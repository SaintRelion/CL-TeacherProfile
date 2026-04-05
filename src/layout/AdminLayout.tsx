import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = (): void => {
      if (window.innerWidth >= 800) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex w-full">
        {" "}
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        <div className="flex w-full min-w-0 flex-1 flex-col transition-all duration-300">
          <Navbar toggleSidebar={() => setSidebarOpen(true)} />

          <main className="z-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

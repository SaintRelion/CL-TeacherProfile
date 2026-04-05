import { useState } from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-50">
      {/* Navbar stays full width at the top */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="relative flex min-h-0 w-full flex-1 overflow-hidden">
        {/* The Sidebar is now a sibling to the Main Content */}
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* Internal Backdrop only for mobile content */}
          <div
            onClick={() => setSidebarOpen(false)}
            className={`absolute inset-0 z-20 bg-slate-900/5 backdrop-blur-[1px] transition-all duration-300 lg:hidden ${
              sidebarOpen
                ? "visible opacity-100"
                : "pointer-events-none invisible opacity-0"
            }`}
          />

          <main className="custom-scrollbar flex-1 overflow-y-auto p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

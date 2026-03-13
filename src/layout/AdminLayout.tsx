import { useState } from "react";
import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      
      <Navbar toggleSidebar={() => setSidebarOpen(true)} />

      <div className="flex">
        
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        {/* Content */}
        <main className="flex-1 p-4 lg:ml-64 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
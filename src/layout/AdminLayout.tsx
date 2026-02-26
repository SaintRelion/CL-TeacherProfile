import Navbar from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Outlet } from "react-router-dom";

import { useResponsive } from "@/hooks/useResponsive";

const AdminLayout = () => {

  const { isMobile } = useResponsive();  // ✅ inside component

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      
      <Navbar />
      <div className="flex flex-1 overflow-hidden">    
       {/* Example usage */}
        {!isMobile && <AdminSidebar />}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;
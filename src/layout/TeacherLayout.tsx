import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const TeacherLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-lvh">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Outlet />
    </div>
  );
};
export default TeacherLayout;
